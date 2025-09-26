import React, { useEffect, useRef, useState } from 'react';
import './UserInfoCard.css';
import InfoFrame from './userInfo/InfoFrame';
import { useAuth } from '../contexts/AuthContext';
import SeniorModal from './UserAddSenior';
import AddSeniorEntryModal from './AddSeniorEntryModal';
import {
  AddSeniorRequestBody,
  CareSeniorBriefResponseBody,
  SeniorDetailResponseBody,
  SeniorJoinRequestBody,
} from '../types/api';
import { addSenior, joinSenior } from '../api/senior';

interface UserInfoCardProps {
  seniors: CareSeniorBriefResponseBody[];
  selectedSenior: CareSeniorBriefResponseBody | null;
  onSelectSenior: (senior: CareSeniorBriefResponseBody | null) => void;
  seniorDetail: SeniorDetailResponseBody | null;
  onSeniorsUpdate: () => void; // 시니어 목록이 변경되었을 때 호출할 함수
  isMonitored: boolean | undefined; // 현재 선택된 시니어의 모니터링 상태
  onToggleMonitoring: () => void;
  isLoading?: boolean; // 로딩 중 여부 (옵션)
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  seniors,
  selectedSenior,
  onSelectSenior,
  seniorDetail,
  onSeniorsUpdate,
  isMonitored,
  onToggleMonitoring,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isAddSeniorModalOpen, setIsAddSeniorModalOpen] = useState(false);
  const [photoSize, setPhotoSize] = useState<number>(120);
  const infoRef = useRef<HTMLDivElement | null>(null);

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

  const handleSelectSenior = async (senior: CareSeniorBriefResponseBody) => {
    onSelectSenior(senior);
    setIsDropdownOpen(false);
    setSearchText('');
  };

  // 신규 대상자(시니어) 추가 - 시니어 회원가입
  // onAdd가 Promise<string>을 반환하도록 수정
  const handleAddSenior = async (
    newSeniorData: SeniorJoinRequestBody
  ): Promise<string> => {
    try {
      const addedSenior = await joinSenior(newSeniorData);
      if (addedSenior) {
        //await fetchSeniors();
        onSeniorsUpdate();
        setIsDropdownOpen(false);
        return '대상자가 성공적으로 추가되었습니다.';
      }
      return '추가에 실패했습니다.';
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      } else {
        return '알 수 없는 오류가 발생했습니다.';
      }
    }
  };

  // 멤버에 대상자(시니어) 추가(연결)
  const handleQuickAddSenior = async (
    addSeniorData: AddSeniorRequestBody
  ): Promise<string> => {
    if (!user?.uuid) {
      return '로그인 정보가 없어 추가할 수 없습니다.';
    }
    try {
      const addedSenior = await addSenior(user.uuid, addSeniorData);
      if (addedSenior) {
        onSeniorsUpdate();
        setIsDropdownOpen(false);
        return '대상자가 성공적으로 추가되었습니다.';
      }
      return '추가에 실패했습니다.';
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      } else {
        return '알 수 없는 오류로 추가에 실패했습니다.';
      }
    }
  };

  // user가 없거나 uuid가 없으면 아무것도 렌더링하지 않음 (ProtectedRoute에서 로그인 체크)
  if (!user?.uuid) {
    return null;
  }

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
          position: 'relative',
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

        {selectedSenior && seniorDetail && (
          <div className="monitoring-toggle-row">
            <span className="monitoring-label">모니터링 활성화</span>
            <button
              className={`monitoring-toggle-btn${isMonitored ? ' on' : ''}`}
              style={{
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
              onClick={isLoading ? undefined : onToggleMonitoring}
              disabled={isLoading}
            >
              {isMonitored ? 'ON' : 'OFF'}
            </button>
          </div>
        )}
        {isDropdownOpen && (
          <div
            className="dropdown-menu"
            style={{
              position: 'absolute',
              left: 0,
              top: '100%',
              zIndex: 10,
              minWidth: '220px',
              marginTop: 16,
            }}
          >
            <div
              className="dropdown-search"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                minWidth: 0,
                flexWrap: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <input
                type="text"
                placeholder="검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
              <button
                className="add-btn"
                onClick={() => setIsEntryModalOpen(true)}
                style={{
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  minWidth: 48,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                추가
              </button>
            </div>

            <ul className="dropdown-list">
              {filteredSeniors.map((s) => (
                <li key={s.uuid}>
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
      {selectedSenior && seniorDetail && !isLoading && (
        <div className="user-info-content">
          <div
            className="photo-frame"
            style={{ width: photoSize, height: photoSize }}
          >
            <img
              src={`/images/${seniorDetail.profile.gender}_photo${(seniorDetail.profile.age % 3) + 1}.png`}
              alt={`${seniorDetail.profile.name} 사진`}
              className="photo-img"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <InfoFrame
            ref={infoRef}
            name={seniorDetail.profile.name}
            age={seniorDetail.profile.age}
            gender={
              seniorDetail.profile.gender === 'MALE'
                ? '남성'
                : seniorDetail.profile.gender === 'FEMALE'
                  ? '여성'
                  : '기타'
            }
            address={seniorDetail.profile.address}
            note={seniorDetail.profile.note}
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
