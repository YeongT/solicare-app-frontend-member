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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
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

          // --- 🔽 이 부분이 핵심 수정/개선 사항입니다 🔽 ---
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
          // --- 🔼 여기까지 수정/개선 완료 🔼 ---

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

              const notificationTitle =
                payload.notification?.title || '새 알림';
              const notificationOptions = {
                body: payload.notification?.body,
                icon: '/logo192.png',
              };
              new Notification(notificationTitle, notificationOptions);
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

    // useEffect의 cleanup 함수
    return () => {
      // setupFCM 내부에서 비동기적으로 리스너 cleanup이 처리됩니다.
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Header />
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
      </AuthProvider>
    </Router>
  );
}

export default App;