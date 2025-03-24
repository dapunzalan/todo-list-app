export interface AuthPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  accessToken?: string;
}