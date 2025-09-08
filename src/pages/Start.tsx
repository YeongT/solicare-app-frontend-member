import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/landing.css';

const Start: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="landing-badge">Solicare Monitor</div>
        <h1 className="landing-title">가정 내 어르신을 위한 안전 모니터링</h1>
        <p className="landing-subtitle">
          심박수·체온·낙상 감지를 한 곳에서 확인하고, 이상 상황을 바로 알림으로
          받아보세요.
        </p>
        <div className="landing-actions">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="cta cta-primary">
                대시보드로 이동
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="cta cta-primary">
                로그인
              </Link>
              <Link to="/signup" className="cta cta-secondary">
                회원가입
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">❤️</div>
          <h3 className="feature-title">실시간 건강지표</h3>
          <p className="feature-text">
            심박수와 체온을 직관적인 그래프로 볼 수 있어요.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔔</div>
          <h3 className="feature-title">즉시 알림</h3>
          <p className="feature-text">
            낙상 감지 등 긴급 상황을 빠르게 알려드립니다.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">안전한 접근</h3>
          <p className="feature-text">
            로그인 후에만 보호자 전용 데이터를 볼 수 있어요.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Start;
