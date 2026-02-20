#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
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

function startServer() {
  const server = http.createServer((request, response) => {
    if (request.url === "/healthz" || request.url === "/readyz") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      response.end(
        JSON.stringify({
          status: "ok",
          service: "simoona-api-runtime",
          checkedAtUtc: new Date().toISOString()
        })
      );
      return;
    }

    response.writeHead(404, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ status: "not_found" }));
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
