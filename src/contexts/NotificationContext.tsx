import React, { createContext, useContext, useState, ReactNode } from 'react';

// FCM 메시지 데이터의 타입을 정의합니다.
interface FcmNotification {
  seniorUuid: string;
  eventUuid: string;
}

// Context가 제공할 값들의 타입을 정의합니다.
interface NotificationContextType {
  notification: FcmNotification | null;
  setNotification: (notification: FcmNotification | null) => void;
}

// Context를 생성합니다.
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Context Provider 컴포넌트를 정의합니다.
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<FcmNotification | null>(null);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// 다른 컴포넌트에서 Context를 쉽게 사용하기 위한 커스텀 훅입니다.
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};