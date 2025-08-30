export const isTokenExpired = (token: string): boolean => {
    try {
      // Mock 토큰인지 확인 (mock-jwt-token으로 시작하는 경우)
      if (token.startsWith('mock-jwt-token')) {
        return false; // Mock 토큰은 만료되지 않음
      }
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };
  