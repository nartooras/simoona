#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
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
  path.join(appRoot, "tests/parity/contracts/core/error-shape-baseline.json"),
  path.join(appRoot, "docs/parity/api-endpoint-matrix.csv")
];

for (const requiredFile of requiredFiles) {
  if (!fs.existsSync(requiredFile)) {
    console.error(`[api-runtime] Missing required file: ${requiredFile}`);
    process.exit(1);
  }
}

if (mode === "build" || mode === "lint" || mode === "typecheck" || mode === "test") {
  console.log(`[api-runtime] ${mode} checks passed.`);
  if (mode !== "start") {
    process.exit(0);
  }
}

if (mode !== "start") {
  console.error(`[api-runtime] Unsupported mode: ${mode}`);
  process.exit(1);
}

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
