import mockApiClient from "./mockApiClient";

export interface SeniorRequestCreate {
  monitorUserUuid: string;
  userId: string;
  password: string;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  phoneNumber?: string;
  address: string;
  note?: string;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface SeniorResponse {
  monitorUserUuid?: string;
  userId: string;
  password: string;
  name: string;
  gender: Gender;
  age: number;
  phoneNumber?: string | null;
  address: string;
  note?: string | null;
}

// seniors 전체 조회
export const fetchSeniors = async (): Promise<SeniorResponse[]> => {
  const res = await mockApiClient.get("/seniors");
  return res.data.seniors; // 서버 mock 구조에 맞춤
};

// senior 추가
export const addSenior = async (
  data: SeniorRequestCreate
): Promise<SeniorResponse> => {
  const res = await mockApiClient.post("/seniors", data);
  return res.data; 
};

// senior 삭제
export const deleteSenior = async (userId: string) => {
  await mockApiClient.delete(`/seniors/${userId}`);
};

export {}
