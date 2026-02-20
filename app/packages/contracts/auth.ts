export interface TokenRequest {
  username: string;
  password: string;
  grant_type?: string;
  refresh_token?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterExternalRequest {
  email: string;
  externalAccessToken: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}
