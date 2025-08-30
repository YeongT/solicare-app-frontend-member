import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { useAuth } from '../contexts/AuthContext';
// import { signUpApi } from '../api/auth';
import { mockSignUpApi as signUpApi } from '../api/mockAuth';


// import { joinMember, JoinRequest } from '../api/auth';


interface JoinRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
};

const initialState: JoinRequest = {
  name: '',
  email: '',
  phoneNumber: '',
  password: '',
};

// 휴대폰 번호 포맷팅 함수
const formatPhoneNumber = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');
  
  // 길이에 따라 하이픈 추가
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};

// 이메일 형식 검증 함수
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Signup: React.FC = () => {
  const [form, setForm] = useState<JoinRequest>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();



  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 에러 메시지 초기화
    setError(null);
    setSuccess(null);
    
    if (name === 'phoneNumber') {
      // 휴대폰 번호인 경우 포맷팅 적용
      const formattedValue = formatPhoneNumber(value);
      setForm(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    // 이메일 형식 검증
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('올바른 이메일 형식으로 입력해주세요.');
      } else {
        setEmailError(null);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 이메일 형식 검증
    if (!validateEmail(form.email)) {
      setEmailError('올바른 이메일 형식으로 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await signUpApi(form.name, form.email, form.phoneNumber, form.password);
      
      if (data.isSuccess && data.result) {
        // 회원가입 성공 시에만 로그인 처리 및 대시보드로 이동
        login(data.result.token, form.name);
        navigate('/dashboard');
      } else {
        // 회원가입 실패 시 에러 메시지 표시하고 폼 초기화
        setError(data.message || '회원가입에 실패했습니다.');
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
      const res = await joinMember(form);
      if (res.isSuccess) {
        setSuccess('회원가입 완료! 로그인 후 대시보드로 이동하세요.');
        setTimeout(() => navigate('/login'), 800);
      } else {
        setError(res.message || '회원가입 실패');
      }
    } catch (err: any) {
      setError(err.message || '오류 발생');
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">회원가입</h2>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-row">
            <label className="form-label" htmlFor="name">이름</label>
            <input
              className="form-input"
              id="name"
              name="name"
              placeholder="이름을 입력하세요"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

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
            <label className="form-label" htmlFor="phoneNumber">휴대폰 번호</label>
            <input
              className="form-input"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="010-1234-5678"
              value={form.phoneNumber}
              onChange={onChange}
              maxLength={13}
              required
            />
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input
              className="form-input"
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <p className="auth-footer-text">
          이미 계정이 있으신가요? <a className="auth-link" href="/login">로그인</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
