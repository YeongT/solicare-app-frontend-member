import React from 'react';
import './HealthMetricsCard.css';

const HealthMetricsCard: React.FC = () => {
  return (
    <div className="health-metrics-card">
      <div className="metrics-container">
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">❤️</span>
            <span className="metric-title">심박수 77 bpm</span>
          </div>
          <div className="metric-graph">
            <svg className="heart-rate-graph" viewBox="0 0 200 60" preserveAspectRatio="none">
              <path
                d="M0,30 Q20,10 40,30 T80,30 T120,30 T160,30 T200,30"
                stroke="#ff4444"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
        
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">🌡️</span>
            <span className="metric-title">체온 36.7 도</span>
          </div>
          <div className="metric-graph">
            <svg className="temperature-graph" viewBox="0 0 200 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#ff4444', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: '#ff4444', stopOpacity: 0.1}} />
                </linearGradient>
              </defs>
              <path
                d="M0,40 Q50,35 100,30 T200,25"
                stroke="#ff4444"
                strokeWidth="2"
                fill="url(#tempGradient)"
              />
              <text x="10" y="15" fontSize="8" fill="#666">36.5</text>
              <text x="180" y="55" fontSize="8" fill="#666">시간</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetricsCard;


