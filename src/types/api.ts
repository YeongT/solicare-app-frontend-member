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

// 로그인 API 응답의 body 타입
export interface LoginResponseBody {
  name: string;
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
  userId: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  phoneNumber: string;
  address: string;
  note: string;
}

// 시니어 등록 요청 시 보낼 데이터 타입
export interface SeniorJoinRequestBody {
  userId: string;       // 시니어 ID 추가
  password: string;     // 시니어 비밀번호 추가
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