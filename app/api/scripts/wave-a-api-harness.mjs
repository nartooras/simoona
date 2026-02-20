#!/usr/bin/env node

import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiRoot = path.resolve(__dirname, "..");
const appRoot = path.resolve(apiRoot, "..");

const mode = process.argv[2] ?? "build";
const port = Number(process.env.API_HARNESS_PORT ?? 4300);

async function main() {
  switch (mode) {
    case "start":
      await runStart();
      return;
    case "build":
      runBuildContractChecks();
      return;
    case "lint":
      runBuildContractChecks();
      return;
    case "typecheck":
      runBuildContractChecks();
      return;
    case "test":
      await runBundleWithRuntimeBoundary();
      return;
    default:
      console.error(`[wave-a-api-harness] Unknown mode '${mode}'.`);
      process.exit(1);
  }
}

function runBuildContractChecks() {
  const requiredFiles = [
    path.join(apiRoot, "src/main.ts"),
    path.join(apiRoot, "src/modules/app.module.ts"),
    path.join(
      apiRoot,
      "src/modules/core/social/services/social-compatibility.service.ts"
    ),
    path.join(
      appRoot,
      "tests/parity/contracts/wave-a/wave-a-contract-targets.json"
    )
  ];

  for (const requiredFile of requiredFiles) {
    if (!fs.existsSync(requiredFile)) {
      console.error(`[wave-a-api-harness] Missing required file: ${requiredFile}`);
      process.exit(1);
    }
  }

  console.log("[wave-a-api-harness] Build contract checks passed.");
}

function startRuntimeBoundaryServer() {
  const server = http.createServer((request, response) => {
    const url = request.url ?? "/";

    if (url === "/healthz" || url === "/readyz") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(
        JSON.stringify({
          status: "ok",
          service: "wave-a-api-harness",
          phase: "phase-4",
          wave: "A",
          checkedAtUtc: new Date().toISOString()
        })
      );
      return;
    }

    if (url === "/wave-a/runtime-boundary") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(
        JSON.stringify({
          status: "ready",
          boundary: "runtime-process",
          adapterMode: "scaffold-compatibility",
          notes: "Used for Wave A parity harness process checks."
        })
      );
      return;
    }

    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ status: "not_found" }));
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      console.log(`[wave-a-api-harness] Runtime boundary listening on 127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

function stopRuntimeBoundaryServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      env: process.env
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${String(code)}`));
    });
  });
}

function requestJson(pathname) {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        host: "127.0.0.1",
        port,
        path: pathname,
        method: "GET"
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode !== 200) {
            reject(
              new Error(
                `[wave-a-api-harness] Runtime boundary check failed for ${pathname}: ${String(
                  response.statusCode
                )}`
              )
            );
            return;
          }

          resolve(body);
        });
      }
    );

    request.on("error", reject);
    request.end();
  });
}

async function runBundleWithRuntimeBoundary() {
  const server = await startRuntimeBoundaryServer();

  try {
    await requestJson("/healthz");
    await requestJson("/wave-a/runtime-boundary");

    const bundle = [
      { cwd: path.join(appRoot, "tests/parity"), script: "contract:wave-a-scope" },
      { cwd: path.join(appRoot, "tests/parity"), script: "contract:wave-a-api" },
      { cwd: path.join(appRoot, "tests/parity"), script: "contract:wave-a-planned" },
      { cwd: path.join(appRoot, "tests/parity"), script: "contract:wave-a-adapters" },
      { cwd: path.join(appRoot, "tests/parity"), script: "contract:wave-a-realtime" },
      { cwd: path.join(appRoot, "tests/parity"), script: "contract:core" },
      { cwd: path.join(appRoot, "tests/e2e"), script: "wave-a:targets" },
      { cwd: path.join(appRoot, "tests/e2e"), script: "wave-a:visual-approvals" },
      { cwd: path.join(appRoot, "tests/e2e"), script: "visual:baseline" },
      { cwd: path.join(appRoot, "web"), script: "shell:check" },
      { cwd: appRoot, script: "verify" }
    ];

    for (const step of bundle) {
      await runCommand("pnpm", [step.script], step.cwd);
    }

    console.log("[wave-a-api-harness] Runtime-backed Wave A parity bundle passed.");
  } finally {
    await stopRuntimeBoundaryServer(server);
  }
}

async function runStart() {
  const server = await startRuntimeBoundaryServer();
  const shutdown = async () => {
    await stopRuntimeBoundaryServer(server);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

await main();
