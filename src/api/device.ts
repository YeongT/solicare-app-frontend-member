import { apiClient } from './apiClient';

// 멤버-디바이스 연결 API
export const connectDeviceToMember = async (
  memberUuid: string,
  deviceUuid: string
) => {
  return apiClient.put(`push/member/${memberUuid}/devices/${deviceUuid}`);
};
