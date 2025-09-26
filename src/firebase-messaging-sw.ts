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
  apiKey: "AIzaSyAdK6LJq_c2DYFcGKXJELTX1ajM0eSG2Q4",
  authDomain: "solicare-app.firebaseapp.com",
  projectId: "solicare-app",
  storageBucket: "solicare-app.firebasestorage.app",
  messagingSenderId: "700598160035",
  appId: "1:700598160035:web:e2002781857e9a6f934d16",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 백그라운드 메시지 수신 핸들러 (이것만으로 충분합니다)
onBackgroundMessage(messaging, (payload: MessagePayload) => {
  // notification 객체가 존재하지 않을 수 있으므로, 안전하게 확인합니다.
  // 백그라운드 메시지에서만 알림을 띄웁니다.
  if (payload && payload.notification) {
    const notificationTitle = payload.notification.title || '새로운 알림';
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/logo192.png',
      // tag를 사용하려면 payload.data에서 값을 가져와야 합니다.
      // 예시: tag: payload.data?.tag,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
    console.log('[FCM] Background message received:', payload);
  }
});

// 서비스워커 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  // 알림 클릭 시 대시보드로 이동
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      console.log('클릭된 알림:', event.notification);
      let windowFocused = false;
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate && client.navigate('/dashboard');
          windowFocused = true;
        }
      }
      if (!windowFocused && self.clients.openWindow) {
        return self.clients.openWindow('http://localhost:3000/dashboard');
      }
    })
  );
});