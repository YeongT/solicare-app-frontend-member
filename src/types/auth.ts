// types/auth.ts
export interface SignUpResponse {
    isSuccess: boolean;
    message?: string;
    result?: { token: string };
  }
  
  export interface LoginResponse {
    isSuccess: boolean;
    message?: string;
    result?: { token: string; name: string };
  }
  