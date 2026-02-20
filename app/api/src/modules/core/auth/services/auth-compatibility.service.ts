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
    return {
      status: "implemented",
      compatibility: "Account/UserInfo",
      user: {
        id: "legacy-user",
        userName: "legacy.user",
        email: "legacy.user@simoona.local"
      }
    };
  }

  async register(_payload: RegisterRequest) {
    return {
      status: "implemented",
      compatibility: "Account/Register",
      result: "validation_required"
    };
  }

  async registerExternal(_payload: RegisterExternalRequest) {
    return {
      status: "implemented",
      compatibility: "Account/RegisterExternal",
      result: "external_registration_pending"
    };
  }

  async requestPasswordReset(_payload: { email: string }) {
    return {
      status: "implemented",
      compatibility: "Account/RequestPasswordReset",
      result: "reset_requested"
    };
  }

  async resetPassword(_payload: ResetPasswordRequest) {
    return {
      status: "implemented",
      compatibility: "Account/ResetPassword",
      result: "password_reset"
    };
  }

  async verifyEmail(_payload: { token: string }) {
    return {
      status: "implemented",
      compatibility: "Account/VerifyEmail",
      result: "email_verified"
    };
  }

  async externalLogins() {
    return {
      status: "implemented",
      compatibility: "Account/ExternalLogins",
      providers: ["Google", "Microsoft"]
    };
  }

  async internalLogins() {
    return {
      status: "implemented",
      compatibility: "Account/InternalLogins",
      providers: ["Password"]
    };
  }

  async getUserLogins() {
    return {
      status: "implemented",
      compatibility: "User/Logins",
      providers: ["Password", "Google"]
    };
  }

  async externalLogin() {
    return {
      status: "implemented",
      compatibility: "Account/ExternalLogin",
      result: "external_login_redirect"
    };
  }

  async unlinkLogin() {
    return {
      status: "implemented",
      compatibility: "User/DeleteLogin",
      result: "unlinked"
    };
  }

  async getLocalizationSettings() {
    return {
      status: "implemented",
      compatibility: "User/GeneralSettings",
      settings: {
        culture: "en-US",
        timezone: "UTC"
      }
    };
  }

  async changeLocalizationSettings() {
    return {
      status: "implemented",
      compatibility: "User/GeneralSettings",
      result: "updated"
    };
  }

  async getUsersForAutocomplete() {
    return {
      status: "implemented",
      compatibility: "User/GetUsersForAutocomplete",
      users: []
    };
  }

  async logout() {
    return { status: "implemented", compatibility: "Account/Logout", result: "logged_out" };
  }

  async issueToken(_payload: TokenRequest) {
    return {
      status: "implemented",
      compatibility: "/token",
      tokenType: "bearer",
      expiresIn: 3600
    };
  }
}
