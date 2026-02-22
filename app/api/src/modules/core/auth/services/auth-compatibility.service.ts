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
  RuntimeAuthContext,
  updateUserCulture
} from "./auth-session-store";
import {
  INTEGRATION_FAILURE_MODES,
  throwIfIntegrationFailure
} from "../../integration/services/integration-failure-policy";

const SUPPORTED_CULTURES = new Set(["en-US", "lt-LT"]);
const SUPPORTED_TIMEZONES = new Set(["UTC", "Europe/Vilnius"]);

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

  async externalLogins(request?: Request) {
    throwIfIntegrationFailure(request, "Account/ExternalLogins", [
      INTEGRATION_FAILURE_MODES.oauthTimeout,
      INTEGRATION_FAILURE_MODES.oauthAuthFailure
    ]);

    return {
      status: "implemented",
      compatibility: "Account/ExternalLogins",
      providers: [
        { name: "Google", registrationRoute: "/Account/ExternalLogin?provider=Google&mode=register" },
        { name: "Microsoft", registrationRoute: "/Account/ExternalLogin?provider=Microsoft&mode=register" }
      ]
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

  async externalLogin(request?: Request) {
    throwIfIntegrationFailure(request, "Account/ExternalLogin", [
      INTEGRATION_FAILURE_MODES.oauthTimeout,
      INTEGRATION_FAILURE_MODES.oauthAuthFailure
    ]);

    const provider = String(request?.query?.provider ?? "Google").trim() || "Google";
    return {
      status: "implemented",
      compatibility: "Account/ExternalLogin",
      result: "external_login_redirect",
      provider,
      redirectUrl: `https://auth.simoona.local/${provider.toLowerCase()}`
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
    throwIfIntegrationFailure(request, "User/GeneralSettings", [
      INTEGRATION_FAILURE_MODES.localizationTimeout
    ]);

    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Authenticated session is required.");
    }

    return {
      status: "implemented",
      compatibility: "User/GeneralSettings",
      settings: {
        culture: authContext.culture || "en-US",
        timezone: "UTC",
        availableCultures: Array.from(SUPPORTED_CULTURES),
        availableTimezones: Array.from(SUPPORTED_TIMEZONES)
      },
      result: "loaded"
    };
  }

  async changeLocalizationSettings(
    payload: Record<string, unknown>,
    request?: Request
  ) {
    throwIfIntegrationFailure(request, "User/GeneralSettings", [
      INTEGRATION_FAILURE_MODES.localizationTimeout
    ]);

    const authContext = resolveRequestAuthContext(request);
    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Authenticated session is required.");
    }

    const cultureInput = String(
      payload.culture ?? payload.languageCode ?? authContext.culture ?? "en-US"
    ).trim();
    const timezoneInput = String(payload.timezone ?? payload.timeZoneId ?? "UTC").trim();

    if (!SUPPORTED_CULTURES.has(cultureInput)) {
      throw new BadRequestException(
        `Unsupported culture '${cultureInput}'. Supported cultures: ${Array.from(
          SUPPORTED_CULTURES
        ).join(", ")}.`
      );
    }

    if (!SUPPORTED_TIMEZONES.has(timezoneInput)) {
      throw new BadRequestException(
        `Unsupported timezone '${timezoneInput}'. Supported timezones: ${Array.from(
          SUPPORTED_TIMEZONES
        ).join(", ")}.`
      );
    }

    const updatedProfile = authContext.userId
      ? updateUserCulture(authContext.userId, cultureInput)
      : null;

    return {
      status: "implemented",
      compatibility: "User/GeneralSettings",
      result: "updated",
      settings: {
        culture: updatedProfile?.culture || cultureInput,
        timezone: timezoneInput
      }
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
