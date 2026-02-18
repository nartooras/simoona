import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

const apiProjectPath = "modern/apps/api/src/Simoona.Modern.Api/Simoona.Modern.Api.csproj";
const webappFilter = "@simoona/webapp";
const appRouterPath = "modern/apps/webapp/src/app/routes/AppRouter.tsx";
const navigationPath = "modern/apps/webapp/src/app/routes/navigation.ts";

const criticalProtectedApiChecks = [
  { route: "/user-info", apiPath: "/api/v1/account/user-info", expectedProperty: "userId" },
  { route: "/settings/general", apiPath: "/api/v1/user/general-settings", expectedProperty: "languages" },
  { route: "/employees", apiPath: "/api/v1/employees?page=1&pageSize=10", expectedProperty: "pagedList" },
  { route: "/profiles/me", apiPath: "/api/v1/profiles/me", expectedProperty: "id" },
];

export const requiredDemoRouteDefinitions = [
  { path: "/", mode: "real" },
  { path: "/health", mode: "real" },
  { path: "/user-info", mode: "real" },
  { path: "/settings/general", mode: "real" },
  { path: "/employees", mode: "real" },
  { path: "/profiles/me", mode: "real" },
  { path: "/activities/feed", mode: "mock" },
  { path: "/recognition", mode: "mock" },
  { path: "/service-requests", mode: "disabled" },
  { path: "/externals/integrations", mode: "disabled" },
];

const defaultConfig = {
  apiHost: "127.0.0.1",
  apiPort: 5187,
  webHost: "127.0.0.1",
  webPort: 5173,
  organizationId: "7",
  jwtIssuer: "https://local.simoona.test",
  jwtAudience: "modern-api",
  jwtSigningKey: "dev-local-signing-key-change-me-000001",
  jwtAuthority: "",
  devTokenEnabled: "true",
  tokenUserId: "user-1",
  tokenTenantId: "tenant-a",
  tokenExpiresMinutes: 60,
  healthTimeoutMs: 45000,
  healthPollIntervalMs: 500,
};

export const pidFilePath = "/tmp/simoona-modern-demo.json";

export function readDemoConfig() {
  const apiHost = process.env.DEMO_API_HOST ?? defaultConfig.apiHost;
  const apiPort = readPort(process.env.DEMO_API_PORT, defaultConfig.apiPort, "DEMO_API_PORT");
  const webHost = process.env.DEMO_WEB_HOST ?? defaultConfig.webHost;
  const webPort = readPort(process.env.DEMO_WEB_PORT, defaultConfig.webPort, "DEMO_WEB_PORT");
  const organizationId = (process.env.VITE_API_ORGANIZATION_ID ?? defaultConfig.organizationId).trim();

  if (!/^\d+$/.test(organizationId)) {
    throw new Error("VITE_API_ORGANIZATION_ID must be a numeric value.");
  }

  const demoModeRaw = (process.env.VITE_DEMO_MODE ?? "true").trim().toLowerCase();
  if (demoModeRaw !== "true") {
    throw new Error("VITE_DEMO_MODE must be 'true' for demo orchestration.");
  }

  const jwtIssuer = (process.env.Auth__Jwt__Issuer ?? defaultConfig.jwtIssuer).trim();
  const jwtAudience = (process.env.Auth__Jwt__Audience ?? defaultConfig.jwtAudience).trim();
  const jwtSigningKey = (process.env.Auth__Jwt__SigningKey ?? defaultConfig.jwtSigningKey).trim();
  const jwtAuthority = (process.env.Auth__Jwt__Authority ?? defaultConfig.jwtAuthority).trim();

  if (!jwtIssuer || !jwtAudience || !jwtSigningKey) {
    throw new Error("Auth__Jwt__Issuer, Auth__Jwt__Audience, and Auth__Jwt__SigningKey must be configured for demo mode.");
  }

  if (jwtSigningKey.length < 32) {
    throw new Error("Auth__Jwt__SigningKey must be at least 32 characters for demo mode.");
  }

  const apiOrigin = `http://${apiHost}:${apiPort}`;
  const webOrigin = `http://${webHost}:${webPort}`;
  const apiBaseUrl = (process.env.VITE_API_BASE_URL ?? `${apiOrigin}/api`).trim();
  const token = process.env.VITE_API_BEARER_TOKEN?.trim() ?? "";

  return {
    apiHost,
    apiPort,
    apiOrigin,
    webHost,
    webPort,
    webOrigin,
    apiBaseUrl,
    organizationId,
    demoMode: "true",
    token,
    jwtIssuer,
    jwtAudience,
    jwtSigningKey,
    jwtAuthority,
    devTokenEnabled: process.env.Auth__DevToken__Enabled ?? defaultConfig.devTokenEnabled,
    tokenUserId: process.env.DEMO_TOKEN_USER_ID ?? defaultConfig.tokenUserId,
    tokenTenantId: process.env.DEMO_TOKEN_TENANT_ID ?? defaultConfig.tokenTenantId,
    tokenExpiresMinutes: defaultConfig.tokenExpiresMinutes,
    healthTimeoutMs: defaultConfig.healthTimeoutMs,
    healthPollIntervalMs: defaultConfig.healthPollIntervalMs,
  };
}

export function assertDemoEnvironmentConsistency(config) {
  const apiBaseUrl = parseUrl(config.apiBaseUrl, "VITE_API_BASE_URL");
  if (apiBaseUrl.origin !== config.apiOrigin) {
    throw new Error(
      `VITE_API_BASE_URL must target ${config.apiOrigin} for deterministic demo mode, got ${apiBaseUrl.origin}.`,
    );
  }

  if (!apiBaseUrl.pathname.startsWith("/api")) {
    throw new Error(`VITE_API_BASE_URL must use '/api' path prefix, got '${apiBaseUrl.pathname}'.`);
  }

  if (config.devTokenEnabled.trim().toLowerCase() !== "true") {
    throw new Error("Auth__DevToken__Enabled must be 'true' for demo orchestration.");
  }
}

export function assertDemoRouteDefinitions() {
  const routerSource = fs.readFileSync(path.join(repoRoot, appRouterPath), "utf8");
  const navigationSource = fs.readFileSync(path.join(repoRoot, navigationPath), "utf8");

  for (const route of requiredDemoRouteDefinitions) {
    if (!routerSource.includes(`path: '${route.path}'`)) {
      throw new Error(`Missing '${route.path}' route definition in ${appRouterPath}.`);
    }

    const escapedPath = escapeRegExp(route.path);
    const modePattern = new RegExp(`to:\\s*'${escapedPath}'[\\s\\S]{0,300}?availability:\\s*'${route.mode}'`);
    if (!modePattern.test(navigationSource)) {
      throw new Error(
        `Route '${route.path}' must be marked availability '${route.mode}' in ${navigationPath}.`,
      );
    }
  }
}

export async function ensurePortAvailable(host, port, name) {
  const available = await isPortAvailable(host, port);
  if (!available) {
    throw new Error(`${name} port ${port} is already in use on ${host}. Stop the running service or pick another port via DEMO_API_PORT/DEMO_WEB_PORT.`);
  }
}

export function spawnApi(config, options = {}) {
  const stdio = options.stdio ?? "pipe";
  const detached = options.detached ?? false;

  return spawn(
    "dotnet",
    ["run", "--no-launch-profile", "--project", apiProjectPath],
    {
      cwd: repoRoot,
      detached,
      stdio,
      env: {
        ...process.env,
        ASPNETCORE_ENVIRONMENT: "Development",
        ASPNETCORE_URLS: config.apiOrigin,
        Auth__Jwt__Issuer: config.jwtIssuer,
        Auth__Jwt__Audience: config.jwtAudience,
        Auth__Jwt__SigningKey: config.jwtSigningKey,
        Auth__Jwt__Authority: config.jwtAuthority,
        Auth__Jwt__RequireHttpsMetadata: "false",
        Auth__DevToken__Enabled: config.devTokenEnabled,
      },
    },
  );
}

export function spawnWebapp(config, token, options = {}) {
  const stdio = options.stdio ?? "pipe";
  const detached = options.detached ?? false;

  return spawn(
    "pnpm",
    ["--filter", webappFilter, "dev", "--host", config.webHost, "--port", String(config.webPort), "--strictPort"],
    {
      cwd: repoRoot,
      detached,
      stdio,
      env: {
        ...process.env,
        VITE_DEMO_MODE: config.demoMode,
        VITE_API_BASE_URL: config.apiBaseUrl,
        VITE_API_ORGANIZATION_ID: config.organizationId,
        VITE_API_BEARER_TOKEN: token,
      },
    },
  );
}

export async function waitForApiHealthy(apiOrigin, timeoutMs, pollIntervalMs) {
  const startedAt = Date.now();
  let lastError = null;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${apiOrigin}/health`);
      if (response.ok) {
        return;
      }

      lastError = new Error(`Health endpoint responded with ${response.status}.`);
    } catch (error) {
      lastError = error;
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(`API health check timed out after ${timeoutMs}ms.${formatCause(lastError)}`);
}

export async function waitForWebappReady(webOrigin, timeoutMs, pollIntervalMs, fetchImpl = fetch) {
  const startedAt = Date.now();
  let lastError = null;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetchImpl(webOrigin, { redirect: "manual" });
      if (response.status >= 200 && response.status < 400) {
        return;
      }

      lastError = new Error(`Webapp responded with ${response.status}.`);
    } catch (error) {
      lastError = error;
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(`Webapp readiness check timed out after ${timeoutMs}ms.${formatCause(lastError)}`);
}

export async function mintDevToken(config) {
  const response = await fetch(`${config.apiOrigin}/api/v1/dev-auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: config.tokenUserId,
      organizationId: config.organizationId,
      tenantId: config.tokenTenantId,
      expiresMinutes: config.tokenExpiresMinutes,
    }),
  });

  if (!response.ok) {
    const body = await safeReadBody(response);
    throw new Error(`Failed to mint development token (${response.status}). ${body}`.trim());
  }

  const payload = await response.json();
  const token = typeof payload?.accessToken === "string" ? payload.accessToken.trim() : "";

  if (!token) {
    throw new Error("Development token response did not include accessToken.");
  }

  return token;
}

export async function assertApiHealthAndAuthBaseline(config, token, fetchImpl = fetch) {
  await assertHealthResponse(config.apiOrigin, fetchImpl);
  await assertUnauthorizedBaselines(config.organizationId, fetchImpl, config.apiOrigin);
  await assertAuthorizedBaselines(config.organizationId, token, fetchImpl, config.apiOrigin);
  await assertInvalidOrganizationBaseline(token, fetchImpl, config.apiOrigin);
}

export function readProcessOutput(childProcess) {
  const maxLength = 6000;
  let output = "";

  const append = (chunk) => {
    output += chunk.toString();
    if (output.length > maxLength) {
      output = output.slice(output.length - maxLength);
    }
  };

  if (childProcess.stdout) {
    childProcess.stdout.on("data", append);
  }

  if (childProcess.stderr) {
    childProcess.stderr.on("data", append);
  }

  return () => output;
}

export function formatDemoFailure(error, context = "demo") {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const hints = [];

  if (rawMessage.includes("port") && rawMessage.includes("already in use")) {
    hints.push("Port collision: stop the process on that port or set DEMO_API_PORT / DEMO_WEB_PORT.");
  }

  if (
    rawMessage.includes("VITE_API_BASE_URL") ||
    rawMessage.includes("VITE_API_ORGANIZATION_ID") ||
    rawMessage.includes("VITE_DEMO_MODE") ||
    rawMessage.includes("Auth__")
  ) {
    hints.push(
      "Environment mismatch: verify required envs (VITE_DEMO_MODE=true, VITE_API_BASE_URL, VITE_API_ORGANIZATION_ID, Auth__Jwt__Issuer/Audience/SigningKey, Auth__DevToken__Enabled=true).",
    );
  }

  if (
    rawMessage.includes("Health endpoint") ||
    rawMessage.includes("timed out") ||
    rawMessage.includes("API process exited before health became ready")
  ) {
    hints.push("API startup issue: inspect API logs and confirm ASPNETCORE_URLS and JWT settings match demo config.");
  }

  if (
    rawMessage.includes("dev-auth/token") ||
    rawMessage.includes("Failed to mint development token") ||
    rawMessage.includes("must return 401 without token") ||
    rawMessage.includes("must return 200 with demo token")
  ) {
    hints.push("Auth bootstrap issue: confirm /api/v1/dev-auth/token is enabled and demo org/user claims are valid.");
  }

  if (
    rawMessage.includes("SqlException") ||
    rawMessage.includes("ConnectionStrings__LegacyReadOnly") ||
    rawMessage.includes("No such host is known") ||
    rawMessage.includes("login failed")
  ) {
    hints.push(
      "Read DB unavailable: validate ConnectionStrings__LegacyReadOnly and SQL Server reachability for the local demo environment.",
    );
  }

  if (hints.length === 0) {
    hints.push(
      "Check /tmp/simoona-modern-demo-logs (after demo:start) or rerun with the same env and inspect startup output for the first failing check.",
    );
  }

  const lines = [
    `[${context}] ${rawMessage}`,
    ...hints.map((hint, index) => `[${context}] hint ${index + 1}: ${hint}`),
  ];

  return lines.join("\n");
}

export function writePidFile(payload) {
  fs.writeFileSync(pidFilePath, JSON.stringify(payload, null, 2));
}

export function readPidFile() {
  if (!fs.existsSync(pidFilePath)) {
    return null;
  }

  const raw = fs.readFileSync(pidFilePath, "utf8");
  return JSON.parse(raw);
}

export function removePidFile() {
  if (fs.existsSync(pidFilePath)) {
    fs.unlinkSync(pidFilePath);
  }
}

export function ensureLogDir() {
  const logDir = "/tmp/simoona-modern-demo-logs";
  fs.mkdirSync(logDir, { recursive: true });
  return logDir;
}

export function openLogFile(logPath) {
  return fs.openSync(logPath, "a");
}

export function killProcessTree(pid) {
  if (!pid || typeof pid !== "number") {
    return false;
  }

  try {
    process.kill(-pid, "SIGTERM");
    return true;
  } catch {
    try {
      process.kill(pid, "SIGTERM");
      return true;
    } catch {
      return false;
    }
  }
}

export async function stopProcessTree(pid, options = {}) {
  const shutdownTimeoutMs = options.shutdownTimeoutMs ?? 5000;
  const forceTimeoutMs = options.forceTimeoutMs ?? 1500;

  if (!pid || typeof pid !== "number") {
    return "not-configured";
  }

  if (!isPidRunning(pid)) {
    return "not-running";
  }

  signalProcessTree(pid, "SIGTERM");
  if (await waitForProcessExit(pid, shutdownTimeoutMs)) {
    return "stopped";
  }

  signalProcessTree(pid, "SIGKILL");
  if (await waitForProcessExit(pid, forceTimeoutMs)) {
    return "killed";
  }

  return "timeout";
}

function readPort(rawValue, fallback, envName) {
  if (!rawValue) {
    return fallback;
  }

  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`${envName} must be a valid TCP port (1-65535).`);
  }

  return parsed;
}

function parseUrl(rawValue, envName) {
  try {
    return new URL(rawValue);
  } catch {
    throw new Error(`${envName} must be an absolute URL.`);
  }
}

function isPortAvailable(host, port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();

    server.on("error", () => {
      resolve(false);
    });

    server.listen(port, host, () => {
      server.close(() => resolve(true));
    });
  });
}

function formatCause(error) {
  if (!error) {
    return "";
  }

  if (error instanceof Error && error.message) {
    return ` Last error: ${error.message}`;
  }

  return ` Last error: ${String(error)}`;
}

async function assertHealthResponse(apiOrigin, fetchImpl) {
  const response = await fetchImpl(`${apiOrigin}/health`);
  if (!response.ok) {
    throw new Error(`Health endpoint failed with ${response.status}. ${await formatResponseBody(response)}`.trim());
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Health endpoint response must be valid JSON.");
  }

  if (payload?.status !== "healthy") {
    throw new Error(`Health endpoint status must be 'healthy', got '${payload?.status ?? "<missing>"}'.`);
  }
}

async function assertUnauthorizedBaselines(organizationId, fetchImpl, apiOrigin) {
  for (const check of criticalProtectedApiChecks) {
    const response = await fetchImpl(`${apiOrigin}${check.apiPath}`, {
      headers: {
        "X-Org-Id": organizationId,
      },
    });

    if (response.status !== 401) {
      throw new Error(
        `${check.apiPath} must return 401 without token, got ${response.status}. ${await formatResponseBody(response)}`.trim(),
      );
    }
  }
}

async function assertAuthorizedBaselines(organizationId, token, fetchImpl, apiOrigin) {
  for (const check of criticalProtectedApiChecks) {
    const response = await fetchImpl(`${apiOrigin}${check.apiPath}`, {
      headers: {
        "X-Org-Id": organizationId,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        `${check.apiPath} must return 200 with demo token, got ${response.status}. ${await formatResponseBody(response)}`.trim(),
      );
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      throw new Error(`${check.apiPath} returned invalid JSON payload.`);
    }

    if (!(check.expectedProperty in payload)) {
      throw new Error(`${check.apiPath} payload missing expected '${check.expectedProperty}' property.`);
    }
  }
}

async function assertInvalidOrganizationBaseline(token, fetchImpl, apiOrigin) {
  const response = await fetchImpl(`${apiOrigin}/api/v1/account/user-info`, {
    headers: {
      "X-Org-Id": "invalid-org",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 400) {
    throw new Error(
      `/api/v1/account/user-info must return 400 for invalid X-Org-Id, got ${response.status}. ${await formatResponseBody(response)}`.trim(),
    );
  }
}

async function formatResponseBody(response) {
  const body = await safeReadBody(response);
  if (!body) {
    return "";
  }

  return `Response body: ${body.slice(0, 240)}`;
}

function signalProcessTree(pid, signal) {
  try {
    process.kill(-pid, signal);
    return true;
  } catch {
    try {
      process.kill(pid, signal);
      return true;
    } catch {
      return false;
    }
  }
}

function isPidRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitForProcessExit(pid, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (!isPidRunning(pid)) {
      return true;
    }

    await sleep(100);
  }

  return !isPidRunning(pid);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeReadBody(response) {
  try {
    const text = await response.text();
    return text.trim();
  } catch {
    return "";
  }
}
