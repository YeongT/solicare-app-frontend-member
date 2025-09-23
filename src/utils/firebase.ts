import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// 웹 앱의 Firebase 설정
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 브라우저 지원 여부에 따라 messaging 객체 생성
// ReturnType을 사용하여 getMessaging 함수의 반환 타입을 추론
let messagingInstance: ReturnType<typeof getMessaging> | null = null;

// Messaging 인스턴스를 비동기적으로 가져오는 함수
export const getMessagingInstance = async (): Promise<ReturnType<
  typeof getMessaging
> | null> => {
  if (messagingInstance !== null) {
    return messagingInstance;
  }

  try {
    // 브라우저 지원 여부 확인
    if ('serviceWorker' in navigator && 'Notification' in window) {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    } else {
      console.warn('Firebase Messaging is not supported in this browser');
      return null;
    }
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error);
    return null;
  }
};

// 하위 호환성을 위해 기존 messaging export 유지 (null일 수 있음)
export const messaging = null;
