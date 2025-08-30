import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { useAuth } from '../contexts/AuthContext';
// import apiClient from '../api/apiClient';
// import { loginApi } from '../api/auth';
import { mockLoginApi as loginApi } from '../api/mockAuth';

interface LoginForm {
  email: string;
  password: string;
}

/*
interface LoginResponse {
  isSuccess: boolean;
  message?: string;
  result: {
    token: string;
    name: string;
  };
}
  */

// 이메일 형식 검증 함수
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const initialState: LoginForm = { email: '', password: '' };

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 입력 값 변경 처리
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 에러 메시지 초기화
    setError(null);
    
    setForm(prev => ({ ...prev, [name]: value }));

    // 이메일 형식 검증
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('올바른 이메일 형식으로 입력해주세요.');
      } else {
        setEmailError(null);
      }
    }
  };

  // 로그인 폼 제출
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 이메일 형식 검증
    if (!validateEmail(form.email)) {
      setEmailError('올바른 이메일 형식으로 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await loginApi(form.email, form.password);
      
      if (data.isSuccess && data.result) {
        // 로그인 성공 시 대시보드로 이동
        login(data.result.token, data.result.name);
        navigate('/dashboard');
      } else {
        // 로그인 실패 시 에러 메시지 표시하고 폼 초기화
        setError(data.message || '로그인에 실패했습니다.');
        setForm(initialState);
        setEmailError(null);
        // 1초 후 에러 메시지 자동 제거
        setTimeout(() => setError(null), 1000);
      }
    } catch (err: any) {
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
      setForm(initialState);
      setEmailError(null);
      // 1초 후 에러 메시지 자동 제거
      setTimeout(() => setError(null), 1000);
    } finally {
      setLoading(false);
    }
    /*
    try {
      const res = await apiClient.post('/login', form);
      const output = res.data.response;       // MemberLoginOutput
      if (output.status === 'SUCCESS') {
        const { token, name } = output.response;
        login(token, name);                   // Context에 저장
        navigate('/dashboard');
      } else if (output.status === 'USER_NOT_FOUND') {
        alert('사용자를 찾을 수 없습니다.');
      } else if (output.status === 'INVALID_PASSWORD') {
        alert('비밀번호가 잘못되었습니다.');
      } else {
        alert('로그인 실패');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류 발생');
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">로그인</h2>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-row">
            <label className="form-label" htmlFor="email">이메일</label>
            <input
              className={`form-input ${emailError ? 'form-input-error' : ''}`}
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={onChange}
              required
            />
            {emailError && <div className="form-error">{emailError}</div>}
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input
              className="form-input"
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? '처리 중...' : '로그인'}
          </button>
        </form>

        <p className="auth-footer-text">
          계정이 없으신가요? <a className="auth-link" href="/signup">회원가입</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
