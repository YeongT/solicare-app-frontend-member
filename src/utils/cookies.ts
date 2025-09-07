/**
 * 쿠키를 설정합니다.
 */
export function setCookie(name: string, value: string, expires: Date | null): void {
  let expiresStr = '';
  if (expires) {
    expiresStr = `expires=${expires.toUTCString()}`;
  }
  document.cookie = `${name}=${value}; ${expiresStr}; path=/; SameSite=Strict; Secure`;
}

/**
 * 쿠키 값을 가져옵니다.
 */
export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
};

/**
 * 쿠키를 삭제합니다.
 */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};