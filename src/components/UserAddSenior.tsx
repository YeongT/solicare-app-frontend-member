import React, { useEffect, useState } from 'react';
import './UserAddSenior.css';
import { SeniorJoinRequestBody } from '../types/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: SeniorJoinRequestBody) => Promise<string>;
}

const SeniorModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const initialState = React.useMemo<SeniorJoinRequestBody>(
    () => ({
      name: '',
      userId: '',
      password: '',
      gender: 'MALE',
      age: 0,
      phoneNumber: '',
      address: '',
      note: '',
    }),
    []
  );

  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) setForm(initialState);
  }, [isOpen, initialState]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (message) setMessage(null);
    let { name, value } = e.target;
    if (name === 'phoneNumber') {
      value = value.replace(/\D/g, '');
      if (value.length > 3 && value.length <= 7)
        value = value.replace(/(\d{3})(\d+)/, '$1-$2');
      else if (value.length > 7)
        value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
    }
    if (name === 'age') value = value.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, userId, password, gender, age, address } = form;
    setMessage(null);
    if (!name) {
      setMessage({ type: 'error', text: '이름을 입력해주세요.' });
      return;
    }
    if (!userId) {
      setMessage({ type: 'error', text: 'ID를 입력해주세요.' });
      return;
    }
    if (!password) {
      setMessage({ type: 'error', text: '비밀번호를 입력해주세요.' });
      return;
    }
    if (!gender) {
      setMessage({ type: 'error', text: '성별을 선택해주세요.' });
      return;
    }
    if (!age) {
      setMessage({ type: 'error', text: '나이를 입력해주세요.' });
      return;
    }
    if (!address) {
      setMessage({ type: 'error', text: '주소를 입력해주세요.' });
      return;
    }
    // onAdd가 Promise<string>을 반환하도록 수정
    const resultMsg = await onAdd(form);
    if (typeof resultMsg === 'string' && resultMsg.includes('성공')) {
      setMessage({ type: 'success', text: resultMsg });
      setForm(initialState);
    } else {
      setMessage({
        type: 'error',
        text: resultMsg || '알 수 없는 오류가 발생했습니다.',
      });
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative' }}
      >
        <button
          className="modal-close-x"
          aria-label="닫기"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <div style={{ height: 36 }} />
        <h3 className="modal-title">모니터링 대상 생성</h3>
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          onFocus={() => message && setMessage(null)}
        />
        <input
          name="userId"
          placeholder="ID"
          value={form.userId}
          onChange={handleChange}
          onFocus={() => message && setMessage(null)}
        />
        <input
          type="password"
          name="password"
          placeholder="PW"
          value={form.password}
          onChange={handleChange}
          onFocus={() => message && setMessage(null)}
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          onFocus={() => message && setMessage(null)}
        >
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </select>
        <input
          name="age"
          placeholder="나이"
          value={form.age}
          onChange={handleChange}
          onFocus={() => message && setMessage(null)}
        />
        <input
          name="phoneNumber"
          placeholder="전화번호"
          value={form.phoneNumber}
          onChange={handleChange}
          onFocus={() => message && setMessage(null)}
        />
        <input
          name="address"
          placeholder="주소"
          value={form.address}
          onChange={handleChange}
          onFocus={() => message && setMessage(null)}
        />
        <textarea
          name="note"
          placeholder="특이사항"
          value={form.note}
          onChange={handleChange}
          onFocus={() => message && setMessage(null)}
        />
        {message && (
          <div
            className={`modal-message ${message.type === 'error' ? 'modal-message-error' : 'modal-message-success'}`}
          >
            {message.text}
          </div>
        )}
        <div className="modal-actions modal-actions-bottom-right">
          <button className="btn-add btn-add-small" onClick={handleSubmit}>
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeniorModal;
