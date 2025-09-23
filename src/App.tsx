import React, { useEffect } from 'react';
import { messaging } from './utils/firebase';
import { getToken, onMessage } from 'firebase/messaging';
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
      // 1. 서비스 워커 등록
      if ('serviceWorker' in navigator) {
        try {
          // public 폴더의 서비스 워커 파일을 등록합니다.
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered successfully.', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }

      // 2. 알림 권한 요청 및 토큰 발급
      console.log('Requesting permission...');
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        try {
          const currentToken = await getToken(messaging, { 
            vapidKey: 'BK3lEzGLe25ICjp5er8uIxSe0OyntQ1CvYPHUiM63LzN_pQOsJHhwdFbcC9T2SA-TV6GLL2N3CN1ED4PULwNnkk' 
          });
          
          if (currentToken) {
            console.log('FCM Registration Token:', currentToken);
            // FCM 토큰을 서버에 등록하고 디바이스 uuid를 쿠키에 저장
            try {
              const device = await registerFcmToken(currentToken);
              console.log('registerFcmToken result:', device);
              
              if (device?.uuid) {
                saveDeviceUuid(device.uuid);
                console.log('디바이스 uuid 저장 완료:', device.uuid);
              } else {
                console.warn('디바이스 uuid가 응답에 없습니다.');
              }
            } catch (err) {
              console.error('FCM 토큰 등록/디바이스 uuid 저장 실패:', err);
            }
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        } catch (err) {
          console.log('An error occurred while retrieving token. ', err);
        }
      } else {
        console.log('Unable to get permission to notify.');
      }
    };

    setupFCM();

    // 3. 포그라운드 메시지 수신 리스너 설정
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received: ', payload);
      
      // 포그라운드 상태에서는 직접 알림을 생성해야 합니다.
      const notificationTitle = payload.notification?.title || '새 알림';
      const notificationOptions = {
        body: payload.notification?.body,
        icon: '/logo192.png', // 알림에 표시할 아이콘
      };

      // new Notification API를 사용해 알림을 띄웁니다.
      new Notification(notificationTitle, notificationOptions);
    });

    // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
    return () => {
      unsubscribe();
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.


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
            {/* 404 페이지 - 존재하지 않는 경로는 시작 페이지로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/start" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
