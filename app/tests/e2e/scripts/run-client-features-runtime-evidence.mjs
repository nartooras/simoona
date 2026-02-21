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

  const routes = [
    "/default/Wall/List",
    "/default/Wall/Create",
    "/default/Wall/Edit/wall-1",
    "/default/Wall/Members?wall=wall-1",
    "/default/Events/List",
    "/default/Events/AddEvent",
    "/default/Events/Edit/event-1",
    "/default/Events/EventContent/event-1",
    "/default/Events/List/Leisure/office/Vilnius",
    "/default/Events/Report",
    "/default/Events/Report/Report/Event/event-1",
    "/default/Kudos",
    "/default/Kudos/KudosAchievementBoard",
    "/default/Kudos/KudosLogList/1",
    "/default/Kudos/KudosUserInformation/1",
    "/default/Books/List",
    "/default/Books/Add",
    "/default/Books/Edit/book-1/office-1",
    "/default/Projects/List",
    "/default/Projects/Create",
    "/default/Projects/Edit/project-1",
    "/default/Projects/Details/project-1",
    "/default/ServiceRequests/List?Id=sr-1001",
    "/default/Vacation/List",
    "/default/Committees/List",
    "/default/Office?floorId=2&roomId=214&coords=143,212&user=anikoncukas",
    "/default/OrganizationalStructure",
    "/default/SubmitTicket"
  ];

  for (const route of routes) {
    const response = await request(route);
    assert(response.statusCode === 200, `Expected ${route} to return 200, got ${String(response.statusCode)}.`);
    assert(
      response.body.includes('"clientFeaturePage"'),
      `Expected ${route} to include clientFeaturePage payload.`
    );
  }

  run(
    "pnpm",
    [
      "exec",
      "playwright",
      "test",
      "./scripts/client-features-runtime.spec.js",
      "--workers=1",
      "--reporter=line",
      "--browser=chromium"
    ],
    {
      env: {
        ...process.env,
        CLIENT_FEATURES_BASE_URL: webBaseUrl
      }
    }
  );

  console.log("[client-features-runtime] Runtime behavior and visual evidence captured.");
} finally {
  shutdown();
  await new Promise((resolve) => {
    webRuntime.once("exit", () => resolve(undefined));
    setTimeout(resolve, 2500);
  });
}
