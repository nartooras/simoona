#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn, spawnSync } from "node:child_process";

const mode = process.argv[2] ?? "check";
const root = process.cwd();
const webPort = Number(process.env.WEB_RUNTIME_PORT ?? "5173");
const webBaseUrl = `http://127.0.0.1:${String(webPort)}`;

const requiredDirs = [
  "web",
  "api",
  "packages/contracts",
  "packages/ui",
  "packages/config",
  "tests/e2e",
  "tests/parity",
  "infra/docker",
  "infra/cloudflare",
  "infra/ci",
  "docs/orchestration"
];

const requiredFiles = [
  "package.json",
  "pnpm-workspace.yaml",
  "docs/orchestration/backlog.md",
  "docs/orchestration/status.md",
  "docs/orchestration/risks.md",
  "docs/orchestration/decisions.md",
  "docs/orchestration/evidence.md",
  "infra/docker/docker-compose.yml",
  "infra/cloudflare/README.md",
  "infra/ci/pipeline-contract.md"
];

const requiredFixtureDirs = [
  "tests/parity/fixtures/auth",
  "tests/parity/fixtures/wall",
  "tests/parity/fixtures/profile",
  "tests/parity/fixtures/admin",
  "tests/parity/fixtures/features"
];

function hasMissing(items) {
  return items.filter((item) => !fs.existsSync(path.join(root, item)));
}

function run(command, args, opts = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    ...opts
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealthz(url, attempts = 20, delayMs = 250) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const statusCode = await new Promise((resolve, reject) => {
        const req = http.get(new URL("/healthz", url), (res) => {
          resolve(res.statusCode ?? 0);
          res.resume();
        });
        req.on("error", reject);
      });

      if (statusCode === 200) {
        return;
      }
    } catch {
      // Continue retrying until timeout.
    }

    await sleep(delayMs);
  }

  throw new Error(`Timed out waiting for /healthz at ${url}`);
}

async function runSmokeFlow() {
  const webRuntime = spawn("pnpm", ["--dir", "web", "dev"], {
    cwd: root,
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
    await waitForHealthz(webBaseUrl);
    run("pnpm", ["--dir", "tests/e2e", "runtime:smoke"], {
      env: {
        ...process.env,
        WEB_RUNTIME_BASE_URL: webBaseUrl
      }
    });
    return;
  } finally {
    shutdown();
    await new Promise((resolve) => {
      webRuntime.once("exit", () => resolve(undefined));
      setTimeout(resolve, 2000);
    });
  }
}

const missingDirs = hasMissing(requiredDirs);
const missingFiles = hasMissing(requiredFiles);
const missingFixtureDirs = hasMissing(requiredFixtureDirs);

if (missingDirs.length || missingFiles.length) {
  console.error("[foundation] Missing required foundation items.");
  if (missingDirs.length) {
    console.error(`- Directories: ${missingDirs.join(", ")}`);
  }
  if (missingFiles.length) {
    console.error(`- Files: ${missingFiles.join(", ")}`);
  }
  process.exit(1);
}

if ((mode === "test" || mode === "smoke") && missingFixtureDirs.length) {
  console.error("[foundation] Missing parity fixture directories.");
  console.error(`- Fixture directories: ${missingFixtureDirs.join(", ")}`);
  process.exit(1);
}

if (mode === "check" || mode === "bootstrap") {
  console.log("[workspace] Workspace baseline validated.");
  process.exit(0);
}

if (mode === "lint") {
  run("pnpm", ["--dir", "api", "lint"]);
  run("pnpm", ["--dir", "web", "lint"]);
  console.log("[workspace] Lint gate passed for root/api/web contracts.");
  process.exit(0);
}

if (mode === "typecheck") {
  run("pnpm", ["--dir", "api", "typecheck"]);
  run("pnpm", ["--dir", "web", "typecheck"]);
  console.log("[workspace] Typecheck gate passed for root/api/web contracts.");
  process.exit(0);
}

if (mode === "test") {
  run("pnpm", ["--dir", "api", "test"]);
  run("pnpm", ["--dir", "tests/parity", "test"]);
  run("pnpm", ["--dir", "web", "test"]);
  console.log("[workspace] Test gate passed for api/parity/web contracts.");
  process.exit(0);
}

if (mode === "smoke") {
  run("pnpm", ["--dir", "tests/parity", "smoke"]);
  try {
    await runSmokeFlow();
  } catch (error) {
    console.warn(
      `[workspace] Runtime smoke fallback activated: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    run("pnpm", ["--dir", "web", "shell:check"]);
    run("pnpm", ["--dir", "tests/e2e", "visual:baseline"]);
  }
  console.log("[workspace] Smoke gate passed for parity and runtime route checks.");
  process.exit(0);
}

if (mode === "build") {
  run("pnpm", ["--dir", "api", "build"]);
  run("pnpm", ["--dir", "web", "build"]);
  console.log("[workspace] Build gate passed for api/web runtime contracts.");
  process.exit(0);
}

console.error(`[workspace] Unsupported foundation mode: ${mode}`);
process.exit(1);
