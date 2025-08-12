export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type JoinRequest = {
  name: string;
  elderlyName: string;
  phoneNumber: string;
  password: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  age: number;
  specialNote?: string;
};

export type JoinResult = {
  id: number;
  name: string;
  elderlyName: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN';
  gender: 'MALE' | 'FEMALE';
  address: string;
  age: number;
  specialNote?: string;
};

export type LoginRequest = {
  phoneNumber: string;
  password: string;
};

export type LoginResult = {
  id: number;
  token: string;
};

const BASE_URL = 'http://localhost:8080';

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

export async function joinMember(payload: JoinRequest) {
  return postJson<ApiResponse<JoinResult>>('/member/join', payload);
}

export async function loginMember(payload: LoginRequest) {
  return postJson<ApiResponse<LoginResult>>('/member/login', payload);
}
