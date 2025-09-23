// 401 인증 만료 alert 중복 방지 플래그
// 401 인증 만료 시 SPA 친화적 로그아웃 처리 (팝업/새로고침 없이)
let isAuthAlertShown = false;
import axios from 'axios';
import { deleteCookie, getCookie } from '../utils/cookies';

const BASE_URL =
  process.env.REACT_APP_BASE_API_URL || 'http://localhost:8080/api';

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
    // 서버 실패 응답을 Error 객체로 throw
    const error: Error & { code?: string } = new Error(
      response.data.message || '알 수 없는 오류가 발생했습니다.'
    );
    error.code = response.data.code;
    return Promise.reject(error);
  },
  (error) => {
    if (error.response?.status === 401) {
      if (!isAuthAlertShown) {
        isAuthAlertShown = true;
        // 인증 만료 시 쿠키만 삭제하고, 전역 상태(user)는 AuthContext에서 null로 처리
        deleteCookie('accessToken');
        deleteCookie('userName');
        // SPA에서는 라우터에서 user === null일 때 자동으로 /login 리다이렉트
        // (팝업/새로고침 없이 UX 개선)
      }
      return;
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
