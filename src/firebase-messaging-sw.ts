/// <reference lib="webworker" />
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  MessagePayload,
  onBackgroundMessage,
} from 'firebase/messaging/sw';

// TypeScript가 'self'를 서비스 워커의 전역 스코프로 인식하도록 명시적으로 선언합니다.
declare const self: ServiceWorkerGlobalScope;

// Firebase 설정 정보
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 백그라운드 메시지 수신 핸들러 (이것만으로 충분합니다)
onBackgroundMessage(messaging, (payload: MessagePayload) => {
  // notification 객체가 존재하지 않을 수 있으므로, 안전하게 확인합니다.
  if (payload.notification) {
    const notificationTitle = payload.notification.title || '새로운 알림'; // title이 없을 경우를 대비해 기본값을 설정합니다.
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/logo192.png',
    };

    // self.registration을 통해 알림을 표시합니다.
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
