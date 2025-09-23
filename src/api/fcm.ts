import { apiClient } from './apiClient';

// FCM 토큰 등록 API
export interface RegisterFcmTokenRequest {
  token: string;
}

export interface RegisterFcmTokenResponseBody {
  uuid: string;
  type: string;
  token: string;
  ownerRole: string | null;
  ownerUuid: string | null;
}

export const registerFcmToken = (
  token: string
): Promise<RegisterFcmTokenResponseBody> => {
  return apiClient.post('/firebase/fcm/register', { token });
};
