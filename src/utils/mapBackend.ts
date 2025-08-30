// utils/mapBackend.ts
import { SignUpResponse, LoginResponse } from '../types/auth';

// 회원가입 응답 매칭
export function mapBackendJoinOutput(backendData: any): SignUpResponse {
  const { status, response, exception } = backendData;
  if (status === 'SUCCESS' && response) return { isSuccess: true, result: { token: response.token } };
  let message = status === 'USER_ALREADY_EXISTS' ? '이미 존재하는 사용자입니다.' : exception?.message || '회원가입 실패';
  return { isSuccess: false, message };
}

// 로그인 응답 매칭
export function mapBackendLoginOutput(backendData: any): LoginResponse {
  const { status, response, exception } = backendData;
  if (status === 'SUCCESS' && response) return { isSuccess: true, result: { token: response.token, name: response.name } };
  let message = status === 'USER_NOT_FOUND' ? '사용자를 찾을 수 없습니다.' :
                status === 'INVALID_PASSWORD' ? '비밀번호가 잘못되었습니다.' :
                exception?.message || '로그인 실패';
  return { isSuccess: false, message };
}


