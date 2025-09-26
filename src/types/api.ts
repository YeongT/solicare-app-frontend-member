// 시니어 알림 정보
export interface SeniorAlert {
  uuid: string;
  eventType: string;
  timestamp: string;
  isRead: boolean;
}

// 시니어 건강 데이터(측정값)
export interface SeniorStat {
  uuid: string;
  timestamp: string;
  heartRate: number;
  temperature: number;
}

// 시니어 상세 정보 조회 응답 body
export interface SeniorDetailResponseBody {
  profile: Senior;
  isMonitored: boolean;
  alerts: SeniorAlert[];
  stats: SeniorStat[];
}
// 서버 응답의 공통 구조
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  body?: T; // body는 선택 사항
  errors?: string[] | null; // errors는 선택 사항
}

// 로그인 요청 시 보낼 데이터 타입
export interface LoginRequestBody {
  email: string;
  password: string;
}

import { MemberProfile } from './member';

// 로그인 API 응답의 body 타입
export interface LoginResponseBody {
  profile: MemberProfile;
  token: string;
}

// 회원가입 요청 시 보낼 데이터 타입 (가정)
export interface JoinRequestBody {
  name: string;
  phoneNumber: string; // ✅ phoneNumber 필드 추가
  email: string;
  password: string;
}

// 회원가입 성공 시 받을 body 데이터 타입
export interface JoinResponseBody {
  name: string;
  token: string;
}

// 시니어(모니터링 대상) 정보 타입
export interface Senior {
  // userId: string;  // uuid 부분 빠짐
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  phoneNumber: string;
  address: string;
  note: string;
}

// 시니어 목록 조회시 받는 간략한 시니어 정보 타입
export interface CareSeniorBriefResponseBody {
  uuid: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  unreadAlertCount: number;
}

// 시니어 등록 요청 시 보낼 데이터 타입
export interface SeniorJoinRequestBody {
  userId: string; // 시니어 ID 추가
  password: string; // 시니어 비밀번호 추가
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  phoneNumber: string;
  address: string;
  note: string;
}

export interface AddSeniorRequestBody {
  userId: string;
  password: string;
}

// 이벤트 상세 정보 응답 타입 (예시)
export interface EventDetailResponseBody {
  uuid: string;
  eventType: string; // 예: "낙상 감지", "비상 호출"
  timestamp: string; // 예: "2025-09-26T12:30:00Z"
  // ... 기타 이벤트와 직접적으로 관련된 정보 ...
}