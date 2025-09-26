import React, { useCallback, useEffect, useState } from 'react';
import './MainContent.css';
import UserInfoCard from './UserInfoCard';
import HealthMetricsCard from './HealthMetricsCard';
import RecentAlertsCard from './RecentAlertsCard';

import { useAuth } from '../contexts/AuthContext';
import {
  getSeniorDetail,
  getSeniors,
  updateMonitoringStatus,
} from '../api/senior';
import {
  CareSeniorBriefResponseBody,
  SeniorDetailResponseBody,
} from '../types/api';

const MainContent: React.FC = () => {
  const { user } = useAuth();
  const [seniors, setSeniors] = useState<CareSeniorBriefResponseBody[]>([]);
  const [selectedSenior, setSelectedSenior] =
    useState<CareSeniorBriefResponseBody | null>(null);
  const [seniorDetail, setSeniorDetail] =
    useState<SeniorDetailResponseBody | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 857);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 857);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 시니어 목록을 불러오는 로직
  const fetchSeniors = useCallback(async () => {
    if (!user?.uuid) return; // user 정보가 없으면 아무것도 하지 않음
    try {
      const seniorList = await getSeniors(user.uuid);
      if (seniorList) {
        setSeniors(seniorList);
      }
    } catch (err) {
      console.error('시니어 목록 로딩 실패:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchSeniors();
  }, [fetchSeniors]);

  // 특정 시니어의 상세 정보를 불러오는 로직
  const fetchSeniorDetail = useCallback(
    async (isRefresh = false) => {
      if (!selectedSenior?.uuid) {
        setSeniorDetail(null); // 선택된 시니어가 없으면 상세 정보 초기화
        return;
      }

      if (!isRefresh) {
        setIsLoading(true);
      } else {
        setIsUpdating(true);
      }

      try {
        // setSeniorDetail(null); // 로딩 중에 이전 데이터 숨기기
        const newDetailData = await getSeniorDetail(selectedSenior.uuid); // 최신 데이터 재요청
        setSeniorDetail((prevDetail) => {
          if (!prevDetail) return newDetailData;

          return {
            ...prevDetail,
            ...newDetailData,
          };
        });
        // console.log('로딩된 시니어 상세 정보:', detail);
      } catch (err) {
        console.error('시니어 상세 정보 로딩 실패:', err);
        setSeniorDetail(null);
      } finally {
        if (!isRefresh) {
          setIsLoading(false);
        } else {
          setIsUpdating(false);
        }
      }
    },
    [selectedSenior]
  );

  useEffect(() => {
    if (selectedSenior?.uuid) {
      fetchSeniorDetail(false);
    } else {
      setSeniorDetail(null);
    }
  }, [selectedSenior, fetchSeniorDetail]);

  // 모니터링 활성화/비활성화에 따른 자동 새로고침 설정
  useEffect(() => {
    if (selectedSenior) {
      fetchSeniorDetail();
    } else {
      setSeniorDetail(null);
    }
  }, [selectedSenior, fetchSeniorDetail]);

  useEffect(() => {
    if (!seniorDetail?.isMonitored) {
      return;
    }

    const interval = setInterval(() => {
      fetchSeniorDetail(true);
    }, 60000); // 1분마다 새로고침
    console.log('모니터링 활성화: 1분마다 데이터 갱신');

    return () => {
      clearInterval(interval);
      console.log('모니터링 비활성화: 데이터 갱신 중지');
    };
  }, [seniorDetail?.isMonitored, fetchSeniorDetail]);

  // 모니터링 상태 변경하는 핸들러 함수 (PATCH API 호출)
  const handleMonitoringToggle = async () => {
    if (!selectedSenior) return;

    const currentStatus = seniorDetail?.isMonitored || false;
    const newStatus = !currentStatus;

    try {
      await updateMonitoringStatus(selectedSenior.uuid, newStatus);
      setSeniorDetail((prev) =>
        prev ? { ...prev, isMonitored: newStatus } : prev
      );
      console.log(
        `시니어 ${selectedSenior.name} 모니터링 상태 변경: ${newStatus}`
      );
    } catch (error) {
      console.error('모니터링 상태 변경 실패:', error);
    }
  };

  // UserInfoCard에서 호출할 핸들러 함수
  const handleSelectSenior = (senior: CareSeniorBriefResponseBody | null) => {
    setSelectedSenior(senior);
  };

  return (
    <main className="main-content">
      <div className="content-grid">
        <div className="left-column">
          {isUpdating && <div className="update-indicator">업데이트 중...</div>}
          <UserInfoCard
            seniors={seniors}
            selectedSenior={selectedSenior}
            onSelectSenior={handleSelectSenior}
            seniorDetail={seniorDetail}
            onSeniorsUpdate={fetchSeniors}
            isMonitored={seniorDetail?.isMonitored || false}
            onToggleMonitoring={handleMonitoringToggle}
            isLoading={isLoading}
          />
          {selectedSenior && seniorDetail && !isLoading && (
            <>
              {isMobile && <RecentAlertsCard seniorDetail={seniorDetail} />}
              <HealthMetricsCard seniorDetail={seniorDetail} />
            </>
          )}
        </div>
        <div className="right-column">
          {selectedSenior && seniorDetail && !isLoading && !isMobile && (
            <RecentAlertsCard seniorDetail={seniorDetail} />
          )}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
