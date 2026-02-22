#!/usr/bin/env node

import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const parityRoot = process.cwd();
const appRoot = path.resolve(parityRoot, "..", "..");
const apiRuntimeScript = path.join(appRoot, "api", "scripts", "api-runtime-check.mjs");
const port = Number(process.env.API_RUNTIME_PORT ?? "4313");
const baseUrl = `http://127.0.0.1:${String(port)}`;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      // retry until timeout
    }

    await sleep(250);
  }

  throw new Error(`Timed out waiting for auth runtime at ${baseUrl}`);
}

async function runAssertions() {
  const invalidTokenResponse = await request("POST", "/token", {
    username: "legacy.user",
    password: "invalid-password"
  });
  assert(invalidTokenResponse.statusCode === 401, "Invalid credentials should return 401.");
  assert(
    invalidTokenResponse.body.errorCode === "INVALID_CREDENTIALS",
    "Invalid credentials should return INVALID_CREDENTIALS."
  );

  const tokenResponse = await request("POST", "/token", {
    username: "legacy.user",
    password: "legacyPass123"
  });
  assert(tokenResponse.statusCode === 200, "Valid credentials should return 200.");
  assert(tokenResponse.body.compatibility === "/token", "Token compatibility marker mismatch.");
  assert(
    typeof tokenResponse.body.accessToken === "string" && tokenResponse.body.accessToken.length > 10,
    "Token response should include accessToken."
  );

  const accessToken = tokenResponse.body.accessToken;

  const missingAuthUserInfo = await request("GET", "/Account/UserInfo");
  assert(missingAuthUserInfo.statusCode === 401, "UserInfo without auth should return 401.");
  assert(
    missingAuthUserInfo.body.errorCode === "UNAUTHORIZED",
    "UserInfo without auth should return UNAUTHORIZED."
  );

  const unresolvedHeaderUserInfo = await request("GET", "/Account/UserInfo", undefined, {
    "x-legacy-user-id": "unknown-runtime-user"
  });
  assert(
    unresolvedHeaderUserInfo.statusCode === 401,
    "UserInfo with unresolved legacy header user should return 401."
  );

  const userInfoResponse = await request("GET", "/Account/UserInfo", undefined, {
    authorization: `Bearer ${accessToken}`
  });
  assert(userInfoResponse.statusCode === 200, "UserInfo with bearer token should return 200.");
  assert(
    userInfoResponse.body.compatibility === "Account/UserInfo",
    "UserInfo compatibility marker mismatch."
  );
  assert(userInfoResponse.body.user?.id === "legacy-user", "UserInfo should resolve seeded user identity.");

  const wallListResponse = await request("GET", "/Wall/List", undefined, {
    authorization: `Bearer ${accessToken}`
  });
  assert(wallListResponse.statusCode === 200, "Wall/List should allow bearer-authenticated request.");

  const logoutResponse = await request("DELETE", "/Account/Logout", undefined, {
    authorization: `Bearer ${accessToken}`
  });
  assert(logoutResponse.statusCode === 200, "Logout should return 200 for authenticated user.");
  assert(logoutResponse.body.revokedToken === true, "Logout should revoke bearer token.");

  const postLogoutUserInfo = await request("GET", "/Account/UserInfo", undefined, {
    authorization: `Bearer ${accessToken}`
  });
  assert(postLogoutUserInfo.statusCode === 401, "Revoked token should be rejected for UserInfo.");

  console.log("[runtime-auth] Runtime auth lifecycle assertions passed.");
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
  await runAssertions();
} finally {
  shutdown();
  await new Promise((resolve) => {
    runtimeProcess.once("exit", () => resolve(undefined));
    setTimeout(resolve, 2500);
  });
}
