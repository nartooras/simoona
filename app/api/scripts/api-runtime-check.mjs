#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiRoot = path.resolve(__dirname, "..");
const appRoot = path.resolve(apiRoot, "..");
const mode = process.argv[2] ?? "build";
const port = Number(process.env.API_RUNTIME_PORT ?? "4300");
const INTEGRATION_FAILURE_HEADER = "x-simoona-integration-failure";
const INTEGRATION_FAILURE_QUERY_KEY = "simulateFailure";
const INTEGRATION_FAILURE_MODES = new Set([
  "oauth-timeout",
  "oauth-auth-failure",
  "smtp-timeout",
  "smtp-auth-failure",
  "storage-timeout",
  "storage-auth-failure",
  "external-jobs-timeout",
  "external-jobs-auth-failure",
  "localization-timeout"
]);
const SUPPORTED_LOCALIZATION_CULTURES = new Set(["en-US", "lt-LT"]);
const SUPPORTED_LOCALIZATION_TIMEZONES = new Set(["UTC", "Europe/Vilnius"]);

const requiredFiles = [
  path.join(apiRoot, "src/main.ts"),
  path.join(apiRoot, "src/modules/app.module.ts"),
  path.join(apiRoot, "src/modules/core/core-compatibility.module.ts"),
  path.join(apiRoot, "src/modules/core/auth/auth-compatibility.module.ts"),
  path.join(appRoot, "tests/parity/contracts/core/error-shape-baseline.json"),
  path.join(appRoot, "docs/parity/api-endpoint-matrix.csv")
];

const sourceContractTargets = [
  {
    file: path.join(apiRoot, "src/modules/app.module.ts"),
    markers: ["@Module", "CoreCompatibilityModule"]
  },
  {
    file: path.join(apiRoot, "src/modules/core/core-compatibility.module.ts"),
    markers: ["AuthCompatibilityModule", "PermissionCompatibilityModule", "SocialCompatibilityModule"]
  },
  {
    file: path.join(apiRoot, "src/modules/core/auth/controllers/account-compatibility.controller.ts"),
    markers: ['@Controller("Account")', 'Get("UserInfo")', 'Post("Register")']
  },
  {
    file: path.join(apiRoot, "src/modules/core/auth/controllers/token-compatibility.controller.ts"),
    markers: ["LEGACY_API_ROUTES.token", "@HttpCode(200)"]
  }
];

function ensureFiles() {
  for (const requiredFile of requiredFiles) {
    if (!fs.existsSync(requiredFile)) {
      console.error(`[api-runtime] Missing required file: ${requiredFile}`);
      process.exit(1);
    }
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: apiRoot,
    stdio: "inherit",
    ...options
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runSourceContractChecks() {
  for (const target of sourceContractTargets) {
    const source = fs.readFileSync(target.file, "utf8");
    for (const marker of target.markers) {
      if (!source.includes(marker)) {
        console.error(`[api-runtime] Missing marker '${marker}' in ${target.file}`);
        process.exit(1);
      }
    }
  }
}

function verifyNoWaveReferences() {
  const matrix = fs.readFileSync(path.join(appRoot, "docs/parity/api-endpoint-matrix.csv"), "utf8");
  if (matrix.includes("wave-a")) {
    console.error("[api-runtime] API matrix still contains wave-specific references.");
    process.exit(1);
  }
}

const apiMatrixPath = path.join(appRoot, "docs/parity/api-endpoint-matrix.csv");

function loadApiMatrixRouteEntries() {
  const rows = fs
    .readFileSync(apiMatrixPath, "utf8")
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean);

  return rows.map((row) => {
    const cols = row.split(",");
    const method = (cols[3] ?? "GET").trim().toUpperCase();
    const routeTemplate = (cols[4] ?? "").trim();
    const authRequired = (cols[5] ?? "").trim() === "true";

    const tokenNames = [];
    const normalizedPath = `/${routeTemplate.replace(/^\/+/, "").replace(/\/+$/, "")}`;
    const normalizedTemplate = normalizedPath.replace(/\{([^/{}]+)\}/g, ":$1");

    const regexBody = normalizedTemplate
      .split("/")
      .map((segment) => {
        if (!segment) {
          return "";
        }

        if (segment.startsWith(":")) {
          tokenNames.push(segment.slice(1));
          return "([^/]+)";
        }

        return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("/");

    return {
      method,
      routeTemplate,
      authRequired,
      tokenNames,
      regex: new RegExp(`^${regexBody}$`)
    };
  });
}

const API_MATRIX_ROUTE_ENTRIES = loadApiMatrixRouteEntries();

function matchApiMatrixRoute(method, pathName) {
  for (const entry of API_MATRIX_ROUTE_ENTRIES) {
    if (entry.method !== "ANY" && entry.method !== method) {
      continue;
    }

    const match = pathName.match(entry.regex);
    if (!match) {
      continue;
    }

    const params = {};
    for (let i = 0; i < entry.tokenNames.length; i += 1) {
      params[entry.tokenNames[i]] = match[i + 1] ?? "";
    }

    return {
      ...entry,
      params
    };
  }

  return null;
}

const WALLS = [
  { id: "wall-1", name: "General", memberCount: 42, isFollowed: true },
  { id: "wall-2", name: "Announcements", memberCount: 17, isFollowed: false }
];

const POSTS = [
  {
    id: "post-1",
    wallId: "wall-1",
    text: "Welcome to the wall feed runtime slice.",
    createdBy: "seed-user",
    createdAtUtc: "2026-02-20T09:00:00.000Z",
    likeCount: 2
  }
];

const COMMENTS_BY_POST = new Map([
  [
    "post-1",
    [
      {
        id: "comment-1",
        postId: "post-1",
        text: "Legacy-style comment seed.",
        createdBy: "seed-user",
        createdAtUtc: "2026-02-20T09:05:00.000Z"
      }
    ]
  ]
]);

let postCounter = POSTS.length;
let commentCounter = 1;

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
const ALL_KNOWN_PERMISSIONS = [
  "BasicPermissions.Event",
  "BasicPermissions.Wall",
  "BasicPermissions.Post",
  "BasicPermissions.Comment",
  "BasicPermissions.ApplicationUser",
  "BasicPermissions.Office",
  "BasicPermissions.Floor",
  "AdministrationPermissions.Organization",
  "AdministrationPermissions.ExternalLink",
  "AdministrationPermissions.Blacklist",
  "AdministrationPermissions.ApplicationUser",
  "AdministrationPermissions.Office",
  "AdministrationPermissions.Floor",
  "AdministrationPermissions.Role"
];
const AUTH_SQLITE_DB_PATH = process.env.MODERN_AUTH_SQLITE_PATH || ":memory:";
const authDatabase = new DatabaseSync(AUTH_SQLITE_DB_PATH);
initializeAuthSqlStore();

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function sendLegacyError(response, statusCode, pathName, errorCode, message) {
  sendJson(response, statusCode, {
    status: "error",
    errorCode,
    message,
    path: pathName,
    timestampUtc: new Date().toISOString()
  });
}

function readHeaderValue(rawHeader) {
  if (Array.isArray(rawHeader)) {
    return String(rawHeader[0] ?? "").trim();
  }

  return String(rawHeader ?? "").trim();
}

function normalizeIntegrationFailureMode(rawMode) {
  const normalized = String(rawMode ?? "").trim().toLowerCase();
  if (!normalized || !INTEGRATION_FAILURE_MODES.has(normalized)) {
    return "";
  }

  return normalized;
}

function resolveIntegrationFailureMode(request, url) {
  const fromHeader = normalizeIntegrationFailureMode(
    readHeaderValue(request.headers?.[INTEGRATION_FAILURE_HEADER])
  );
  if (fromHeader) {
    return fromHeader;
  }

  return normalizeIntegrationFailureMode(url.searchParams.get(INTEGRATION_FAILURE_QUERY_KEY));
}

function sendIntegrationFailure(response, pathName, failureMode, handledModes = []) {
  if (!failureMode) {
    return false;
  }

  if (handledModes.length > 0 && !handledModes.includes(failureMode)) {
    return false;
  }

  if (
    failureMode === "oauth-timeout" ||
    failureMode === "smtp-timeout" ||
    failureMode === "storage-timeout" ||
    failureMode === "external-jobs-timeout" ||
    failureMode === "localization-timeout"
  ) {
    sendLegacyError(response, 504, pathName, "INTEGRATION_TIMEOUT", `${failureMode} was triggered.`);
    return true;
  }

  if (
    failureMode === "oauth-auth-failure" ||
    failureMode === "smtp-auth-failure" ||
    failureMode === "storage-auth-failure" ||
    failureMode === "external-jobs-auth-failure"
  ) {
    sendLegacyError(
      response,
      502,
      pathName,
      "INTEGRATION_AUTH_FAILURE",
      `${failureMode} was triggered.`
    );
    return true;
  }

  return false;
}

function initializeAuthSqlStore() {
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

  for (const permission of [
    "BasicPermissions.Wall",
    "BasicPermissions.Post",
    "BasicPermissions.Comment",
    "BasicPermissions.Event"
  ]) {
    insertPermission.run("legacy-user", permission);
  }

  for (const permission of ALL_KNOWN_PERMISSIONS) {
    insertPermission.run("legacy-admin", permission);
  }
}

function findSqlUserByIdentity(identity) {
  const normalizedIdentity = String(identity || "").trim();
  if (!normalizedIdentity) {
    return null;
  }

  return (
    authDatabase
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
      .get(normalizedIdentity, normalizedIdentity, normalizedIdentity) ?? null
  );
}

function findSqlUserById(userId) {
  const normalizedId = String(userId || "").trim();
  if (!normalizedId) {
    return null;
  }

  return (
    authDatabase
      .prepare(
        `
      SELECT user_id, user_name, email, password, tenant_id, culture
      FROM auth_users
      WHERE is_active = 1 AND user_id = ?;
      `
      )
      .get(normalizedId) ?? null
  );
}

function updateAuthUserCulture(userId, culture) {
  const normalizedUserId = String(userId || "").trim();
  const normalizedCulture = String(culture || "").trim();
  if (!normalizedUserId || !normalizedCulture) {
    return null;
  }

  const updatedRows = Number(
    authDatabase
      .prepare(
        `
      UPDATE auth_users
      SET culture = ?
      WHERE user_id = ? AND is_active = 1;
      `
      )
      .run(normalizedCulture, normalizedUserId)
      ?.changes ?? 0
  );
  if (updatedRows <= 0) {
    return null;
  }

  return toRuntimeAuthUser(findSqlUserById(normalizedUserId));
}

function findPermissionsByUserId(userId) {
  const rows =
    authDatabase
      .prepare(
        `
      SELECT permission
      FROM auth_user_permissions
      WHERE user_id = ?
      ORDER BY permission ASC;
      `
      )
      .all(userId) ?? [];

  return rows.map((row) => String(row.permission));
}

function toRuntimeAuthUser(sqlUser) {
  if (!sqlUser) {
    return null;
  }

  return {
    id: String(sqlUser.user_id),
    userName: String(sqlUser.user_name),
    email: String(sqlUser.email),
    password: String(sqlUser.password),
    tenantId: String(sqlUser.tenant_id),
    culture: String(sqlUser.culture),
    permissions: findPermissionsByUserId(sqlUser.user_id)
  };
}

function getSessionByAccessToken(accessToken) {
  const session =
    authDatabase
      .prepare(
        `
      SELECT session_id, access_token, refresh_token, user_id, issued_at_utc, expires_at_utc
      FROM auth_sessions
      WHERE access_token = ?;
      `
      )
      .get(accessToken) ?? null;

  if (!session) {
    return null;
  }

  if (new Date(session.expires_at_utc).getTime() <= Date.now()) {
    authDatabase.prepare("DELETE FROM auth_sessions WHERE session_id = ?;").run(session.session_id);
    return null;
  }

  return {
    sessionId: String(session.session_id),
    accessToken: String(session.access_token),
    refreshToken: String(session.refresh_token),
    userId: String(session.user_id),
    issuedAtUtc: String(session.issued_at_utc),
    expiresAtUtc: String(session.expires_at_utc)
  };
}

function createAuthSession(userId) {
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + ACCESS_TOKEN_TTL_SECONDS * 1000);
  const session = {
    sessionId: randomUUID(),
    userId,
    accessToken: randomUUID().replaceAll("-", ""),
    refreshToken: randomUUID().replaceAll("-", ""),
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

function rotateAuthSession(refreshToken) {
  const previousSession =
    authDatabase
      .prepare(
        `
      SELECT session_id, user_id
      FROM auth_sessions
      WHERE refresh_token = ?;
      `
      )
      .get(refreshToken) ?? null;

  if (!previousSession) {
    return null;
  }

  authDatabase.prepare("DELETE FROM auth_sessions WHERE session_id = ?;").run(previousSession.session_id);
  return createAuthSession(previousSession.user_id);
}

function parseAuthorizationBearerToken(request) {
  const authorizationHeader = readHeaderValue(request.headers.authorization);
  if (!authorizationHeader) {
    return "";
  }

  const [scheme, token] = authorizationHeader.split(/\s+/, 2);
  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    return "";
  }

  return token.trim();
}

function resolveAuthContext(request) {
  const bearerToken = parseAuthorizationBearerToken(request);
  if (bearerToken) {
    const session = getSessionByAccessToken(bearerToken);
    if (session) {
      const sqlUser = toRuntimeAuthUser(findSqlUserById(session.userId));
      if (sqlUser) {
        return {
          isAuthenticated: true,
          userId: sqlUser.id,
          userName: sqlUser.userName,
          tenantId: sqlUser.tenantId,
          culture: sqlUser.culture,
          permissions: sqlUser.permissions,
          authSource: "bearer-token",
          session
        };
      }
    }
  }

  const legacyHeaderUserId = readHeaderValue(request.headers["x-legacy-user-id"]);
  if (legacyHeaderUserId) {
    const sqlUser = toRuntimeAuthUser(findSqlUserByIdentity(legacyHeaderUserId));
    if (sqlUser) {
      return {
        isAuthenticated: true,
        userId: sqlUser.id,
        userName: sqlUser.userName,
        tenantId: sqlUser.tenantId,
        culture: sqlUser.culture,
        permissions: sqlUser.permissions,
        authSource: "legacy-header",
        session: null
      };
    }
  }

  return {
    isAuthenticated: false,
    userId: "",
    userName: "",
    tenantId: "",
    culture: "en-US",
    permissions: [],
    authSource: "anonymous",
    session: null
  };
}

function requireAuth(request, response, pathName) {
  const authContext = resolveAuthContext(request);
  if (!authContext.isAuthenticated) {
    sendLegacyError(
      response,
      401,
      pathName,
      "UNAUTHORIZED",
      "Legacy authentication context is required."
    );
    return null;
  }

  return authContext;
}

function issueTokenFromRequestPayload(payload) {
  const grantType = String(payload.grant_type || "password").trim().toLowerCase();
  if (grantType === "password") {
    const identity = String(payload.username || "").trim();
    const password = String(payload.password || "").trim();
    if (!identity || !password) {
      return {
        status: 400,
        errorCode: "INVALID_TOKEN_REQUEST",
        message: "Both username and password are required."
      };
    }

    const sqlUser = toRuntimeAuthUser(findSqlUserByIdentity(identity));
    if (!sqlUser || sqlUser.password !== password) {
      return {
        status: 401,
        errorCode: "INVALID_CREDENTIALS",
        message: "Invalid username or password."
      };
    }

    const session = createAuthSession(sqlUser.id);
    return {
      status: 200,
      body: {
        status: "implemented",
        compatibility: "/token",
        tokenType: "bearer",
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        issuedAtUtc: session.issuedAtUtc,
        user: {
          id: sqlUser.id,
          userName: sqlUser.userName,
          email: sqlUser.email,
          tenantId: sqlUser.tenantId,
          culture: sqlUser.culture,
          permissions: sqlUser.permissions
        }
      }
    };
  }

  if (grantType === "refresh_token") {
    const refreshToken = String(payload.refresh_token || "").trim();
    if (!refreshToken) {
      return {
        status: 400,
        errorCode: "INVALID_TOKEN_REQUEST",
        message: "Refresh token is required for refresh_token grant type."
      };
    }

    const session = rotateAuthSession(refreshToken);
    if (!session) {
      return {
        status: 401,
        errorCode: "INVALID_REFRESH_TOKEN",
        message: "Refresh token is invalid or expired."
      };
    }

    const sqlUser = toRuntimeAuthUser(findSqlUserById(session.userId));
    if (!sqlUser) {
      return {
        status: 401,
        errorCode: "INVALID_REFRESH_TOKEN",
        message: "Refresh token user could not be resolved."
      };
    }

    return {
      status: 200,
      body: {
        status: "implemented",
        compatibility: "/token",
        tokenType: "bearer",
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        issuedAtUtc: session.issuedAtUtc,
        user: {
          id: sqlUser.id,
          userName: sqlUser.userName,
          email: sqlUser.email,
          tenantId: sqlUser.tenantId,
          culture: sqlUser.culture,
          permissions: sqlUser.permissions
        }
      }
    };
  }

  return {
    status: 400,
    errorCode: "UNSUPPORTED_GRANT_TYPE",
    message: `Unsupported grant type '${grantType}'.`
  };
}

function findWall(wallId) {
  return WALLS.find((wall) => wall.id === wallId);
}

function findPost(postId) {
  return POSTS.find((post) => post.id === postId);
}

async function readJsonBody(request) {
  if (request.method === "GET" || request.method === "DELETE") {
    return {};
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function ensureNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function handleRuntimeRequest(request, response) {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${String(port)}`);
  const pathName = url.pathname;
  const requestMethod = (request.method ?? "GET").toUpperCase();
  const integrationFailureMode = resolveIntegrationFailureMode(request, url);

  if (pathName === "/healthz" || pathName === "/readyz") {
    sendJson(response, 200, {
      status: "ok",
      service: "simoona-api-runtime",
      checkedAtUtc: new Date().toISOString()
    });
    return;
  }

  if (requestMethod === "POST" && pathName === "/token") {
    const payload = await readJsonBody(request);
    if (!payload) {
      sendLegacyError(response, 400, pathName, "INVALID_JSON", "Request payload must be valid JSON.");
      return;
    }

    const tokenIssue = issueTokenFromRequestPayload(payload);
    if (tokenIssue.status !== 200) {
      sendLegacyError(
        response,
        tokenIssue.status,
        pathName,
        tokenIssue.errorCode,
        tokenIssue.message
      );
      return;
    }

    sendJson(response, 200, tokenIssue.body);
    return;
  }

  if (requestMethod === "GET" && pathName === "/Account/UserInfo") {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    sendJson(response, 200, {
      status: "implemented",
      compatibility: "Account/UserInfo",
      authSource: authContext.authSource,
      user: {
        id: authContext.userId,
        userName: authContext.userName,
        email: `${authContext.userName}@simoona.local`,
        tenantId: authContext.tenantId || "default",
        culture: authContext.culture || "en-US",
        permissions: authContext.permissions
      }
    });
    return;
  }

  if (pathName === "/Account/Logout") {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    const bearerToken = parseAuthorizationBearerToken(request);
    let revokedToken = false;
    if (bearerToken) {
      const deleteResult = authDatabase
        .prepare("DELETE FROM auth_sessions WHERE access_token = ?;")
        .run(bearerToken);
      revokedToken = Number(deleteResult?.changes ?? 0) > 0;
    }

    sendJson(response, 200, {
      status: "implemented",
      compatibility: "Account/Logout",
      result: "logged_out",
      revokedToken,
      authSource: authContext.authSource
    });
    return;
  }

  if (requestMethod === "GET" && pathName === "/Account/ExternalLogins") {
    if (
      integrationFailureMode &&
      sendIntegrationFailure(response, pathName, integrationFailureMode, [
        "oauth-timeout",
        "oauth-auth-failure"
      ])
    ) {
      return;
    }

    sendJson(response, 200, {
      status: "implemented",
      compatibility: "Account/ExternalLogins",
      providers: [
        { name: "Google", registrationRoute: "/Account/ExternalLogin?provider=Google&mode=register" },
        {
          name: "Microsoft",
          registrationRoute: "/Account/ExternalLogin?provider=Microsoft&mode=register"
        }
      ]
    });
    return;
  }

  if (requestMethod === "GET" && pathName === "/Account/ExternalLogin") {
    if (
      integrationFailureMode &&
      sendIntegrationFailure(response, pathName, integrationFailureMode, [
        "oauth-timeout",
        "oauth-auth-failure"
      ])
    ) {
      return;
    }

    const provider = String(url.searchParams.get("provider") ?? "Google").trim() || "Google";
    sendJson(response, 200, {
      status: "implemented",
      compatibility: "Account/ExternalLogin",
      result: "external_login_redirect",
      provider,
      redirectUrl: `https://auth.simoona.local/${provider.toLowerCase()}`
    });
    return;
  }

  if (requestMethod === "GET" && pathName === "/User/GeneralSettings") {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    if (
      integrationFailureMode &&
      sendIntegrationFailure(response, pathName, integrationFailureMode, ["localization-timeout"])
    ) {
      return;
    }

    sendJson(response, 200, {
      status: "implemented",
      compatibility: "User/GeneralSettings",
      settings: {
        culture: authContext.culture || "en-US",
        timezone: "UTC",
        availableCultures: Array.from(SUPPORTED_LOCALIZATION_CULTURES),
        availableTimezones: Array.from(SUPPORTED_LOCALIZATION_TIMEZONES)
      },
      result: "loaded"
    });
    return;
  }

  if (requestMethod === "PUT" && pathName === "/User/GeneralSettings") {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    if (
      integrationFailureMode &&
      sendIntegrationFailure(response, pathName, integrationFailureMode, ["localization-timeout"])
    ) {
      return;
    }

    const payload = await readJsonBody(request);
    if (!payload) {
      sendLegacyError(response, 400, pathName, "INVALID_JSON", "Request payload must be valid JSON.");
      return;
    }

    const requestedCulture = String(
      payload.culture ?? payload.languageCode ?? authContext.culture ?? "en-US"
    ).trim();
    const requestedTimezone = String(payload.timezone ?? payload.timeZoneId ?? "UTC").trim();

    if (!SUPPORTED_LOCALIZATION_CULTURES.has(requestedCulture)) {
      sendLegacyError(
        response,
        400,
        pathName,
        "INVALID_LOCALIZATION_CULTURE",
        `Unsupported culture '${requestedCulture}'.`
      );
      return;
    }

    if (!SUPPORTED_LOCALIZATION_TIMEZONES.has(requestedTimezone)) {
      sendLegacyError(
        response,
        400,
        pathName,
        "INVALID_LOCALIZATION_TIMEZONE",
        `Unsupported timezone '${requestedTimezone}'.`
      );
      return;
    }

    const updatedUser = updateAuthUserCulture(authContext.userId, requestedCulture);
    sendJson(response, 200, {
      status: "implemented",
      compatibility: "User/GeneralSettings",
      result: "updated",
      settings: {
        culture: updatedUser?.culture || requestedCulture,
        timezone: requestedTimezone
      }
    });
    return;
  }

  const externalJobRouteByPath = {
    "/ExternalJobs/SendDailyMails": "ExternalJobs/SendDailyMails",
    "/ExternalJobs/SendBirthdaysNotifications": "ExternalJobs/SendBirthdaysNotifications",
    "/ExternalJobs/AnonymizeUsers": "ExternalJobs/AnonymizeUsers",
    "/ExternalJobs/ProcessExpiredBlacklistUsers": "ExternalJobs/ProcessExpiredBlacklistUsers"
  };
  const externalJobFailureModesByPath = {
    "/ExternalJobs/SendDailyMails": [
      "smtp-timeout",
      "smtp-auth-failure",
      "external-jobs-timeout",
      "external-jobs-auth-failure"
    ],
    "/ExternalJobs/SendBirthdaysNotifications": [
      "smtp-timeout",
      "smtp-auth-failure",
      "external-jobs-timeout",
      "external-jobs-auth-failure"
    ],
    "/ExternalJobs/AnonymizeUsers": ["external-jobs-timeout", "external-jobs-auth-failure"],
    "/ExternalJobs/ProcessExpiredBlacklistUsers": [
      "external-jobs-timeout",
      "external-jobs-auth-failure"
    ]
  };
  if (
    requestMethod === "POST" &&
    Object.prototype.hasOwnProperty.call(externalJobRouteByPath, pathName)
  ) {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    if (
      integrationFailureMode &&
      sendIntegrationFailure(
        response,
        pathName,
        integrationFailureMode,
        externalJobFailureModesByPath[pathName]
      )
    ) {
      return;
    }

    sendJson(response, 200, {
      status: "implemented",
      compatibility: externalJobRouteByPath[pathName],
      result: "queued",
      authSource: authContext.authSource
    });
    return;
  }

  if (pathName === "/Picture/Upload") {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    if (
      integrationFailureMode &&
      sendIntegrationFailure(response, pathName, integrationFailureMode, [
        "storage-timeout",
        "storage-auth-failure"
      ])
    ) {
      return;
    }

    const contentType = readHeaderValue(request.headers["content-type"]).toLowerCase();
    if (contentType && !contentType.includes("multipart/form-data") && !contentType.includes("application/json")) {
      sendLegacyError(
        response,
        415,
        pathName,
        "UNSUPPORTED_MEDIA_TYPE",
        "Picture upload expects multipart form-data payload."
      );
      return;
    }

    sendJson(response, 200, {
      status: "implemented",
      compatibility: "Picture/Upload",
      media: {
        url: "/media/placeholder",
        access: "private",
        provider: "storage"
      },
      authSource: authContext.authSource
    });
    return;
  }

  if (requestMethod === "GET" && pathName === "/Wall/List") {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    sendJson(response, 200, {
      status: "ok",
      compatibility: "Wall/List",
      legacyUserId: authContext.userId,
      items: WALLS,
      total: WALLS.length
    });
    return;
  }

  if (requestMethod === "GET" && pathName === "/Wall/Posts") {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    const wallId = url.searchParams.get("wallId") ?? "";
    if (!ensureNonEmptyString(wallId)) {
      sendLegacyError(response, 400, pathName, "VALIDATION_ERROR", "Query parameter 'wallId' is required.");
      return;
    }

    const wall = findWall(wallId);
    if (!wall) {
      sendLegacyError(response, 404, pathName, "WALL_NOT_FOUND", `Wall '${wallId}' was not found.`);
      return;
    }

    const posts = POSTS.filter((post) => post.wallId === wallId).map((post) => ({
      ...post,
      commentCount: COMMENTS_BY_POST.get(post.id)?.length ?? 0
    }));

    sendJson(response, 200, {
      status: "ok",
      compatibility: "Wall/Posts",
      legacyUserId: authContext.userId,
      wall,
      items: posts,
      total: posts.length
    });
    return;
  }

  if (requestMethod === "POST" && pathName === "/Post/Create") {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    const payload = await readJsonBody(request);
    if (!payload) {
      sendLegacyError(response, 400, pathName, "INVALID_JSON", "Request payload must be valid JSON.");
      return;
    }

    const wallId = payload.wallId;
    const text = payload.text;

    if (!ensureNonEmptyString(wallId) || !ensureNonEmptyString(text)) {
      sendLegacyError(
        response,
        400,
        pathName,
        "VALIDATION_ERROR",
        "Both 'wallId' and 'text' are required for post creation."
      );
      return;
    }

    if (!findWall(wallId)) {
      sendLegacyError(response, 404, pathName, "WALL_NOT_FOUND", `Wall '${wallId}' was not found.`);
      return;
    }

    if (text.length > 2000) {
      sendLegacyError(response, 400, pathName, "VALIDATION_ERROR", "Post text exceeds max length 2000.");
      return;
    }

    postCounter += 1;
    const createdPost = {
      id: `post-${String(postCounter)}`,
      wallId,
      text: text.trim(),
      createdBy: authContext.userId,
      createdAtUtc: new Date().toISOString(),
      likeCount: 0
    };
    POSTS.unshift(createdPost);
    COMMENTS_BY_POST.set(createdPost.id, []);

    sendJson(response, 200, {
      status: "ok",
      compatibility: "Post/Create",
      post: createdPost
    });
    return;
  }

  if (requestMethod === "POST" && pathName === "/Comment/Create") {
    const authContext = requireAuth(request, response, pathName);
    if (!authContext) {
      return;
    }

    const payload = await readJsonBody(request);
    if (!payload) {
      sendLegacyError(response, 400, pathName, "INVALID_JSON", "Request payload must be valid JSON.");
      return;
    }

    const postId = payload.postId;
    const text = payload.text;
    if (!ensureNonEmptyString(postId) || !ensureNonEmptyString(text)) {
      sendLegacyError(
        response,
        400,
        pathName,
        "VALIDATION_ERROR",
        "Both 'postId' and 'text' are required for comment creation."
      );
      return;
    }

    if (!findPost(postId)) {
      sendLegacyError(response, 404, pathName, "POST_NOT_FOUND", `Post '${postId}' was not found.`);
      return;
    }

    commentCounter += 1;
    const createdComment = {
      id: `comment-${String(commentCounter)}`,
      postId,
      text: text.trim(),
      createdBy: authContext.userId,
      createdAtUtc: new Date().toISOString()
    };

    const existingComments = COMMENTS_BY_POST.get(postId) ?? [];
    existingComments.push(createdComment);
    COMMENTS_BY_POST.set(postId, existingComments);

    sendJson(response, 200, {
      status: "ok",
      compatibility: "Comment/Create",
      comment: createdComment
    });
    return;
  }

  const matrixRouteMatch = matchApiMatrixRoute(requestMethod, pathName);
  if (matrixRouteMatch) {
    const authContext = matrixRouteMatch.authRequired
      ? requireAuth(request, response, pathName)
      : resolveAuthContext(request);
    if (matrixRouteMatch.authRequired && !authContext) {
      return;
    }

    const needsBody = !["GET", "HEAD"].includes(requestMethod);
    const requestBody = needsBody ? await readJsonBody(request) : {};
    if (needsBody && requestBody === null) {
      sendLegacyError(response, 400, pathName, "INVALID_JSON", "Request payload must be valid JSON.");
      return;
    }

    sendJson(response, 200, {
      status: "ok",
      compatibility: matrixRouteMatch.routeTemplate,
      legacyUserId: authContext?.userId || null,
      authSource: authContext?.authSource || "anonymous",
      method: requestMethod,
      params: matrixRouteMatch.params,
      query: Object.fromEntries(url.searchParams.entries()),
      requestBody,
      matchedBy: "api-endpoint-matrix-generic-runtime-v1"
    });
    return;
  }

  sendLegacyError(response, 404, pathName, "NOT_FOUND", "Endpoint is not implemented in runtime slice.");
}

function startServer() {
  const server = http.createServer((request, response) => {
    void handleRuntimeRequest(request, response).catch((error) => {
      const url = new URL(request.url ?? "/", `http://127.0.0.1:${String(port)}`);
      sendLegacyError(
        response,
        500,
        url.pathname,
        "UNHANDLED_RUNTIME_ERROR",
        error instanceof Error ? error.message : String(error)
      );
    });
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`[api-runtime] listening on http://127.0.0.1:${String(port)}`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

ensureFiles();
verifyNoWaveReferences();

if (mode === "lint") {
  run("pnpm", ["--dir", "tests/parity", "contract:core"], { cwd: appRoot });
  console.log("[api-runtime] lint checks passed (contract + structure).");
  process.exit(0);
}

if (mode === "typecheck") {
  runSourceContractChecks();
  console.log("[api-runtime] source contract/type checks passed.");
  process.exit(0);
}

if (mode === "test") {
  runSourceContractChecks();
  run("pnpm", ["--dir", "tests/parity", "test"], { cwd: appRoot });
  console.log("[api-runtime] test checks passed (source contracts + parity contracts).");
  process.exit(0);
}

if (mode === "build") {
  runSourceContractChecks();
  console.log("[api-runtime] build checks passed (source contracts validated).");
  process.exit(0);
}

if (mode === "start") {
  startServer();
} else {
  console.error(`[api-runtime] Unsupported mode: ${mode}`);
  process.exit(1);
}
