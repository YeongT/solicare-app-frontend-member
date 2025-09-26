import React, { useEffect } from 'react';
import { getMessagingInstance } from './utils/firebase';
import { getToken, MessagePayload, onMessage } from 'firebase/messaging';
import { registerFcmToken } from './api/fcm';
import { saveDeviceUuid } from './utils/device';

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Start from './pages/Start';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

const FcmHandler: React.FC = () => {
  const { setNotification } = useNotification(); // Context에서 setNotification 함수를 가져옵니다.

  useEffect(() => {
    // FCM 설정 및 메시지 수신 로직을 처리하는 함수
    const setupFCM = async () => {
      // 1. 브라우저가 서비스 워커와 알림을 지원하는지 확인
      if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        console.warn('[FCM] Push messaging is not supported in this browser.');
        return;
      }

      // 2. 알림 권한 요청
      const permission = await Notification.requestPermission();
      console.log('[FCM] Notification permission:', permission);

      if (permission === 'granted') {
        try {
          // Firebase Messaging 인스턴스 가져오기
          const messagingInstance = await getMessagingInstance();
          if (!messagingInstance) {
            console.error('[FCM] Messaging instance is not available.');
            return;
          }

          console.log('[FCM] Registering service worker for token...');
          // 서비스 워커를 등록하고 그 결과를 getToken에 바로 사용합니다.
          const registration = await navigator.serviceWorker.register(
            '/firebase-messaging-sw.js'
          );

          console.log('[FCM] Getting FCM token...');
          const currentToken = await getToken(messagingInstance, {
            vapidKey:
              'BK3lEzGLe25ICjp5er8uIxSe0OyntQ1CvYPHUiM63LzN_pQOsJHhwdFbcC9T2SA-TV6GLL2N3CN1ED4PULwNnkk',
            // 명시적으로 등록된 서비스 워커를 사용하도록 전달합니다.
            serviceWorkerRegistration: registration,
          });

          if (currentToken) {
            console.log('[FCM] Token received:', currentToken);
            // FCM 토큰을 서버에 등록하고 디바이스 uuid를 쿠키에 저장
            try {
              const device = await registerFcmToken(currentToken);
              console.log('[FCM] registerFcmToken result:', device);

              if (device?.uuid) {
                saveDeviceUuid(device.uuid);
                console.log('[FCM] Device uuid saved:', device.uuid);
              } else {
                console.warn('[FCM] Device uuid not found in response');
              }
            } catch (err) {
              console.error(
                '[FCM] Failed to register FCM token or save device uuid',
                err
              );
            }
          } else {
            console.warn(
              '[FCM] No registration token available. Request permission to generate one.'
            );
          }

          // 3. 포그라운드 메시지 수신 리스너 설정
          const unsubscribeListener = onMessage(
            messagingInstance,
            (payload: MessagePayload) => {
              console.log('[FCM] Foreground message received:', payload);

              if (payload.data && payload.data.seniorUuid && payload.data.eventUuid) {
                // Context의 상태를 업데이트하여 앱 전체에 알림
                setNotification({
                  seniorUuid: payload.data.seniorUuid,
                  eventUuid: payload.data.eventUuid,
                });
              } else {
                const notificationTitle =
                 payload.notification?.title || '새 알림';
                const notificationOptions = {
                  body: payload.notification?.body,
                  icon: '/logo192.png',
                };
                new Notification(notificationTitle, notificationOptions);
              }
            }
          );

          // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
          return () => {
            if (unsubscribeListener) {
              unsubscribeListener();
            }
          };
        } catch (err) {
          console.error('[FCM] An error occurred while setting up FCM', err);
        }
      } else {
        console.warn('[FCM] Unable to get permission to notify.');
      }
    };

    setupFCM();
  }, [setNotification]); // setNotification이 변경될 때마다 이 effect가 다시 실행되도록 의존성 배열에 추가

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="App">
            <Header />
            <FcmHandler />
            <Routes>
              <Route path="/" element={<Navigate to="/start" replace />} />
              <Route path="/start" element={<Start />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainContent />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/start" replace />} />
            </Routes>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;