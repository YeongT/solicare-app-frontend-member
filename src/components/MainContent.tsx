import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import './MainContent.css';

import AlertModal from './AlertModal';
import UserInfoCard from './UserInfoCard';
import HealthMetricsCard from './HealthMetricsCard';
import RecentAlertsCard from './RecentAlertsCard';

import { useNotification } from '../contexts/NotificationContext';
import { getEventDetail } from '../api/event';
import { EventDetailResponseBody, CareSeniorBriefResponseBody, SeniorDetailResponseBody } from '../types/api';

import { useAuth } from '../contexts/AuthContext';
import { getSeniorDetail, getSeniors, updateMonitoringStatus } from '../api/senior';

interface FcmNotificationData {
  seniorUuid: string;
  eventUuid: string;
}

const MainContent: React.FC = () => {
  const { user } = useAuth();
  const [seniors, setSeniors] = useState<CareSeniorBriefResponseBody[]>([]);
  const [selectedSenior, setSelectedSenior] = useState<CareSeniorBriefResponseBody | null>(null);
  const [seniorDetail, setSeniorDetail] = useState<SeniorDetailResponseBody | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 857);
  
  const { notification, setNotification } = useNotification();
  const [pendingNotification, setPendingNotification] = useState<FcmNotificationData | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [modalEventData, setModalEventData] = useState<EventDetailResponseBody | null>(null);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 857);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 시니어 목록 불러오기
  const fetchSeniors = useCallback(async () => {
    if (!user?.uuid) return;
    try {
      const seniorList = await getSeniors(user.uuid);
      if (seniorList) setSeniors(seniorList);
    } catch (err) {
      console.error('시니어 목록 로딩 실패:', err);
      toast.error('시니어 목록을 불러오지 못했습니다.');
    }
  }, [user]);

  useEffect(() => {
    fetchSeniors();
  }, [fetchSeniors]);

  // 특정 시니어 상세 정보 불러오기
  const fetchSeniorDetail = useCallback(async (isRefresh = false) => {
    if (!selectedSenior?.uuid) {
      setSeniorDetail(null);
      return;
    }
    if (!isRefresh) setIsLoading(true); else setIsUpdating(true);
    try {
      const detail = await getSeniorDetail(selectedSenior.uuid);
      setSeniorDetail(detail);
    } catch (err) {
      console.error('시니어 상세 정보 로딩 실패:', err);
      toast.error('시니어 상세 정보를 불러오지 못했습니다.');
      setSeniorDetail(null);
    } finally {
      if (!isRefresh) setIsLoading(false); else setIsUpdating(false);
    }
  }, [selectedSenior]);
  
  // selectedSenior가 변경되면 상세 정보 다시 불러오기
  useEffect(() => {
    if (selectedSenior?.uuid) {
      fetchSeniorDetail(false);
    } else {
      setSeniorDetail(null);
    }
  }, [selectedSenior, fetchSeniorDetail]);
  
  // 모니터링 상태에 따른 데이터 자동 갱신
  useEffect(() => {
    if (!seniorDetail?.isMonitored) return;
    const interval = setInterval(() => fetchSeniorDetail(true), 60000); // 1분
    return () => clearInterval(interval);
  }, [seniorDetail?.isMonitored, fetchSeniorDetail]);

  const handleMonitoringToggle = async () => { /* ... 이전과 동일 ... */ };

  // UserInfoCard에서 시니어를 선택하는 핸들러
  const handleSelectSenior = (senior: CareSeniorBriefResponseBody | null) => {
    setSelectedSenior(senior);
  };

  // --- 🔔 알림 처리 로직 (수정됨) ---

  // 1. Context에 새 알림이 들어오면, 내부 처리 상태(pendingNotification)로 옮김
  useEffect(() => {
    if (notification) {
      console.log('[Notification] 새로운 알림 수신:', notification);
      setPendingNotification(notification);
      setNotification(null);
    }
  }, [notification, setNotification]);

  // 2. 처리할 알림이 생기면, 화면의 시니어를 알림에 맞게 변경
  useEffect(() => {
    if (!pendingNotification) return;
    if (selectedSenior?.uuid !== pendingNotification.seniorUuid) {
      const targetSenior = seniors.find(s => s.uuid === pendingNotification.seniorUuid);
      if (targetSenior) {
        console.log(`[Notification] 시니어 화면 전환 실행: ${targetSenior.name}`);
        handleSelectSenior(targetSenior);
      } else {
        console.error(`[Notification] 목록에 없는 시니어 UUID: ${pendingNotification.seniorUuid}`);
        toast.error('알 수 없는 대상자의 알림입니다.');
        setPendingNotification(null);
      }
    }
  }, [pendingNotification, selectedSenior, seniors]);

  // 3. (핵심) 보류 중인 알림이 있고, 화면의 시니어 정보가 알림과 일치할 때 모달 띄우기
  useEffect(() => {
    if (!pendingNotification || !seniorDetail) return;

    // 🔥 조건문 수정: !==  ->  ===
    // "알림 속 시니어와 선택된 시니어가 같을 때" 모달을 열도록 수정
    if (pendingNotification.seniorUuid === selectedSenior?.uuid) {
      console.log('[Notification] 조건 충족! 모달을 엽니다.');

      const fetchAndShowModal = async () => {
        try {
          const fetchedEventData = await getEventDetail(pendingNotification.eventUuid);
          setModalEventData(fetchedEventData);
          setIsAlertModalOpen(true);
        } catch (error) {
          console.error('[Notification] 이벤트 상세 정보 로딩 실패:', error);
          toast.error('이벤트 정보를 불러오는 데 실패했습니다.');
        } finally {
          setPendingNotification(null);
        }
      };
      
      fetchAndShowModal();
    }
  }, [pendingNotification, selectedSenior, seniorDetail]);
  
  return (
    <main className="main-content">
      <AlertModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)}
        eventData={modalEventData}
        seniorData={seniorDetail} 
      />
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