// 디바이스 uuid 쿠키 저장/조회/삭제 유틸
import { setCookie, getCookie, deleteCookie } from './cookies';

const DEVICE_UUID_COOKIE = 'deviceUuid';

export function saveDeviceUuid(uuid: string, expires?: Date | null) {
  setCookie(DEVICE_UUID_COOKIE, uuid, expires ?? null);
}

export function getDeviceUuid(): string | null {
  return getCookie(DEVICE_UUID_COOKIE);
}

export function removeDeviceUuid() {
  deleteCookie(DEVICE_UUID_COOKIE);
}