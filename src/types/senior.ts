export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Senior {
  monitorUserUuid: string;
  userId: string;
  password: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  phoneNumber?: string;
  address: string;
  note?: string;
  photo?: string;
}
