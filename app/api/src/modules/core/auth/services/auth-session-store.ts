import { randomUUID } from "node:crypto";
import { IncomingHttpHeaders } from "node:http";
import { DatabaseSync } from "node:sqlite";
import {
  AuthenticatedUserProfile,
  TokenIssueSuccessResponse,
  TokenRequest
} from "@simoona/contracts/auth";
import { RuntimeAuthSource } from "@simoona/contracts/auth-claims";
import { LEGACY_PERMISSION_FLAGS } from "@simoona/contracts/permissions";

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
const AUTH_SQLITE_DB_PATH = process.env.MODERN_AUTH_SQLITE_PATH || ":memory:";
const AUTH_SQLITE_MODE = AUTH_SQLITE_DB_PATH === ":memory:" ? "memory" : "file";
const ALL_KNOWN_PERMISSIONS = Object.values(LEGACY_PERMISSION_FLAGS);

interface SqlRuntimeUser {
  user_id: string;
  user_name: string;
  email: string;
  password: string;
  tenant_id: string;
  culture: string;
}

interface SqlRuntimeSession {
  session_id: string;
  access_token: string;
  refresh_token: string;
  user_id: string;
  issued_at_utc: string;
  expires_at_utc: string;
}

const authDatabase = new DatabaseSync(AUTH_SQLITE_DB_PATH);
initializeAuthDatabase();

function initializeAuthDatabase(): void {
  authDatabase.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS auth_users (
      user_id TEXT PRIMARY KEY,
      user_name TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      culture TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS auth_user_permissions (
      user_id TEXT NOT NULL,
      permission TEXT NOT NULL,
      PRIMARY KEY (user_id, permission),
      FOREIGN KEY (user_id) REFERENCES auth_users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS auth_sessions (
      session_id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL UNIQUE,
      refresh_token TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      issued_at_utc TEXT NOT NULL,
      expires_at_utc TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES auth_users(user_id) ON DELETE CASCADE
    );
  `);

  const seededUsersCount = Number(
    authDatabase.prepare("SELECT COUNT(1) AS count FROM auth_users;").get()?.count ?? 0
  );
  if (seededUsersCount > 0) {
    return;
  }

  const insertUser = authDatabase.prepare(`
    INSERT INTO auth_users (user_id, user_name, email, password, tenant_id, culture, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1);
  `);
  const insertPermission = authDatabase.prepare(`
    INSERT INTO auth_user_permissions (user_id, permission)
    VALUES (?, ?);
  `);

  insertUser.run(
    "legacy-user",
    "legacy.user",
    "legacy.user@simoona.local",
    "legacyPass123",
    "default",
    "en-US"
  );
  insertUser.run(
    "legacy-admin",
    "legacy.admin",
    "legacy.admin@simoona.local",
    "legacyAdmin123",
    "default",
    "en-US"
  );

  const legacyUserPermissions = [
    LEGACY_PERMISSION_FLAGS.basicWall,
    LEGACY_PERMISSION_FLAGS.basicPost,
    LEGACY_PERMISSION_FLAGS.basicComment,
    LEGACY_PERMISSION_FLAGS.basicEvent
  ];

  for (const permission of legacyUserPermissions) {
    insertPermission.run("legacy-user", permission);
  }

  for (const permission of ALL_KNOWN_PERMISSIONS) {
    insertPermission.run("legacy-admin", permission);
  }
}

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

function findUserById(userId: string): SqlRuntimeUser | undefined {
  return authDatabase
    .prepare(
      `
      SELECT user_id, user_name, email, password, tenant_id, culture
      FROM auth_users
      WHERE is_active = 1 AND user_id = ?;
      `
    )
    .get(userId) as SqlRuntimeUser | undefined;
}

function findUserByIdentity(identity: string): SqlRuntimeUser | undefined {
  const normalizedIdentity = identity.trim();
  if (!normalizedIdentity) {
    return undefined;
  }

  return authDatabase
    .prepare(
      `
      SELECT user_id, user_name, email, password, tenant_id, culture
      FROM auth_users
      WHERE is_active = 1
        AND (
          lower(user_id) = lower(?)
          OR lower(user_name) = lower(?)
          OR lower(email) = lower(?)
        )
      LIMIT 1;
      `
    )
    .get(normalizedIdentity, normalizedIdentity, normalizedIdentity) as SqlRuntimeUser | undefined;
}

function findPermissionsByUserId(userId: string): string[] {
  const rows = authDatabase
    .prepare(
      `
      SELECT permission
      FROM auth_user_permissions
      WHERE user_id = ?
      ORDER BY permission ASC;
      `
    )
    .all(userId) as Array<{ permission: string }>;

  return rows.map((row) => row.permission);
}

function getSessionByAccessToken(accessToken: string): SessionRecord | undefined {
  const session = authDatabase
    .prepare(
      `
      SELECT session_id, access_token, refresh_token, user_id, issued_at_utc, expires_at_utc
      FROM auth_sessions
      WHERE access_token = ?;
      `
    )
    .get(accessToken) as SqlRuntimeSession | undefined;

  if (!session) {
    return undefined;
  }

  if (new Date(session.expires_at_utc).getTime() <= Date.now()) {
    authDatabase.prepare("DELETE FROM auth_sessions WHERE session_id = ?;").run(session.session_id);
    return undefined;
  }

  return {
    sessionId: session.session_id,
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    userId: session.user_id,
    issuedAtUtc: session.issued_at_utc,
    expiresAtUtc: session.expires_at_utc
  };
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

  authDatabase
    .prepare(
      `
      INSERT INTO auth_sessions (session_id, access_token, refresh_token, user_id, issued_at_utc, expires_at_utc)
      VALUES (?, ?, ?, ?, ?, ?);
      `
    )
    .run(
      session.sessionId,
      session.accessToken,
      session.refreshToken,
      session.userId,
      session.issuedAtUtc,
      session.expiresAtUtc
    );

  return session;
}

function rotateSession(refreshToken: string): SessionRecord | undefined {
  const existingSession = authDatabase
    .prepare(
      `
      SELECT session_id, user_id
      FROM auth_sessions
      WHERE refresh_token = ?;
      `
    )
    .get(refreshToken) as { session_id: string; user_id: string } | undefined;

  if (!existingSession) {
    return undefined;
  }

  authDatabase.prepare("DELETE FROM auth_sessions WHERE session_id = ?;").run(existingSession.session_id);

  return createSession(existingSession.user_id);
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

function toUserProfile(user: SqlRuntimeUser): AuthenticatedUserProfile {
  return {
    id: user.user_id,
    userName: user.user_name,
    email: user.email,
    tenantId: user.tenant_id,
    culture: user.culture,
    permissions: findPermissionsByUserId(user.user_id)
  };
}

export function resolveAuthContext(headers: IncomingHttpHeaders): RuntimeAuthContext {
  const bearerToken = extractBearerToken(readHeaderValue(headers.authorization));
  if (bearerToken) {
    const session = getSessionByAccessToken(bearerToken);
    if (session) {
      const sessionUser = findUserById(session.userId);
      if (sessionUser) {
        const permissions = findPermissionsByUserId(sessionUser.user_id);
        return {
          isAuthenticated: true,
          userId: sessionUser.user_id,
          userName: sessionUser.user_name,
          email: sessionUser.email,
          tenantId: sessionUser.tenant_id,
          culture: sessionUser.culture,
          permissions,
          authSource: "bearer-token",
          sessionId: session.sessionId,
          expiresAtUtc: session.expiresAtUtc
        };
      }
    }
  }

  const legacyUserId = readHeaderValue(headers["x-legacy-user-id"]);
  if (legacyUserId) {
    const sqlUser = findUserById(legacyUserId) ?? findUserByIdentity(legacyUserId);
    if (sqlUser) {
      return {
        isAuthenticated: true,
        userId: sqlUser.user_id,
        userName: sqlUser.user_name,
        email: sqlUser.email,
        tenantId: sqlUser.tenant_id,
        culture: sqlUser.culture,
        permissions: findPermissionsByUserId(sqlUser.user_id),
        authSource: "legacy-header"
      };
    }
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

  const sqlUser = findUserById(authContext.userId);
  if (sqlUser) {
    return toUserProfile(sqlUser);
  }

  return null;
}

export function revokeSessionByAuthorizationHeader(headers: IncomingHttpHeaders): boolean {
  const bearerToken = extractBearerToken(readHeaderValue(headers.authorization));
  if (!bearerToken) {
    return false;
  }

  const deletedRows = Number(
    authDatabase
      .prepare("DELETE FROM auth_sessions WHERE access_token = ?;")
      .run(bearerToken)
      ?.changes ?? 0
  );
  if (deletedRows <= 0) {
    return false;
  }
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
  "auth-session-store-v2-sqlite";
export const REFRESH_TOKEN_TTL_SECONDS_MARKER = REFRESH_TOKEN_TTL_SECONDS;
export const AUTH_SQLITE_MODE_MARKER = AUTH_SQLITE_MODE;
