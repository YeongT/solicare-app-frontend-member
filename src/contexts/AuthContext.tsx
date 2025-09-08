import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { join as apiJoin, login as apiLogin } from '../api/member';
import { JoinRequestBody, LoginRequestBody } from '../types/api';
import { deleteCookie, getCookie, setCookie } from '../utils/cookies';
import { getJwtExpiration, getJwtUuid, isTokenExpired } from '../utils/jwt';

interface AuthContextType {
  user: User | null;
  login: (loginData: LoginRequestBody) => Promise<boolean>;
  signup: (joinData: JoinRequestBody) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface User {
  name: string;
  uuid: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token && !isTokenExpired(token)) {
      const uuid = getJwtUuid(token);
      const name = getCookie('userName') || '사용자'; // 필요 시 프로필 조회 API로 실제 이름 가져오기
      if (uuid) {
        setUser({ name, uuid });
      }
    }
  }, []);

  const login = async (loginData: LoginRequestBody): Promise<boolean> => {
    try {
      const responseBody = await apiLogin(loginData);
      if (!responseBody) {
        throw new Error('로그인 응답에 body가 없습니다.');
      }

      const { token, name } = responseBody;
      const uuid = getJwtUuid(token);
      const expires = getJwtExpiration(token);

      setCookie('accessToken', token, expires);
      setCookie('userName', name, expires);

      if (uuid) {
        setUser({ name, uuid });
      } else {
        setUser({ name, uuid: '' });
      }
      return true;
    } catch (error) {
      // console.error('Context 로그인 실패:', error); // 경고 방지: 주석 처리
      logout();
      if (error instanceof Error) {
        throw new Error(error.message || '로그인에 실패했습니다.');
      }
      throw new Error('로그인에 실패했습니다.');
    }
  };

  const logout = (): void => {
    deleteCookie('accessToken');
    deleteCookie('userName');
    setUser(null);
  };

  const signup = async (joinData: JoinRequestBody): Promise<boolean> => {
    try {
      const responseBody = await apiJoin(joinData);
      if (!responseBody?.token) {
        // 서버에서 온 message를 error로 throw (apiClient에서 message를 error로 넘김)
        throw new Error('회원가입 응답에 토큰이 없습니다.');
      }

      const { token } = responseBody;
      const uuid = getJwtUuid(token);
      const expires = getJwtExpiration(token);

      setCookie('accessToken', token, expires);
      setCookie('userName', joinData.name, expires);

      // 회원가입 시 입력받은 이름을 사용해 user 상태 설정
      if (uuid) {
        setUser({ name: joinData.name, uuid });
      } else {
        throw new Error('토큰에서 UUID를 추출할 수 없습니다.');
      }
      return true;
    } catch (error) {
      // console.error('Context 회원가입 실패:', error); // 경고 방지: 주석 처리
      logout(); // 실패 시 확실하게 로그아웃 처리
      if (error instanceof Error) {
        throw new Error(error.message || '회원가입에 실패했습니다.');
      }
      throw new Error('회원가입에 실패했습니다.');
    }
  };

  // JWT에서 토큰 만료 여부로 인증 상태를 실시간으로 확인
  const isAuthenticated = (() => {
    const token = getCookie('accessToken');
    return !!token && !isTokenExpired(token);
  })();

  const authValue = { user, login, signup, logout, isAuthenticated };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.');
  }
  return context;
};
