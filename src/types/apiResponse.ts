// types/auth.ts
export interface ApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  body?: unknown;
  errors?: string[];
}
