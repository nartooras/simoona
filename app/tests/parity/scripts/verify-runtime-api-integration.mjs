#!/usr/bin/env node

import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const parityRoot = process.cwd();
const appRoot = path.resolve(parityRoot, "..", "..");
const apiRuntimeScript = path.join(appRoot, "api", "scripts", "api-runtime-check.mjs");
const port = Number(process.env.API_RUNTIME_PORT ?? "4314");
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

  throw new Error(`Timed out waiting for integration runtime at ${baseUrl}`);
}

async function issueAuthToken() {
  const tokenResponse = await request("POST", "/token", {
    username: "legacy.admin",
    password: "legacyAdmin123",
    grant_type: "password"
  });

  assert(tokenResponse.statusCode === 200, "Expected token issuance for legacy.admin.");
  assert(
    typeof tokenResponse.body.accessToken === "string" && tokenResponse.body.accessToken.length > 10,
    "Token response should include accessToken."
  );
  return tokenResponse.body.accessToken;
}

async function runAssertions() {
  const token = await issueAuthToken();
  const authHeaders = { authorization: `Bearer ${token}` };

  const externalLogins = await request("GET", "/Account/ExternalLogins");
  assert(externalLogins.statusCode === 200, "ExternalLogins should return 200.");
  assert(
    Array.isArray(externalLogins.body.providers) && externalLogins.body.providers.length >= 2,
    "ExternalLogins should include provider list."
  );

  const oauthTimeout = await request("GET", "/Account/ExternalLogins", undefined, {
    "x-simoona-integration-failure": "oauth-timeout"
  });
  assert(oauthTimeout.statusCode === 504, "oauth-timeout should return 504.");
  assert(oauthTimeout.body.errorCode === "INTEGRATION_TIMEOUT", "oauth-timeout errorCode mismatch.");

  const oauthAuthFailure = await request("GET", "/Account/ExternalLogin?provider=Google", undefined, {
    "x-simoona-integration-failure": "oauth-auth-failure"
  });
  assert(oauthAuthFailure.statusCode === 502, "oauth-auth-failure should return 502.");
  assert(
    oauthAuthFailure.body.errorCode === "INTEGRATION_AUTH_FAILURE",
    "oauth-auth-failure errorCode mismatch."
  );

  const sendDailyMails = await request("POST", "/ExternalJobs/SendDailyMails", {}, authHeaders);
  assert(sendDailyMails.statusCode === 200, "SendDailyMails should return 200.");

  const smtpTimeout = await request("POST", "/ExternalJobs/SendDailyMails", {}, {
    ...authHeaders,
    "x-simoona-integration-failure": "smtp-timeout"
  });
  assert(smtpTimeout.statusCode === 504, "smtp-timeout should return 504.");

  const smtpAuthFailure = await request("POST", "/ExternalJobs/SendBirthdaysNotifications", {}, {
    ...authHeaders,
    "x-simoona-integration-failure": "smtp-auth-failure"
  });
  assert(smtpAuthFailure.statusCode === 502, "smtp-auth-failure should return 502.");

  const externalJobsTimeout = await request("POST", "/ExternalJobs/AnonymizeUsers", {}, {
    ...authHeaders,
    "x-simoona-integration-failure": "external-jobs-timeout"
  });
  assert(externalJobsTimeout.statusCode === 504, "external-jobs-timeout should return 504.");

  const externalJobsAuthFailure = await request(
    "POST",
    "/ExternalJobs/ProcessExpiredBlacklistUsers",
    {},
    {
      ...authHeaders,
      "x-simoona-integration-failure": "external-jobs-auth-failure"
    }
  );
  assert(
    externalJobsAuthFailure.statusCode === 502,
    "external-jobs-auth-failure should return 502."
  );

  const pictureTimeout = await request("POST", "/Picture/Upload", { fileName: "avatar.png" }, {
    ...authHeaders,
    "x-simoona-integration-failure": "storage-timeout"
  });
  assert(pictureTimeout.statusCode === 504, "storage-timeout should return 504.");

  const pictureAuthFailure = await request("POST", "/Picture/Upload", { fileName: "avatar.png" }, {
    ...authHeaders,
    "x-simoona-integration-failure": "storage-auth-failure"
  });
  assert(pictureAuthFailure.statusCode === 502, "storage-auth-failure should return 502.");

  const invalidCulture = await request(
    "PUT",
    "/User/GeneralSettings",
    { culture: "xx-XX", timezone: "UTC" },
    authHeaders
  );
  assert(invalidCulture.statusCode === 400, "Invalid culture should return 400.");
  assert(
    invalidCulture.body.errorCode === "INVALID_LOCALIZATION_CULTURE",
    "Invalid culture errorCode mismatch."
  );

  const validLocalizationUpdate = await request(
    "PUT",
    "/User/GeneralSettings",
    { culture: "lt-LT", timezone: "Europe/Vilnius" },
    authHeaders
  );
  assert(validLocalizationUpdate.statusCode === 200, "Localization update should return 200.");
  assert(
    validLocalizationUpdate.body.settings?.culture === "lt-LT",
    "Localization update should persist culture."
  );

  const localizationTimeout = await request("GET", "/User/GeneralSettings", undefined, {
    ...authHeaders,
    "x-simoona-integration-failure": "localization-timeout"
  });
  assert(localizationTimeout.statusCode === 504, "localization-timeout should return 504.");

  const localizationSettings = await request("GET", "/User/GeneralSettings", undefined, authHeaders);
  assert(localizationSettings.statusCode === 200, "Localization settings should return 200.");
  assert(
    localizationSettings.body.settings?.culture === "lt-LT",
    "Localization settings should reflect persisted culture."
  );

  console.log("[runtime-api-integration] Integration failure-path runtime assertions passed.");
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
