import React from 'react';
import './RecentAlertsCard.css';

const RecentAlertsCard: React.FC = () => {
  const alerts = [
    {
      type: '낙상감지',
      timestamp: '2025.07.30 17:55:22',
    },
    {
      type: '낙상감지',
      timestamp: '2025.07.20 11:32:18',
    },
  ];

  return (
    <div className="recent-alerts-card">
      <div className="card-header">
        <h3>최근 알림</h3>
      </div>
      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div key={index} className="alert-item">
            <div className="alert-type">{alert.type}</div>
            <div className="alert-timestamp">{alert.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlertsCard;
