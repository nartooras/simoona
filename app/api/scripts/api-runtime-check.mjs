#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiRoot = path.resolve(__dirname, "..");
const appRoot = path.resolve(apiRoot, "..");
const mode = process.argv[2] ?? "build";
const port = Number(process.env.API_RUNTIME_PORT ?? "4300");

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
const SEEDED_RUNTIME_USERS = [
  {
    id: "legacy-user",
    userName: "legacy.user",
    email: "legacy.user@simoona.local",
    password: "legacyPass123",
    culture: "en-US",
    tenantId: "default",
    permissions: ["BasicPermissions.Wall", "BasicPermissions.Post", "BasicPermissions.Comment"]
  },
  {
    id: "legacy-admin",
    userName: "legacy.admin",
    email: "legacy.admin@simoona.local",
    password: "legacyAdmin123",
    culture: "en-US",
    tenantId: "default",
    permissions: ["*"]
  }
];

const sessionsByAccessToken = new Map();
const sessionsByRefreshToken = new Map();

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

function findSeededUserByIdentity(identity) {
  const normalizedIdentity = String(identity || "").trim().toLowerCase();
  return SEEDED_RUNTIME_USERS.find((user) => {
    return (
      user.userName.toLowerCase() === normalizedIdentity ||
      user.email.toLowerCase() === normalizedIdentity ||
      user.id.toLowerCase() === normalizedIdentity
    );
  });
}

function getSessionByAccessToken(accessToken) {
  const session = sessionsByAccessToken.get(accessToken);
  if (!session) {
    return null;
  }

  if (new Date(session.expiresAtUtc).getTime() <= Date.now()) {
    sessionsByAccessToken.delete(session.accessToken);
    sessionsByRefreshToken.delete(session.refreshToken);
    return null;
  }

  return session;
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

  sessionsByAccessToken.set(session.accessToken, session);
  sessionsByRefreshToken.set(session.refreshToken, session);

  return session;
}

function rotateAuthSession(refreshToken) {
  const previousSession = sessionsByRefreshToken.get(refreshToken);
  if (!previousSession) {
    return null;
  }

  sessionsByAccessToken.delete(previousSession.accessToken);
  sessionsByRefreshToken.delete(previousSession.refreshToken);
  return createAuthSession(previousSession.userId);
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
      const seededUser = findSeededUserByIdentity(session.userId);
      if (seededUser) {
        return {
          isAuthenticated: true,
          userId: seededUser.id,
          userName: seededUser.userName,
          tenantId: seededUser.tenantId,
          culture: seededUser.culture,
          permissions: seededUser.permissions,
          authSource: "bearer-token",
          session
        };
      }
    }
  }

  const legacyHeaderUserId = readHeaderValue(request.headers["x-legacy-user-id"]);
  if (legacyHeaderUserId) {
    const seededUser = findSeededUserByIdentity(legacyHeaderUserId);
    if (seededUser) {
      return {
        isAuthenticated: true,
        userId: seededUser.id,
        userName: seededUser.userName,
        tenantId: seededUser.tenantId,
        culture: seededUser.culture,
        permissions: seededUser.permissions,
        authSource: "legacy-header",
        session: null
      };
    }

    return {
      isAuthenticated: true,
      userId: legacyHeaderUserId,
      userName: legacyHeaderUserId,
      tenantId: readHeaderValue(request.headers["x-tenant-id"]) || "default",
      culture: "en-US",
      permissions: ["*"],
      authSource: "legacy-header",
      session: null
    };
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

    const user = findSeededUserByIdentity(identity);
    if (!user || user.password !== password) {
      return {
        status: 401,
        errorCode: "INVALID_CREDENTIALS",
        message: "Invalid username or password."
      };
    }

    const session = createAuthSession(user.id);
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
          id: user.id,
          userName: user.userName,
          email: user.email,
          tenantId: user.tenantId,
          culture: user.culture,
          permissions: user.permissions
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

    const user = findSeededUserByIdentity(session.userId);
    if (!user) {
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
          id: user.id,
          userName: user.userName,
          email: user.email,
          tenantId: user.tenantId,
          culture: user.culture,
          permissions: user.permissions
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
      const session = sessionsByAccessToken.get(bearerToken);
      if (session) {
        sessionsByAccessToken.delete(session.accessToken);
        sessionsByRefreshToken.delete(session.refreshToken);
        revokedToken = true;
      }
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
