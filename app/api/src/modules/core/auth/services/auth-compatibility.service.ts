import { Injectable } from "@nestjs/common";
import {
  RegisterExternalRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TokenRequest
} from "@simoona/contracts/auth";

@Injectable()
export class AuthCompatibilityService {
  async getUserInfo() {
    return { status: "planned", compatibility: "Account/UserInfo" };
  }

  async register(_payload: RegisterRequest) {
    return { status: "planned", compatibility: "Account/Register" };
  }

  async registerExternal(_payload: RegisterExternalRequest) {
    return { status: "planned", compatibility: "Account/RegisterExternal" };
  }

  async requestPasswordReset(_payload: { email: string }) {
    return { status: "planned", compatibility: "Account/RequestPasswordReset" };
  }

  async resetPassword(_payload: ResetPasswordRequest) {
    return { status: "planned", compatibility: "Account/ResetPassword" };
  }

  async verifyEmail(_payload: { token: string }) {
    return { status: "planned", compatibility: "Account/VerifyEmail" };
  }

  async externalLogins() {
    return { status: "planned", compatibility: "Account/ExternalLogins" };
  }

  async internalLogins() {
    return { status: "planned", compatibility: "Account/InternalLogins" };
  }

  async getUserLogins() {
    return { status: "planned", compatibility: "User/Logins" };
  }

  async externalLogin() {
    return { status: "planned", compatibility: "Account/ExternalLogin" };
  }

  async unlinkLogin() {
    return { status: "planned", compatibility: "User/DeleteLogin" };
  }

  async logout() {
    return { status: "planned", compatibility: "Account/Logout" };
  }

  async issueToken(_payload: TokenRequest) {
    return { status: "planned", compatibility: "/token" };
  }
}
