#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const e2eRoot = process.cwd();
const appRoot = path.resolve(e2eRoot, "..", "..");
const webPort = Number(process.env.WEB_RUNTIME_PORT ?? "5173");
const webBaseUrl = `http://127.0.0.1:${String(webPort)}`;
const requiredScreenshotDirs = ["desktop", "tablet", "mobile"].map((viewport) =>
  path.join(e2eRoot, "visual", "baselines", viewport)
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: e2eRoot,
    stdio: "inherit",
    ...options
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function request(pathName) {
  return new Promise((resolve, reject) => {
    const req = http.get(new URL(pathName, webBaseUrl), (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode ?? 0,
          body
        });
      });
    });
    req.on("error", reject);
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function waitForHealthz(attempts = 50) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const statusCode = await new Promise((resolve, reject) => {
        const req = http.get(new URL("/healthz", webBaseUrl), (res) => {
          resolve(res.statusCode ?? 0);
          res.resume();
        });
        req.on("error", reject);
      });
      if (statusCode === 200) {
        return;
      }
    } catch {
      // Retry while runtime is starting.
    }
    await sleep(250);
  }

  throw new Error(`Timed out waiting for web runtime at ${webBaseUrl}`);
}

for (const screenshotDir of requiredScreenshotDirs) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const webRuntime = spawn("pnpm", ["--dir", "web", "dev"], {
  cwd: appRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    WEB_RUNTIME_PORT: String(webPort)
  }
});

const shutdown = () => {
  if (!webRuntime.killed) {
    webRuntime.kill("SIGTERM");
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

try {
  await waitForHealthz();

  const rootResponse = await request("/");
  assert(
    rootResponse.statusCode === 200,
    `Expected / to return 200, got ${String(rootResponse.statusCode)}.`
  );
  assert(
    rootResponse.body.includes('"view":"public-login"'),
    "Root response is missing public-login view payload."
  );

  const publicLoginResponse = await request("/Login");
  assert(
    publicLoginResponse.statusCode === 200,
    `Expected /Login to return 200, got ${String(publicLoginResponse.statusCode)}.`
  );
  assert(
    publicLoginResponse.body.includes('"authUtilityPage"'),
    "Public login response is missing authUtilityPage payload."
  );
  assert(
    publicLoginResponse.body.includes('"view":"public-login"'),
    "Public login response is missing public-login view payload."
  );

  const tenantLoginResponse = await request("/default/Login");
  assert(
    tenantLoginResponse.statusCode === 200,
    `Expected /default/Login to return 200, got ${String(tenantLoginResponse.statusCode)}.`
  );
  assert(
    tenantLoginResponse.body.includes('"view":"tenant-login"'),
    "Tenant login response is missing tenant-login view payload."
  );

  const tenantHomeResponse = await request("/default");
  assert(
    tenantHomeResponse.statusCode === 200,
    `Expected /default to return 200, got ${String(tenantHomeResponse.statusCode)}.`
  );
  assert(
    tenantHomeResponse.body.includes('"view":"tenant-login"'),
    "Tenant home response is missing tenant-login view payload."
  );

  const redirectResponse = await request("/redirectTo/Wall.Feed");
  assert(
    redirectResponse.statusCode === 200,
    `Expected /redirectTo/Wall.Feed to return 200, got ${String(redirectResponse.statusCode)}.`
  );
  assert(
    redirectResponse.body.includes('"view":"redirect"'),
    "Redirect response is missing redirect view payload."
  );

  const accessDeniedResponse = await request("/default/AccessDenied");
  assert(
    accessDeniedResponse.statusCode === 200,
    `Expected /default/AccessDenied to return 200, got ${String(accessDeniedResponse.statusCode)}.`
  );
  assert(
    accessDeniedResponse.body.includes('"view":"access-denied"'),
    "Access denied response is missing access-denied view payload."
  );

  run(
    "pnpm",
    [
      "exec",
      "playwright",
      "test",
      "./scripts/auth-utility-runtime.spec.js",
      "--workers=1",
      "--reporter=line",
      "--browser=chromium"
    ],
    {
      env: {
        ...process.env,
        AUTH_UTILITY_BASE_URL: webBaseUrl
      }
    }
  );

  console.log("[auth-utility-runtime] Runtime behavior and visual evidence captured.");
} finally {
  shutdown();
  await new Promise((resolve) => {
    webRuntime.once("exit", () => resolve(undefined));
    setTimeout(resolve, 2500);
  });
}
