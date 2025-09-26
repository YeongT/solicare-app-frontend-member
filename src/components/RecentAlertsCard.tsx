// import React from 'react';
import React, { useState, useEffect } from 'react';
import './RecentAlertsCard.css';
import { SeniorDetailResponseBody, SeniorAlert } from '../types/api';

interface RecentAlertsCardProps {
  seniorDetail: SeniorDetailResponseBody;
  className?: string;
}

const RecentAlertsCard: React.FC<RecentAlertsCardProps> = ({
  seniorDetail,
  className,
}) => {
  const [alerts, setAlerts] = useState<SeniorAlert[]>([]);

  // 초기 데이터 생성
  useEffect(() => {
    if (seniorDetail && seniorDetail.alerts.length > 0) {
      setAlerts(seniorDetail.alerts.reverse());
      return;
    }
    const initialData: SeniorAlert[] = [
      {
        uuid: '',
        eventType: '낙상감지',
        timestamp: '2025.07.30 17:55:22',
        isRead: false,
      },
      {
        uuid: '',
        eventType: '심박수 이상',
        timestamp: '2025.07.28 09:15:47',
        isRead: false,
      },
      {
        uuid: '',
        eventType: '낙상감지',
        timestamp: '2025.07.20 11:32:18',
        isRead: true,
      },
    ];
    setAlerts(initialData);
  }, [seniorDetail]);

  // 읽지 않은 알림 개수 계산
  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const badgeCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className={`recent-alerts-card${className ? ` ${className}` : ''}`}>
      <div
        className="card-header"
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <h3 style={{ margin: 0 }}>최근 알림</h3>
        {unreadCount > 0 && <span className="alert-badge">{badgeCount}</span>}
      </div>
      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`alert-item${alert.isRead ? ' alert-read' : ' alert-unread'}`}
          >
            <div className="alert-type">{alert.eventType}</div>
            <div className="alert-timestamp">{alert.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlertsCard;
