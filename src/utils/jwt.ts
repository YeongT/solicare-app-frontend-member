// JWT Payload의 구조 정의 (알려진 정보를 바탕으로)
interface JwtPayload {
  exp: number; // 만료 시간
  sub: string; // 주제 (UUID)
}

/**
 * JWT 토큰의 만료 여부를 확인합니다.
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  try {
    const payloadBase64 = token
      .split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const decodedJson = atob(payloadBase64);
    const decoded: JwtPayload = JSON.parse(decodedJson);
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

/**
 * JWT 토큰에서 만료 시간을 Date 객체로 추출합니다.
 */
export function getJwtExpiration(token: string): Date | null {
  if (!token) return null;
  try {
    const payloadBase64 = token
      .split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const decodedJson = atob(payloadBase64);
    const decoded: JwtPayload = JSON.parse(decodedJson);

    if (!decoded.exp) return null;
    return new Date(decoded.exp * 1000);
  } catch (e) {
    return null;
  }
}

/**
 * JWT 토큰에서 sub(uuid) 값을 추출합니다. (디코딩만 수행)
 */
export function getJwtUuid(token: string): string | null {
  if (!token) return null;
  try {
    const payloadBase64 = token
      .split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const decodedJson = atob(payloadBase64);
    const decoded: JwtPayload = JSON.parse(decodedJson);
    return decoded.sub || null;
  } catch (e) {
    return null;
  }
}
