#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";

const e2eRoot = process.cwd();
const webRoot = path.resolve(e2eRoot, "../../web");
const port = Number(process.env.WEB_RUNTIME_SMOKE_PORT ?? "5174");
const baseUrl = `http://127.0.0.1:${String(port)}`;
const timeoutMs = 20000;

const expectedRoutes = ["/", "/profile", "/Wall/Feed", "/Settings/Notifications"];
let webProcess;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithCheck(route) {
  const response = await fetch(`${baseUrl}${route}`);
  const body = await response.text();

  if (response.status !== 200) {
    throw new Error(`[wave-a-runtime-smoke] ${route} returned ${String(response.status)}.`);
  }

  for (const marker of ["simoona-runtime-data", route, "legacyLoginBoundary"]) {
    if (!body.includes(marker)) {
      throw new Error(`[wave-a-runtime-smoke] ${route} missing marker '${marker}'.`);
    }
  }
}

async function waitUntilReady() {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/healthz`);
      if (response.status === 200) {
        return;
      }
    } catch {
      // Keep polling until timeout.
    }

    await sleep(250);
  }

  throw new Error("[wave-a-runtime-smoke] Timed out waiting for web runtime readiness.");
}

async function main() {
  webProcess = spawn("pnpm", ["dev"], {
    cwd: webRoot,
    env: { ...process.env, WEB_RUNTIME_PORT: String(port) },
    stdio: "inherit"
  });

  webProcess.on("error", (error) => {
    throw error;
  });

  await waitUntilReady();

  for (const route of expectedRoutes) {
    await fetchWithCheck(route);
  }

  console.log("[wave-a-runtime-smoke] Live runtime route checks passed.");
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  if (webProcess && !webProcess.killed) {
    webProcess.kill("SIGTERM");
  }
}
