import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout, userName } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setIsDropdownOpen(false);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/start" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>Solicare</h1>
          </Link>
        </div>
        <nav className="nav">
          {isAuthenticated ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button 
                className="user-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {userName}님
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleDashboardClick} className="dropdown-item">
                    대시보드로 이동
                  </button>
                  <button onClick={handleLogout} className="dropdown-item">
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-links">
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
