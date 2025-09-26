import { apiClient } from './apiClient';

import { EventDetailResponseBody } from '../types/api';

// 이벤트 상세 정보를 불러오는 API 함수 (예시)
export const getEventDetail = async (
    eventUuid: string
): Promise<EventDetailResponseBody> => {
    return apiClient.get(`/events/${eventUuid}`);
};
