export type TokenGrantType = "password" | "refresh_token";

export interface TokenRequest {
  username: string;
  password: string;
  grant_type?: TokenGrantType;
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

export interface AuthenticatedUserProfile {
  id: string;
  userName: string;
  email: string;
  tenantId: string;
  culture: string;
  permissions: string[];
}

export interface TokenIssueSuccessResponse {
  status: "implemented";
  compatibility: "/token";
  tokenType: "bearer";
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  issuedAtUtc: string;
  user: AuthenticatedUserProfile;
}

export interface AccountUserInfoResponse {
  status: "implemented";
  compatibility: "Account/UserInfo";
  user: AuthenticatedUserProfile;
  authSource: string;
}
