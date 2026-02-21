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

  const usersResponse = await request("/default/Admin/Users");
  assert(
    usersResponse.statusCode === 200,
    `Expected /default/Admin/Users to return 200, got ${String(usersResponse.statusCode)}.`
  );
  assert(usersResponse.body.includes("\"adminPage\""), "Admin users route missing adminPage payload.");
  assert(usersResponse.body.includes("\"users-list\""), "Admin users route missing users-list view payload.");

  const rolesCreateResponse = await request("/default/Admin/Roles/Create");
  assert(
    rolesCreateResponse.statusCode === 200,
    `Expected /default/Admin/Roles/Create to return 200, got ${String(rolesCreateResponse.statusCode)}.`
  );
  assert(
    rolesCreateResponse.body.includes("\"roles-manage\""),
    "Roles create route missing manage view payload."
  );

  const kudosBasketResponse = await request("/default/Admin/KudosBasket");
  assert(
    kudosBasketResponse.statusCode === 200,
    `Expected /default/Admin/KudosBasket to return 200, got ${String(kudosBasketResponse.statusCode)}.`
  );
  assert(
    kudosBasketResponse.body.includes("\"kudosbasket-manage\""),
    "Kudos basket route missing manage view payload."
  );

  run(
    "pnpm",
    [
      "exec",
      "playwright",
      "test",
      "./scripts/admin-runtime.spec.js",
      "--workers=1",
      "--reporter=line",
      "--browser=chromium"
    ],
    {
      env: {
        ...process.env,
        ADMIN_BASE_URL: webBaseUrl
      }
    }
  );

  console.log("[admin-runtime] Runtime behavior and visual evidence captured.");
} finally {
  shutdown();
  await new Promise((resolve) => {
    webRuntime.once("exit", () => resolve(undefined));
    setTimeout(resolve, 2500);
  });
}
