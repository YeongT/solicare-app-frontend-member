import React, { useCallback, useEffect, useRef, useState } from 'react';
import './UserInfoCard.css';
import InfoFrame from './userInfo/InfoFrame';
import { useAuth } from '../contexts/AuthContext';
import SeniorModal from './UserAddSenior';
import AddSeniorEntryModal from './AddSeniorEntryModal';
import {
  AddSeniorRequestBody,
  Senior,
  SeniorJoinRequestBody,
} from '../types/api';
import { addSenior, getSeniors, joinSenior } from '../api/senior';

const UserInfoCard: React.FC = () => {
  const { user } = useAuth();
  const [seniors, setSeniors] = useState<Senior[]>([]);
  const [selectedSenior, setSelectedSenior] = useState<Senior | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isAddSeniorModalOpen, setIsAddSeniorModalOpen] = useState(false);
  const [photoSize, setPhotoSize] = useState<number>(120);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const [monitoringOn, setMonitoringOn] = useState(true); // on/off 토글 상태

  // 2. 재사용을 위해 데이터 로딩 로직을 useCallback으로 감싼 함수로 분리
  const fetchSeniors = useCallback(async () => {
    if (user?.uuid) {
      try {
        const seniorList = await getSeniors(user.uuid);
        if (seniorList) {
          setSeniors(seniorList);
          if (seniorList.length > 0 && !selectedSenior) {
            setSelectedSenior(seniorList[0]);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
        }
      }
    } else {
      alert('사용자 정보를 찾을 수 없습니다. 로그인 상태를 확인해주세요.');
    }
  }, [user, selectedSenior]);

  // 3. 페이지가 처음 로드될 때(마운트될 때) 시니어 목록을 불러옵니다.
  useEffect(() => {
    fetchSeniors();
  }, [fetchSeniors]); // fetchSeniors 함수가 변경될 때만 실행

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !document.getElementById('user-dropdown-container')?.contains(target)
      ) {
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
      setPhotoSize(Math.max(90, Math.min(230, Math.round(h))));
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

  const filteredSeniors = seniors.filter((s) =>
    s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectSenior = (senior: Senior) => {
    setSelectedSenior(senior);
    setIsDropdownOpen(false);
    setSearchText('');
  };

  // 신규 대상자(시니어) 추가 - 시니어 회원가입
  const handleAddSenior = async (newSeniorData: SeniorJoinRequestBody) => {
    try {
      const addedSenior = await joinSenior(newSeniorData);
      if (addedSenior) {
        // alert('새로운 대상자가 등록되었습니다. 목록을 새로고침합니다.');
        await fetchSeniors(); // 목록을 다시 불러옵니다.
        // setSelectedSenior(addedSenior); // 새로 추가된 시니어를 바로 선택
        setIsAddSeniorModalOpen(false); // 모달 닫기
        setIsDropdownOpen(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // 멤버에 대상자(시니어) 추가(연결)
  const handleQuickAddSenior = async (addSeniorData: AddSeniorRequestBody) => {
    if (!user?.uuid) {
      alert('로그인 정보가 없어 추가할 수 없습니다.');
      return;
    }
    try {
      const addedSenior = await addSenior(user.uuid, addSeniorData);
      if (addedSenior) {
        // alert('대상자가 추가되었습니다. 목록을 새로고침합니다.');
        await fetchSeniors(); // 목록을 다시 불러옵니다.
        // setSelectedSenior(addedSenior); // 새로 추가된 시니어를 바로 선택
        setIsEntryModalOpen(false); // 모달 닫기
        setIsDropdownOpen(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(`추가 실패: ${err.message}`);
      } else {
        alert('알 수 없는 오류로 추가에 실패했습니다.');
      }
    }
  };

  return (
    <section className="user-info-container">
      {/* 헤더 + 드롭다운 */}
      <div
        id="user-dropdown-container"
        className="user-info-title"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3
          className="user-header"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          style={{ flex: 1, cursor: 'pointer', margin: 0 }}
        >
          모니터링 대상 : {selectedSenior?.name ?? '선택하세요'}
          <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
        </h3>
        <button
          className="monitoring-toggle-btn"
          style={{
            marginLeft: 16,
            padding: '0.3em 1.2em',
            borderRadius: 20,
            border: '1px solid #bbb',
            background: monitoringOn ? '#4ade80' : '#e5e7eb',
            color: monitoringOn ? '#fff' : '#888',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            top: '-8px',
          }}
          onClick={() => setMonitoringOn((on) => !on)}
        >
          {monitoringOn ? 'ON' : 'OFF'}
        </button>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                className="add-btn"
                onClick={() => setIsEntryModalOpen(true)}
              >
                추가
              </button>
            </div>

            <ul className="dropdown-list">
              {filteredSeniors.map((s) => (
                <li key={s.userId}>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSelectSenior(s)}
                  >
                    {s.name} ({s.gender === 'MALE' ? '남' : '여'}, {s.age}세) 님
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
          <div
            className="photo-frame"
            style={{ width: photoSize, height: photoSize }}
          >
            {selectedSenior ? (
              <img
                src={`/images/user-photo${(selectedSenior.age % 3) + 1}.png`}
                alt={`${selectedSenior.name} 사진`}
                className="photo-img"
                onError={(e) => {
                  // 이미지 로드 실패 시 fallback
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span role="img" aria-label="grandma" className="photo-emoji">
                👵
              </span>
            )}
          </div>
          <InfoFrame
            ref={infoRef}
            name={selectedSenior.name}
            age={selectedSenior.age}
            gender={
              selectedSenior.gender === 'MALE'
                ? '남성'
                : selectedSenior.gender === 'FEMALE'
                  ? '여성'
                  : '기타'
            }
            address={selectedSenior.address}
            note={selectedSenior.note}
          />
        </div>
      )}

      {/* 신규 대상자 진입 모달 */}
      {isEntryModalOpen && (
        <AddSeniorEntryModal
          isOpen={isEntryModalOpen}
          onClose={() => setIsEntryModalOpen(false)}
          onClickAdd={() => {
            setIsEntryModalOpen(false);
            setIsAddSeniorModalOpen(true);
          }}
          onQuickAdd={handleQuickAddSenior}
        />
      )}

      {/* 실제 대상자 추가 모달 */}
      {isAddSeniorModalOpen && (
        <SeniorModal
          isOpen={isAddSeniorModalOpen}
          onClose={() => setIsAddSeniorModalOpen(false)}
          onAdd={handleAddSenior}
        />
      )}
    </section>
  );
};

export default UserInfoCard;
