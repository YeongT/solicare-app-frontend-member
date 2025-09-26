import React from 'react';
import './AlertModal.css';
import { EventDetailResponseBody, SeniorDetailResponseBody } from '../types/api';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: EventDetailResponseBody | null;
  seniorData: SeniorDetailResponseBody | null; // 시니어 상세 정보를 props로 받음
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, eventData, seniorData }) => {
  // 모달이 열려있고, 두 데이터가 모두 준비되었을 때만 렌더링
  if (!isOpen || !eventData || !seniorData) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="alert-icon">!</div>
          {/* 이벤트 타입은 eventData에서 가져옴 */}
          <h2 className="modal-title">{eventData.eventType}</h2>
          {/* 타임스탬프도 eventData에서 가져옴 */}
          <p className="modal-timestamp">{new Date(eventData.timestamp).toLocaleString()}</p>
        </div>
        
        <hr className="divider" />
        
        <div className="modal-body">
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            {/* 이름은 seniorData에서 가져옴 */}
            <span>{seniorData.profile.name} 님</span>
          </div>
          <div className="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {/* 주소도 seniorData에서 가져옴 */}
            <span>{seniorData.profile.address}</span>
          </div>
        </div>

        <hr className="divider" />

        <div className="modal-actions">
          <button className="modal-button confirm-button">카메라 확인</button>
          <button className="modal-button close-button" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;