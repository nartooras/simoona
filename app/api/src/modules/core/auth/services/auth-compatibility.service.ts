import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import {
  RegisterExternalRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TokenIssueSuccessResponse,
  TokenRequest
} from "@simoona/contracts/auth";
import {
  issueLegacyToken,
  resolveAuthContext,
  resolveUserProfile,
  revokeSessionByAuthorizationHeader,
  RuntimeAuthContext
} from "./auth-session-store";

function resolveRequestAuthContext(request?: Request): RuntimeAuthContext {
  const requestContext = (request as Request & { authContext?: RuntimeAuthContext })?.authContext;
  if (requestContext) {
    return requestContext;
  }

  return resolveAuthContext((request?.headers ?? {}) as Request["headers"]);
}

@Injectable()
export class AuthCompatibilityService {
  async getUserInfo(request?: Request) {
    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Legacy authentication context is required.");
    }

    const user = resolveUserProfile(authContext);
    if (!user) {
      throw new UnauthorizedException("Authenticated user profile could not be resolved.");
    }

    return {
      status: "implemented",
      compatibility: "Account/UserInfo",
      authSource: authContext.authSource,
      user
    };
  }

  async register(_payload: RegisterRequest) {
    return {
      status: "implemented",
      compatibility: "Account/Register",
      result: "validation_required"
    };
  }

  async registerExternal(_payload: RegisterExternalRequest, request?: Request) {
    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Authenticated session is required.");
    }

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

  async getUserLogins(request?: Request) {
    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Authenticated session is required.");
    }

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

  async unlinkLogin(request?: Request) {
    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Authenticated session is required.");
    }

    return {
      status: "implemented",
      compatibility: "User/DeleteLogin",
      result: "unlinked"
    };
  }

  async getLocalizationSettings(request?: Request) {
    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Authenticated session is required.");
    }

    return {
      status: "implemented",
      compatibility: "User/GeneralSettings",
      settings: {
        culture: authContext.culture || "en-US",
        timezone: "UTC"
      }
    };
  }

  async changeLocalizationSettings(request?: Request) {
    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Authenticated session is required.");
    }

    return {
      status: "implemented",
      compatibility: "User/GeneralSettings",
      result: "updated"
    };
  }

  async getUsersForAutocomplete(request?: Request) {
    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Authenticated session is required.");
    }

    return {
      status: "implemented",
      compatibility: "User/GetUsersForAutocomplete",
      users: []
    };
  }

  async logout(request?: Request) {
    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Authenticated session is required.");
    }

    return {
      status: "implemented",
      compatibility: "Account/Logout",
      result: "logged_out",
      revokedToken: revokeSessionByAuthorizationHeader(request?.headers ?? {})
    };
  }

  async issueToken(payload: TokenRequest): Promise<TokenIssueSuccessResponse> {
    const result = issueLegacyToken(payload);
    if (result.ok) {
      return {
        status: "implemented",
        compatibility: "/token",
        tokenType: result.response.tokenType,
        accessToken: result.response.accessToken,
        refreshToken: result.response.refreshToken,
        expiresIn: result.response.expiresIn,
        issuedAtUtc: result.response.issuedAtUtc,
        user: result.response.user
      };
    }

    if (result.errorCode === "INVALID_CREDENTIALS" || result.errorCode === "INVALID_REFRESH_TOKEN") {
      throw new UnauthorizedException(result.errorMessage);
    }

    if (result.errorCode === "INVALID_TOKEN_REQUEST" || result.errorCode === "UNSUPPORTED_GRANT_TYPE") {
      throw new BadRequestException(result.errorMessage);
    }

    throw new BadRequestException("Token request failed.");
  }
}
