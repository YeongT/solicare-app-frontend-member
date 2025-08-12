import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [route, setRoute] = React.useState<string>(
    typeof window !== 'undefined' ? window.location.hash || '#/start' : '#/start'
  );
  React.useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#/start');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const isStart = route === '#/start' || route === '#/' || route === '';
  const isDashboard = route === '#/dashboard';

  // DEV: 임시 메인(대시보드) 이동 버튼 핸들러 (완성 후 삭제 가능)
  const goMain = () => {
    // 보호 라우팅 우회용 임시 토큰 주입 (개발용)
    try { localStorage.setItem('auth_token', 'dev'); } catch {}
    window.location.hash = '#/dashboard';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="brand">
          <h1 className="brand-name"><a href="#/start" className="brand-link">Solicare</a></h1>
        </div>

        {/* DEV: 임시 메인 화면 이동 버튼 (완성 후 아래 블록 통째로 삭제) */}
        <div className="dev-temp-center">
          <button className="dev-temp-btn" onClick={goMain} title="메인 화면으로">
            메인화면 이동
          </button>
        </div>
        {/* /DEV */}

        {/* 시작 화면: 로그인/회원가입 링크만 */}
        {isStart && (
          <nav className="nav-links">
            <a href="#/login" className="nav-link">로그인</a>
            <span className="nav-sep" aria-hidden="true"></span>
            <a href="#/signup" className="nav-link">회원가입</a>
          </nav>
        )}

        {/* 대시보드: 사용자명 + 알림만 (로그아웃/링크 숨김) */}
        {isDashboard && token && (
          <div className="user-section">
            <div className="user-info">
              <div className="user-icon">👤</div>
              <span className="user-name">솔리케어 님</span>
            </div>
            <div className="notification">
              <div className="bell-icon">🔔</div>
              <div className="notification-badge">1</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
