import React, { useState } from 'react';
import './UserAddSenior.css';
import { AddSeniorRequestBody } from '../types/api';

interface AddSeniorEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClickAdd: () => void;
  onQuickAdd: (data: { userId: string; password: string }) => void;
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

  if (!isOpen) return null;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addSeniorData.userId || !addSeniorData.password) {
      alert('ID와 비밀번호를 모두 입력해주세요.');
      return;
    }
    onQuickAdd(addSeniorData);
    setAddSeniorData({ userId: '', password: '' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">대상자 추가</h3>
        <form
          onSubmit={handleQuickAdd}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <input
            name="userId"
            placeholder="ID"
            value={addSeniorData.userId}
            onChange={(e) =>
              setAddSeniorData({ ...addSeniorData, userId: e.target.value })
            }
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={addSeniorData.password}
            onChange={(e) =>
              setAddSeniorData({ ...addSeniorData, password: e.target.value })
            }
            autoComplete="new-password"
          />
          <button className="btn-add" type="submit">
            간편 추가
          </button>
        </form>
        <div style={{ margin: '16px 0', textAlign: 'center', color: '#888' }}>
          또는
        </div>
        <div className="modal-actions">
          <button className="btn-add" onClick={onClickAdd}>
            신규 대상자 추가
          </button>
          <button className="btn-cancel" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSeniorEntryModal;
