import React from 'react';
import '../styles/auth.css';
import { loginMember, LoginRequest } from '../api/auth';

const initialState: LoginRequest = {
  phoneNumber: '',
  password: '',
};

const Login: React.FC = () => {
  const [form, setForm] = React.useState<LoginRequest>(initialState);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginMember(form);
      if (res.isSuccess) {
        localStorage.setItem('auth_token', res.result.token);
        window.location.hash = '#/dashboard';
      } else {
        setError(res.message || '로그인에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">로그인</h2>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-row">
            <label className="form-label" htmlFor="phoneNumber">휴대폰 번호</label>
            <input className="form-input" id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={onChange} required />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input className="form-input" type="password" id="password" name="password" value={form.password} onChange={onChange} required />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? '처리 중...' : '로그인'}
          </button>
        </form>
        <p className="auth-footer-text">계정이 없으신가요? <a className="auth-link" href="#/signup">회원가입</a></p>
      </div>
    </div>
  );
};

export default Login;
