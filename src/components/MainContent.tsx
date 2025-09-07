import React from 'react';
import './MainContent.css';
import UserInfoCard from './UserInfoCard';
import HealthMetricsCard from './HealthMetricsCard';
import RecentAlertsCard from './RecentAlertsCard';

const MainContent: React.FC = () => {
  return (
    <main className="main-content">
      <div className="content-grid">
        <div className="left-column">
          <UserInfoCard />
          <HealthMetricsCard />
        </div>
        <div className="right-column">
          <RecentAlertsCard />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
