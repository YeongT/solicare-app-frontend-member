/*
// utils/mapBackend.ts
import { SignUpResponse, LoginResponse } from '../types/member';
import { getJwtSubject } from './jwt';

interface BackendResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    token?: string;
    name?: string;
  };
}

// 회원가입 응답 매칭
export function mapBackendJoinOutput(backendData: BackendResponse): SignUpResponse {
  const { isSuccess, code, message, result } = backendData;
  if (isSuccess && result) {
    return {
      isSuccess: true,
      message: '회원가입 성공',
      result: { token: result.token },
    };
  }
  // 실패 케이스: result가 null이거나 exception이 있을 때
  console.log('회원가입 실패 응답:', backendData);
  return { isSuccess: false, message };
}

// 로그인 응답 매칭
export function mapBackendLoginOutput(backendData: BackendResponse): LoginResponse {
  const { isSuccess, code, message, result } = backendData;
  if (isSuccess && result) {
    return {
      isSuccess: true,
      result: {
        token: result.token,
        name: result.name,
      },
    };
  }
  // 실패 케이스: result가 null이거나 exception이 있을 때
  console.log('로그인 실패 응답:', backendData);
  return { isSuccess: false, message };
}
*/
export {};
