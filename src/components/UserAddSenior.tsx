import React, { useState, useEffect } from "react";
import "./UserAddSenior.css";
import { Senior } from "../types/senior";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<Senior, 'monitorUserUuid'>) => void;
}

const SeniorModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const initialState = React.useMemo<Omit<Senior, 'monitorUserUuid'>>(() => ({
    name: "",
    userId: "",
    password: "",
    gender: "OTHER",
    age: 0,
    phoneNumber: "",
    address: "",
    note: "",
  }), []);

  const [form, setForm] = useState(initialState);

    useEffect(() => {
      if (!isOpen) setForm(initialState);
    }, [isOpen, initialState]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    if (name === "phoneNumber") {
      value = value.replace(/\D/g, "");
      if (value.length > 3 && value.length <= 7) value = value.replace(/(\d{3})(\d+)/, "$1-$2");
      else if (value.length > 7) value = value.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    }
    if (name === "age") value = value.replace(/\D/g, "");
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { name, userId, password, gender, age, address } = form;
    if (!name || !userId || !password || !gender || !age || !address) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    onAdd(form);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">사용자 추가</h3>
        <input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
        <input name="userId" placeholder="ID" value={form.userId} onChange={handleChange} />
        <input type="password" name="password" placeholder="PW" value={form.password} onChange={handleChange} />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
          <option value="OTHER">기타</option>
        </select>
        <input name="age" placeholder="나이" value={form.age} onChange={handleChange} />
        <input name="phoneNumber" placeholder="전화번호" value={form.phoneNumber} onChange={handleChange} />
        <input name="address" placeholder="주소" value={form.address} onChange={handleChange} />
        <textarea name="note" placeholder="특이사항" value={form.note} onChange={handleChange} />
        <div className="modal-actions">
          <button className="btn-add" onClick={handleSubmit}>추가</button>
          <button className="btn-cancel" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default SeniorModal;
