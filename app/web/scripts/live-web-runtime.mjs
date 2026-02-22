#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");

const mode = process.argv[2] ?? "dev";
const defaultPort = mode === "preview" ? "4173" : "5173";
const port = String(process.env.WEB_RUNTIME_PORT ?? defaultPort);

function run(command, args) {
  const child = spawn(command, args, {
    cwd: webRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      WEB_RUNTIME_PORT: port
    }
  });

  const shutdown = () => {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  child.on("exit", (code, signal) => {
    process.off("SIGINT", shutdown);
    process.off("SIGTERM", shutdown);
    if (signal) {
      process.exit(0);
      return;
    }

    process.exit(code ?? 1);
  });
}

function runSync(command, args) {
  const result = spawnSync(command, args, {
    cwd: webRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      WEB_RUNTIME_PORT: port
    }
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (mode === "build") {
  runSync("pnpm", ["exec", "vite", "build"]);
  const redirectsPath = path.join(webRoot, "dist", "_redirects");
  fs.writeFileSync(redirectsPath, "/* /index.html 200\n", "utf8");
  console.log(`[web-runtime] Vite build complete, wrote ${redirectsPath}`);
  process.exit(0);
} else if (mode === "preview") {
  run("pnpm", ["exec", "vite", "preview", "--host", "127.0.0.1", "--port", port]);
} else if (mode === "dev") {
  run("pnpm", ["exec", "vite", "--host", "127.0.0.1", "--port", port]);
} else {
  console.error(`[web-runtime] Unsupported mode: ${mode}`);
  process.exit(1);
}
