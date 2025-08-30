import axios from 'axios';
import { getCookie, deleteCookie } from '../utils/cookies';
import { isTokenExpired } from '../utils/jwt';
import { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'https://dev-api.solicare.kro.kr/api/member';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getCookie('jwt');
  if (token) {
    if (isTokenExpired(token)) {
      deleteCookie('jwt');
      window.location.href = '/login';
      return Promise.reject('Token expired');
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 401 처리 - 회원가입/로그인 요청은 제외
apiClient.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // 회원가입이나 로그인 요청이 아닌 경우에만 로그인 페이지로 리다이렉트
      const isAuthRequest = err.config?.url?.includes('/member/join') || err.config?.url?.includes('/member/login');
      if (!isAuthRequest) {
        deleteCookie('jwt');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
