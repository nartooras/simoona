import { randomUUID } from "node:crypto";
import { IncomingHttpHeaders } from "node:http";
import {
  AuthenticatedUserProfile,
  TokenIssueSuccessResponse,
  TokenRequest
} from "@simoona/contracts/auth";
import { RuntimeAuthSource } from "@simoona/contracts/auth-claims";
import { LEGACY_PERMISSION_FLAGS } from "@simoona/contracts/permissions";

interface SeedUser {
  id: string;
  userName: string;
  email: string;
  password: string;
  culture: string;
  tenantId: string;
  permissions: string[];
}

interface SessionRecord {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
  issuedAtUtc: string;
  expiresAtUtc: string;
}

export interface RuntimeAuthContext {
  isAuthenticated: boolean;
  userId?: string;
  userName?: string;
  email?: string;
  tenantId?: string;
  culture?: string;
  permissions: string[];
  authSource: RuntimeAuthSource;
  sessionId?: string;
  expiresAtUtc?: string;
}

type TokenIssueFailureCode =
  | "INVALID_TOKEN_REQUEST"
  | "INVALID_CREDENTIALS"
  | "INVALID_REFRESH_TOKEN"
  | "UNSUPPORTED_GRANT_TYPE";

export interface TokenIssueFailure {
  ok: false;
  errorCode: TokenIssueFailureCode;
  errorMessage: string;
}

export interface TokenIssueSuccess {
  ok: true;
  response: TokenIssueSuccessResponse;
}

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

const ALL_KNOWN_PERMISSIONS = Object.values(LEGACY_PERMISSION_FLAGS);

const SEEDED_USERS: SeedUser[] = [
  {
    id: "legacy-user",
    userName: "legacy.user",
    email: "legacy.user@simoona.local",
    password: "legacyPass123",
    culture: "en-US",
    tenantId: "default",
    permissions: [
      LEGACY_PERMISSION_FLAGS.basicWall,
      LEGACY_PERMISSION_FLAGS.basicPost,
      LEGACY_PERMISSION_FLAGS.basicComment,
      LEGACY_PERMISSION_FLAGS.basicEvent
    ]
  },
  {
    id: "legacy-admin",
    userName: "legacy.admin",
    email: "legacy.admin@simoona.local",
    password: "legacyAdmin123",
    culture: "en-US",
    tenantId: "default",
    permissions: ALL_KNOWN_PERMISSIONS
  }
];

const sessionsByAccessToken = new Map<string, SessionRecord>();
const sessionsByRefreshToken = new Map<string, SessionRecord>();

function readHeaderValue(raw: string | string[] | undefined): string {
  if (Array.isArray(raw)) {
    return String(raw[0] ?? "").trim();
  }

  return String(raw ?? "").trim();
}

function parsePermissionHeader(value: string): string[] {
  return value
    .split(/[\s,]+/)
    .map((permission) => permission.trim())
    .filter(Boolean);
}

function findUserById(userId: string): SeedUser | undefined {
  return SEEDED_USERS.find((user) => user.id === userId);
}

function findUserByIdentity(identity: string): SeedUser | undefined {
  const normalizedIdentity = identity.trim().toLowerCase();
  return SEEDED_USERS.find((user) => {
    return (
      user.userName.toLowerCase() === normalizedIdentity ||
      user.email.toLowerCase() === normalizedIdentity
    );
  });
}

function getSessionByAccessToken(accessToken: string): SessionRecord | undefined {
  const session = sessionsByAccessToken.get(accessToken);
  if (!session) {
    return undefined;
  }

  if (new Date(session.expiresAtUtc).getTime() <= Date.now()) {
    sessionsByAccessToken.delete(accessToken);
    sessionsByRefreshToken.delete(session.refreshToken);
    return undefined;
  }

  return session;
}

function createSession(userId: string): SessionRecord {
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + ACCESS_TOKEN_TTL_SECONDS * 1000);
  const session: SessionRecord = {
    sessionId: randomUUID(),
    accessToken: randomUUID().replaceAll("-", ""),
    refreshToken: randomUUID().replaceAll("-", ""),
    userId,
    issuedAtUtc: issuedAt.toISOString(),
    expiresAtUtc: expiresAt.toISOString()
  };

  sessionsByAccessToken.set(session.accessToken, session);
  sessionsByRefreshToken.set(session.refreshToken, session);

  return session;
}

function rotateSession(refreshToken: string): SessionRecord | undefined {
  const existingSession = sessionsByRefreshToken.get(refreshToken);
  if (!existingSession) {
    return undefined;
  }

  sessionsByAccessToken.delete(existingSession.accessToken);
  sessionsByRefreshToken.delete(existingSession.refreshToken);

  return createSession(existingSession.userId);
}

function extractBearerToken(authorizationHeader: string): string {
  const [scheme, token] = authorizationHeader.split(/\s+/, 2);
  if (!scheme || !token) {
    return "";
  }

  if (scheme.toLowerCase() !== "bearer") {
    return "";
  }

  return token.trim();
}

function resolvePermissionsFromHeaders(headers: IncomingHttpHeaders): string[] {
  const rawPermissions = readHeaderValue(headers["x-legacy-permissions"]);
  if (!rawPermissions) {
    return ALL_KNOWN_PERMISSIONS;
  }

  const requested = parsePermissionHeader(rawPermissions);
  return requested.length ? requested : ALL_KNOWN_PERMISSIONS;
}

function toUserProfile(user: SeedUser): AuthenticatedUserProfile {
  return {
    id: user.id,
    userName: user.userName,
    email: user.email,
    tenantId: user.tenantId,
    culture: user.culture,
    permissions: user.permissions
  };
}

export function resolveAuthContext(headers: IncomingHttpHeaders): RuntimeAuthContext {
  const bearerToken = extractBearerToken(readHeaderValue(headers.authorization));
  if (bearerToken) {
    const session = getSessionByAccessToken(bearerToken);
    if (session) {
      const sessionUser = findUserById(session.userId);
      if (sessionUser) {
        return {
          isAuthenticated: true,
          userId: sessionUser.id,
          userName: sessionUser.userName,
          email: sessionUser.email,
          tenantId: sessionUser.tenantId,
          culture: sessionUser.culture,
          permissions: sessionUser.permissions,
          authSource: "bearer-token",
          sessionId: session.sessionId,
          expiresAtUtc: session.expiresAtUtc
        };
      }
    }
  }

  const legacyUserId = readHeaderValue(headers["x-legacy-user-id"]);
  if (legacyUserId) {
    const seededUser = findUserById(legacyUserId) ?? findUserByIdentity(legacyUserId);
    if (seededUser) {
      return {
        isAuthenticated: true,
        userId: seededUser.id,
        userName: seededUser.userName,
        email: seededUser.email,
        tenantId: seededUser.tenantId,
        culture: seededUser.culture,
        permissions: seededUser.permissions,
        authSource: "legacy-header"
      };
    }

    return {
      isAuthenticated: true,
      userId: legacyUserId,
      userName: legacyUserId,
      email: `${legacyUserId}@legacy.local`,
      tenantId: readHeaderValue(headers["x-tenant-id"]) || "default",
      culture: "en-US",
      permissions: resolvePermissionsFromHeaders(headers),
      authSource: "legacy-header"
    };
  }

  return {
    isAuthenticated: false,
    permissions: [],
    authSource: "anonymous"
  };
}

export function hasRequiredPermissions(authContext: RuntimeAuthContext, required: string[]): boolean {
  if (!required.length) {
    return true;
  }

  if (authContext.permissions.includes("*")) {
    return true;
  }

  return required.every((permission) => authContext.permissions.includes(permission));
}

export function resolveRequiredPermissionsFromHeaders(headers: IncomingHttpHeaders): string[] {
  const rawPermissions = readHeaderValue(headers["x-legacy-required-permissions"]);
  if (!rawPermissions) {
    return [];
  }

  return parsePermissionHeader(rawPermissions);
}

export function resolveUserProfile(authContext: RuntimeAuthContext): AuthenticatedUserProfile | null {
  if (!authContext.isAuthenticated || !authContext.userId) {
    return null;
  }

  const seededUser = findUserById(authContext.userId);
  if (seededUser) {
    return toUserProfile(seededUser);
  }

  return {
    id: authContext.userId,
    userName: authContext.userName || authContext.userId,
    email: authContext.email || `${authContext.userId}@legacy.local`,
    tenantId: authContext.tenantId || "default",
    culture: authContext.culture || "en-US",
    permissions: authContext.permissions
  };
}

export function revokeSessionByAuthorizationHeader(headers: IncomingHttpHeaders): boolean {
  const bearerToken = extractBearerToken(readHeaderValue(headers.authorization));
  if (!bearerToken) {
    return false;
  }

  const session = sessionsByAccessToken.get(bearerToken);
  if (!session) {
    return false;
  }

  sessionsByAccessToken.delete(session.accessToken);
  sessionsByRefreshToken.delete(session.refreshToken);
  return true;
}

export function issueLegacyToken(payload: TokenRequest): TokenIssueFailure | TokenIssueSuccess {
  const grantType = String(payload.grant_type || "password").trim().toLowerCase();

  if (grantType === "password") {
    const identity = String(payload.username || "").trim();
    const password = String(payload.password || "").trim();

    if (!identity || !password) {
      return {
        ok: false,
        errorCode: "INVALID_TOKEN_REQUEST",
        errorMessage: "Both username and password are required."
      };
    }

    const user = findUserByIdentity(identity);
    if (!user || user.password !== password) {
      return {
        ok: false,
        errorCode: "INVALID_CREDENTIALS",
        errorMessage: "Invalid username or password."
      };
    }

    const session = createSession(user.id);
    return {
      ok: true,
      response: {
        status: "implemented",
        compatibility: "/token",
        tokenType: "bearer",
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        issuedAtUtc: session.issuedAtUtc,
        user: toUserProfile(user)
      }
    };
  }

  if (grantType === "refresh_token") {
    const refreshToken = String(payload.refresh_token || "").trim();
    if (!refreshToken) {
      return {
        ok: false,
        errorCode: "INVALID_TOKEN_REQUEST",
        errorMessage: "Refresh token is required for refresh_token grant type."
      };
    }

    const refreshedSession = rotateSession(refreshToken);
    if (!refreshedSession) {
      return {
        ok: false,
        errorCode: "INVALID_REFRESH_TOKEN",
        errorMessage: "Refresh token is invalid or expired."
      };
    }

    const user = findUserById(refreshedSession.userId);
    if (!user) {
      return {
        ok: false,
        errorCode: "INVALID_REFRESH_TOKEN",
        errorMessage: "Session user could not be resolved."
      };
    }

    return {
      ok: true,
      response: {
        status: "implemented",
        compatibility: "/token",
        tokenType: "bearer",
        accessToken: refreshedSession.accessToken,
        refreshToken: refreshedSession.refreshToken,
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        issuedAtUtc: refreshedSession.issuedAtUtc,
        user: toUserProfile(user)
      }
    };
  }

  return {
    ok: false,
    errorCode: "UNSUPPORTED_GRANT_TYPE",
    errorMessage: `Unsupported grant type '${grantType}'.`
  };
}

export const AUTH_COMPATIBILITY_SOURCE_MARKER =
  "auth-session-store-v1";
export const REFRESH_TOKEN_TTL_SECONDS_MARKER = REFRESH_TOKEN_TTL_SECONDS;
