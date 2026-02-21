#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const parityRoot = process.cwd();
const appRoot = path.resolve(parityRoot, "..", "..");
const apiRuntimeScript = path.join(appRoot, "api", "scripts", "api-runtime-check.mjs");
const matrixPath = path.join(appRoot, "docs", "parity", "api-endpoint-matrix.csv");
const port = Number(process.env.API_RUNTIME_PORT ?? "4311");
const baseUrl = `http://127.0.0.1:${String(port)}`;
const authHeaders = { "x-legacy-user-id": "qa-matrix-user" };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseCsvRows(csvText) {
  return csvText
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line) => line.split(","))
    .map((cols) => ({
      method: (cols[3] ?? "GET").trim().toUpperCase(),
      routeTemplate: (cols[4] ?? "").trim(),
      authRequired: (cols[5] ?? "").trim() === "true"
    }));
}

function buildRoutePath(routeTemplate) {
  let pathName = routeTemplate.replace(/\{[^/{}]+\}/g, "1");
  if (!pathName.startsWith("/")) {
    pathName = `/${pathName}`;
  }

  if (routeTemplate === "Wall/Posts") {
    return `${pathName}?wallId=wall-1`;
  }

  return pathName;
}

function buildRequestBody(routeTemplate, method) {
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return undefined;
  }

  if (routeTemplate === "Post/Create") {
    return { wallId: "wall-1", text: "Matrix runtime post payload." };
  }

  if (routeTemplate === "Comment/Create") {
    return { postId: "post-1", text: "Matrix runtime comment payload." };
  }

  return {
    source: "runtime-api-matrix",
    routeTemplate
  };
}

function resolveHttpMethod(method) {
  if (method === "ANY") {
    return "POST";
  }

  return method;
}

function request(method, routePath, body = undefined, headers = {}) {
  return new Promise((resolve, reject) => {
    const requestUrl = new URL(routePath, baseUrl);
    const payload = body ? JSON.stringify(body) : "";
    const req = http.request(
      requestUrl,
      {
        method,
        headers: {
          accept: "application/json",
          ...(payload
            ? {
                "content-type": "application/json",
                "content-length": Buffer.byteLength(payload)
              }
            : {}),
          ...headers
        }
      },
      (res) => {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          let parsedBody = {};
          try {
            parsedBody = raw ? JSON.parse(raw) : {};
          } catch {
            parsedBody = { raw };
          }
          resolve({
            statusCode: res.statusCode ?? 0,
            body: parsedBody
          });
        });
      }
    );

    req.on("error", reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function waitForHealthz(attempts = 50) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await request("GET", "/healthz");
      if (response.statusCode === 200) {
        return;
      }
    } catch {
      // retry
    }
    await sleep(250);
  }

  throw new Error(`Timed out waiting for API runtime at ${baseUrl}`);
}

async function runMatrixAssertions() {
  const rows = parseCsvRows(fs.readFileSync(matrixPath, "utf8"));
  const failures = [];
  let authNegativeChecks = 0;

  for (const row of rows) {
    const method = resolveHttpMethod(row.method);
    const routePath = buildRoutePath(row.routeTemplate);
    const requestBody = buildRequestBody(row.routeTemplate, method);

    if (row.authRequired) {
      authNegativeChecks += 1;
      const unauthorized = await request(method, routePath, requestBody);
      if (unauthorized.statusCode !== 401 || unauthorized.body.errorCode !== "UNAUTHORIZED") {
        failures.push(
          `[unauthorized] ${row.method} ${row.routeTemplate} expected 401/UNAUTHORIZED, got ${String(
            unauthorized.statusCode
          )}/${String(unauthorized.body.errorCode ?? "no-error-code")}`
        );
      }
    }

    const authorized = await request(method, routePath, requestBody, authHeaders);
    if (authorized.statusCode !== 200) {
      failures.push(
        `[authorized] ${row.method} ${row.routeTemplate} expected 200, got ${String(
          authorized.statusCode
        )}`
      );
      continue;
    }

    if (method !== "HEAD") {
      const expectedCompatibility = row.routeTemplate;
      if (authorized.body.compatibility !== expectedCompatibility) {
        failures.push(
          `[compatibility] ${row.method} ${row.routeTemplate} expected compatibility='${expectedCompatibility}', got '${String(
            authorized.body.compatibility ?? ""
          )}'`
        );
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `[runtime-api-matrix] ${String(failures.length)} assertions failed.\n${failures.join("\n")}`
    );
  }

  console.log(
    `[runtime-api-matrix] Runtime matrix assertions passed (${String(
      rows.length
    )} endpoints, ${String(authNegativeChecks)} auth-negative checks).`
  );
}

const runtimeProcess = spawn("node", [apiRuntimeScript, "start"], {
  cwd: appRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    API_RUNTIME_PORT: String(port)
  }
});

const shutdown = () => {
  if (!runtimeProcess.killed) {
    runtimeProcess.kill("SIGTERM");
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

try {
  await waitForHealthz();
  await runMatrixAssertions();
} finally {
  shutdown();
  await new Promise((resolve) => {
    runtimeProcess.once("exit", () => resolve(undefined));
    setTimeout(resolve, 2500);
  });
}
