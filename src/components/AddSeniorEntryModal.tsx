import React, { useState, useEffect, useRef } from 'react';
import './UserAddSenior.css';
import { AddSeniorRequestBody } from '../types/api';

interface AddSeniorEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClickAdd: () => void;
  onQuickAdd: (data: { userId: string; password: string }) => Promise<string>;
}

const AddSeniorEntryModal: React.FC<AddSeniorEntryModalProps> = ({
  isOpen,
  onClose,
  onClickAdd,
  onQuickAdd,
}) => {
  const [addSeniorData, setAddSeniorData] = useState<AddSeniorRequestBody>({
    userId: '',
    password: '',
  });
  const [message, setMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!addSeniorData.userId) {
      setMessage({ type: 'error', text: 'ID를 입력해주세요.' });
      return;
    }
    if (!addSeniorData.password) {
      setMessage({ type: 'error', text: '비밀번호를 입력해주세요.' });
      return;
    }
    const resultMsg = await onQuickAdd(addSeniorData);
    if (typeof resultMsg === 'string' && resultMsg.includes('성공')) {
      setMessage({ type: 'success', text: resultMsg });
      setAddSeniorData({ userId: '', password: '' });
    } else {
      setMessage({ type: 'error', text: resultMsg || '추가에 실패했습니다.' });
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card modal-card-large"
        ref={modalRef}
        tabIndex={-1}
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
        <h3 className="modal-title modal-title-gap">모니터링 대상 추가</h3>
        <form
          onSubmit={handleQuickAdd}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginBottom: 36,
          }}
        >
          <input
            name="userId"
            placeholder="ID"
            value={addSeniorData.userId}
            onChange={(e) => {
              setAddSeniorData({ ...addSeniorData, userId: e.target.value });
              if (message) setMessage(null);
            }}
            autoComplete="username"
            onFocus={() => message && setMessage(null)}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={addSeniorData.password}
            onChange={(e) => {
              setAddSeniorData({ ...addSeniorData, password: e.target.value });
              if (message) setMessage(null);
            }}
            autoComplete="new-password"
            onFocus={() => message && setMessage(null)}
          />
        </form>
        {message && (
          <div
            className={`modal-message ${message.type === 'error' ? 'modal-message-error' : 'modal-message-success'}`}
          >
            {message.text}
          </div>
        )}
        <div
          className="modal-actions modal-actions-between modal-actions-right"
          style={{ marginBottom: 8 }}
        >
          <button className="btn-create" onClick={onClickAdd} type="button">
            새로 생성
          </button>
          <button className="btn-add" type="button" onClick={handleQuickAdd}>
            간편 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSeniorEntryModal;
