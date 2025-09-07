import { apiClient } from './apiClient';
import { LoginRequestBody, LoginResponseBody, JoinRequestBody, JoinResponseBody } from '../types/api';

/**
 * 로그인 API
 */
export const login = (loginData: LoginRequestBody): Promise<LoginResponseBody | null> => {
  return apiClient.post('/member/login', loginData);
};

// 회원가입 API
export const join = (joinData: JoinRequestBody): Promise<JoinResponseBody | null> => {
  return apiClient.post('/member/join', joinData);
};
