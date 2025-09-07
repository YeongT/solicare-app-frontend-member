export {};
/*
// api/auth.ts
import apiClient from './apiClient';
import { mapBackendJoinOutput, mapBackendLoginOutput } from '../utils/mapBackend';
import { SignUpResponse, LoginResponse } from '../types/member';

export async function signUpApi(name: string, email: string, phoneNumber: string, password: string): Promise<SignUpResponse> {
  try {
    const res = await apiClient.post('/member/join', { name, email, phoneNumber, password });
    return mapBackendJoinOutput(res.data);
  } catch (err: any) { 
    console.error('회원가입 오류', err);
    return { isSuccess: false, message: '서버 오류 발생' }; 
  }
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await apiClient.post('/member/login', { email, password });
    
    const { token } = res.data.body;
    return mapBackendLoginOutput(res.data);
  } catch (err: any) { 
    console.error('로그인 오류', err);
    return { isSuccess: false, message: '서버 오류 발생' }; 
  }
}
*/
