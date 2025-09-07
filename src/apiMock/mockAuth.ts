import mockApiClient from './mockApiClient';

interface MockUser {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

// Mock 로그인 API
export async function mockLoginApi(email: string, password: string) {
  try {
    // 실제 사용자 데이터 확인
    const usersResponse = await mockApiClient.get('/users');
    const users: MockUser[] = usersResponse.data;

    const user = users.find((u: MockUser) => u.email === email);

    if (!user) {
      return {
        isSuccess: false,
        message: '사용자를 찾을 수 없습니다.',
      };
    }

    if (user.password !== password) {
      return {
        isSuccess: false,
        message: '비밀번호가 잘못되었습니다.',
      };
    }

    // 성공 응답
    return {
      isSuccess: true,
      result: {
        token: 'mock-jwt-token-' + Date.now(),
        name: user.name,
      },
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: '서버 오류가 발생했습니다.',
    };
  }
}

// Mock 회원가입 API
export async function mockSignUpApi(
  name: string,
  email: string,
  phoneNumber: string,
  password: string
) {
  try {
    // 기존 사용자 확인
    const usersResponse = await mockApiClient.get('/users');
    const users: MockUser[] = usersResponse.data;

    const existingUser = users.find((u: MockUser) => u.email === email);

    if (existingUser) {
      return {
        isSuccess: false,
        message: '이미 존재하는 이메일입니다.',
      };
    }

    // 새 사용자 생성
    const newUser = {
      id: users.length + 1,
      name,
      email,
      phoneNumber,
      password,
    };

    await mockApiClient.post('/users', newUser);

    // 성공 응답
    return {
      isSuccess: true,
      result: {
        token: 'mock-jwt-token-signup-' + Date.now(),
        name: name,
      },
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: '서버 오류가 발생했습니다.',
    };
  }
}
