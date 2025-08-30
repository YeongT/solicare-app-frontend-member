import React, { useState, useRef, useEffect } from 'react';
import './UserInfoCard.css';
import InfoFrame from './userInfo/InfoFrame';
import mockApiClient from '../api/mockApiClient';
import SeniorModal from './UserAddSenior';
import { Senior } from '../types/senior';

const UserInfoCard: React.FC = () => {
  const [seniors, setSeniors] = useState<Senior[]>([]);
  const [selectedSenior, setSelectedSenior] = useState<Senior | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoHeight, setPhotoHeight] = useState<number>(120);
  const infoRef = useRef<HTMLDivElement | null>(null);

  // 서버에서 Senior 데이터 불러오기
  useEffect(() => {
    const fetchSeniors = async () => {
      try {
        const res = await mockApiClient.get('/seniors');
        const data: Senior[] = res.data;
        setSeniors(data);
        if (data.length > 0) setSelectedSenior(data[0]);
      } catch (err) {
        console.error('시니어 정보 로드 실패', err);
      }
    };
    fetchSeniors();
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!document.getElementById('user-dropdown-container')?.contains(target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // InfoFrame 높이에 맞춰 사진 높이 자동 조절
  useEffect(() => {
    const updateHeight = () => {
      const node = infoRef.current;
      if (!node) return;
      const h = node.getBoundingClientRect().height;
      setPhotoHeight(Math.max(90, Math.min(230, Math.round(h))));
    };

    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    const node = infoRef.current;
    if (node) ro.observe(node);
    window.addEventListener('resize', updateHeight);

    return () => {
      if (node) ro.unobserve(node);
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [selectedSenior]);

  const filteredSeniors = seniors.filter(s => s.name.includes(searchText));

  const handleSelectSenior = (senior: Senior) => {
    setSelectedSenior(senior);
    setIsDropdownOpen(false);
    setSearchText('');
  };

  const handleAddSenior = async (newSenior: Omit<Senior, 'monitorUserUuid'>) => {
    try {
      const response = await mockApiClient.post('/seniors', newSenior);
      setSeniors(prev => [...prev, response.data]);
      setSelectedSenior(response.data);
      setIsModalOpen(false);
      setIsDropdownOpen(false);
    } catch (err) {
      console.error('시니어 추가 실패', err);
    }
  };

  return (
    <section className="user-info-container">
      {/* 헤더 + 드롭다운 */}
      <div id="user-dropdown-container" className="user-info-title">
        <h3 className="user-header" onClick={() => setIsDropdownOpen(prev => !prev)}>
          모니터링 대상 : {selectedSenior?.name ?? '선택하세요'}
          <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
        </h3>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="검색"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              <button className="add-btn" onClick={() => setIsModalOpen(true)}>추가</button>
            </div>

            <ul className="dropdown-list">
              {filteredSeniors.map(s => (
                <li key={s.monitorUserUuid}>
                  <button className="dropdown-item" onClick={() => handleSelectSenior(s)}>
                    {s.name} 님
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 본문 */}
      {selectedSenior && (
        <div className="user-info-content">
          <div className="photo-frame" style={{ width: photoHeight, height: photoHeight }}>
            {selectedSenior.photo ? (
              <img
                src={selectedSenior.photo}
                alt={`${selectedSenior.name} 사진`}
                className="photo-img"
                onError={(e) => {
                  // 이미지 로드 실패 시 fallback
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span role="img" aria-label="grandma" className="photo-emoji">👵</span>
            )}
          </div>

          <InfoFrame
            ref={infoRef}
            name={selectedSenior.name}
            age={selectedSenior.age}
            gender={selectedSenior.gender === 'MALE' ? '남성' : selectedSenior.gender === 'FEMALE' ? '여성' : '기타'}
            address={selectedSenior.address}
            note={selectedSenior.note}
          />
        </div>
      )}

      {/* 추가 모달 */}
      {isModalOpen && (
        <SeniorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddSenior}
        />
      )}
    </section>
  );
};

export default UserInfoCard;
