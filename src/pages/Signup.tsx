import React from 'react';
import '../styles/auth.css';
import { joinMember, JoinRequest } from '../api/auth';

const initialState: JoinRequest = {
  name: '',
  elderlyName: '',
  phoneNumber: '',
  password: '',
  gender: 'MALE',
  address: '',
  age: 70,
  specialNote: '',
};

const Signup: React.FC = () => {
  const [form, setForm] = React.useState<JoinRequest>(initialState);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'age' ? Number(value) : value } as JoinRequest));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await joinMember(form);
      if (res.isSuccess) {
        setSuccess('회원가입이 완료되었습니다. 로그인 후 대시보드로 이동하세요.');
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 800);
      } else {
        setError(res.message || '회원가입에 실패했습니다.');
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
        <h2 className="auth-title">회원가입</h2>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-row">
            <label className="form-label" htmlFor="name">보호자 이름</label>
            <input className="form-input" id="name" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="elderlyName">피보호자 이름</label>
            <input className="form-input" id="elderlyName" name="elderlyName" value={form.elderlyName} onChange={onChange} required />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="phoneNumber">휴대폰 번호</label>
            <input className="form-input" id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={onChange} placeholder="010-1234-5678" required />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input className="form-input" type="password" id="password" name="password" value={form.password} onChange={onChange} required />
          </div>
          <div className="form-grid-2">
            <div className="form-row">
              <label className="form-label" htmlFor="gender">성별</label>
              <select className="form-input" id="gender" name="gender" value={form.gender} onChange={onChange}>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="age">나이</label>
              <input className="form-input" type="number" min={0} id="age" name="age" value={form.age} onChange={onChange} />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="address">주소</label>
            <input className="form-input" id="address" name="address" value={form.address} onChange={onChange} />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="specialNote">특이 사항</label>
            <textarea className="form-textarea" id="specialNote" name="specialNote" value={form.specialNote || ''} onChange={onChange} rows={3} />
          </div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>
        <p className="auth-footer-text">이미 계정이 있으신가요? <a className="auth-link" href="#/login">로그인</a></p>
      </div>
    </div>
  );
};

export default Signup;
