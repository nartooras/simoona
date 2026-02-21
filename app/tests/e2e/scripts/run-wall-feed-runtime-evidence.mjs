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
  const wallFeedResponse = await request("/default/Wall/Feed");
  assert(
    wallFeedResponse.statusCode === 200,
    `Expected /default/Wall/Feed to return 200, got ${String(wallFeedResponse.statusCode)}.`
  );
  assert(
    wallFeedResponse.body.includes('id="simoona-runtime-data"'),
    "Wall/feed response is missing runtime payload marker."
  );
  assert(
    wallFeedResponse.body.includes("\"wallFeed\""),
    "Wall/feed response is missing wallFeed runtime payload."
  );
  assert(
    wallFeedResponse.body.includes('src="/src/main.tsx"'),
    "Wall/feed response is missing runtime client script reference."
  );

  const unknownRouteResponse = await request("/default/UnknownRoute");
  assert(
    unknownRouteResponse.statusCode === 404,
    `Expected /default/UnknownRoute to return 404, got ${String(unknownRouteResponse.statusCode)}.`
  );
  assert(
    unknownRouteResponse.body.includes("\"status\":\"not_found\""),
    "Unknown route response should include not_found runtime status."
  );

  run("pnpm", [
    "exec",
    "playwright",
    "test",
    "./scripts/wall-feed-runtime.spec.js",
    "--workers=1",
    "--reporter=line",
    "--browser=chromium"
  ], {
    env: {
      ...process.env,
      WALL_FEED_BASE_URL: webBaseUrl
    }
  });

  console.log("[wall-feed-runtime] Runtime behavior and visual evidence captured.");
} finally {
  shutdown();
  await new Promise((resolve) => {
    webRuntime.once("exit", () => resolve(undefined));
    setTimeout(resolve, 2500);
  });
}
