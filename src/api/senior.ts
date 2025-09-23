import { SeniorDetailResponseBody } from '../types/api';

/**
 * 특정 시니어의 상세 프로필 정보를 조회하는 API
 * @param seniorUuid - 시니어 UUID
 */
export const getSeniorDetail = (seniorUuid: string): Promise<SeniorDetailResponseBody | null> => {
  return apiClient.get(`/care/senior/${seniorUuid}`);
};

import { apiClient } from './apiClient';
import {
  AddSeniorRequestBody,
  CareSeniorBriefResponseBody,
  Senior,
  SeniorJoinRequestBody,
} from '../types/api';

/**
 * 특정 회원이 모니터링하는 시니어 목록을 조회하는 API
 * @param memberUuid - 현재 로그인한 회원의 UUID
 */
export const getSeniors = (
  memberUuid: string
): Promise<CareSeniorBriefResponseBody[] | null> => {
  // 👇 템플릿 리터럴(``)을 사용해 URL 경로에 동적으로 uuid를 삽입합니다.
  return apiClient.get(`/care/member/${memberUuid}/seniors`);
};

/**
 * 새로운 시니어를 등록하는 API
 * @param seniorData - 등록할 시니어의 정보
 */
export const joinSenior = (
  seniorData: SeniorJoinRequestBody
): Promise<Senior | null> => {
  return apiClient.post('/senior/join', seniorData);
};

/**
 * 특정 회원에게 모니터링 대상(시니어)을 추가하는 API
 * @param memberUuid - 현재 로그인한 회원의 UUID
 * @param seniorData - 추가할 시니어의 정보 (userId, password)
 */
export const addSenior = (
  memberUuid: string,
  seniorData: AddSeniorRequestBody
): Promise<Senior | null> => {
  return apiClient.post(`/care/member/${memberUuid}/seniors`, seniorData);
};

export const updateMonitoringStatus = async (
  seniorUuid: string,
  enabled: boolean
): Promise<void> => {
  // 실제 API 클라이언트를 사용하여 PATCH 요청을 보냅니다.
  await apiClient.patch(`/care/senior/${seniorUuid}/monitoring`, null, {
    params: {
      enabled,
    },
  });
};
