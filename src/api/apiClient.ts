import axios from 'axios';
import { deleteCookie, getCookie } from '../utils/cookies';

const BASE_URL =
  process.env.REACT_APP_BASE_API_URL || 'https://dev-api.solicare.kro.kr/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.data.isSuccess) {
      return response.data.body ?? null; // body가 없으면 null 반환
    }
    // console.error('API 오류:', response.data.errors); // 경고 방지: 주석 처리
    // 서버 실패 응답을 Error 객체로 throw
    const error: Error & { code?: string } = new Error(
      response.data.message || '알 수 없는 오류가 발생했습니다.'
    );
    error.code = response.data.code;
    return Promise.reject(error);
  },
  (error) => {
    if (error.response?.status === 401) {
      alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      deleteCookie('accessToken');
      deleteCookie('userName');
      window.location.href = '/login';
    }
    // 서버에서 온 message가 있으면 그대로 Error로 throw
    if (error.response?.data?.message) {
      const err: Error & { code?: string } = new Error(
        error.response.data.message
      );
      err.code = error.response.data.code;
      return Promise.reject(err);
    }
    return Promise.reject(error);
  }
);
