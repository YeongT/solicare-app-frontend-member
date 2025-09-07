// types/auth.ts
export interface ApiResponse {
    isSuccess: boolean;
    code : string
    message: string;
    body?: any;
    errors?: string[];
  }
