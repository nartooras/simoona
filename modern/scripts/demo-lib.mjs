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
