#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const e2eRoot = process.cwd();
const appRoot = path.resolve(e2eRoot, "..", "..");
const matrixPath = path.join(appRoot, "docs", "parity", "ui-route-matrix.csv");
const webPort = Number(process.env.WEB_RUNTIME_PORT ?? "5173");
const webBaseUrl = `http://127.0.0.1:${String(webPort)}`;
const reportPath = path.join(e2eRoot, "visual", "routes", "runtime-ui-matrix-report.json");

const viewports = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 1024, height: 1366 },
  { id: "mobile", width: 390, height: 844 }
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseRows() {
  return fs
    .readFileSync(matrixPath, "utf8")
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line) => line.split(","))
    .map((cols, index) => ({
      index,
      routeDomain: cols[0] ?? "",
      legacyState: cols[1] ?? "",
      urlPattern: cols[2] ?? "",
      modernRoute: cols[6] ?? ""
    }));
}

function materializePathFromPattern(row) {
  const state = row.legacyState;
  const pattern = row.urlPattern;

  if (!pattern) {
    if (state === "Root.WithoutOrg") {
      return "/Login";
    }
    return "/";
  }

  const [basePattern, queryPatternRaw = ""] = pattern.split("?");
  let basePath = basePattern
    .replace(/:organizationName/g, "default")
    .replace(/:state/g, "home")
    .replace(/:id/g, "1")
    .replace(/:post/g, "post-1")
    .replace(/:wall/g, "wall-1")
    .replace(/:search/g, "feed")
    .replace(/:([A-Za-z0-9_]+)/g, "sample");

  if (!basePath.startsWith("/")) {
    basePath = `/${basePath}`;
  }

  if (!queryPatternRaw) {
    return basePath;
  }

  const queryTokens = queryPatternRaw
    .split("/?")
    .map((token) => token.trim())
    .filter(Boolean);

  if (!queryTokens.length) {
    return basePath;
  }

  const queryString = queryTokens
    .map((token) => `${encodeURIComponent(token)}=${encodeURIComponent(`${token}-sample`)}`)
    .join("&");

  return `${basePath}?${queryString}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
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

async function waitForHealthz(attempts = 50) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await request("/healthz");
      if (response.statusCode === 200) {
        return;
      }
    } catch {
      // retry while runtime starts
    }
    await sleep(250);
  }

  throw new Error(`Timed out waiting for web runtime at ${webBaseUrl}`);
}

const rows = parseRows();

for (const viewport of viewports) {
  fs.mkdirSync(path.join(e2eRoot, "visual", "routes", viewport.id), { recursive: true });
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

const evidenceReport = {
  generatedAtUtc: new Date().toISOString(),
  baseUrl: webBaseUrl,
  totalRoutes: rows.length,
  routes: []
};

try {
  await waitForHealthz();
  const browser = await chromium.launch({ headless: true });

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();

    // Negative-path assertion for the viewport context.
    await page.goto(`${webBaseUrl}/default/UnknownParityRouteXYZ`, { waitUntil: "networkidle" });
    const unknownPayload = await page.evaluate(() =>
      JSON.parse(document.getElementById("simoona-runtime-data")?.textContent ?? "{}")
    );
    assert(
      unknownPayload.status === "not_found",
      `[runtime-ui-matrix] Expected unknown route to be not_found on ${viewport.id}.`
    );

    for (const row of rows) {
      const routePath = materializePathFromPattern(row);
      await page.goto(`${webBaseUrl}${routePath}`, { waitUntil: "networkidle" });

      const payload = await page.evaluate(() =>
        JSON.parse(document.getElementById("simoona-runtime-data")?.textContent ?? "{}")
      );

      assert(
        payload.status === "ready",
        `[runtime-ui-matrix] ${row.legacyState} (${routePath}) expected status=ready, got ${String(
          payload.status
        )}.`
      );
      assert(
        payload.routeMatch?.isKnownLegacyRoute === true,
        `[runtime-ui-matrix] ${row.legacyState} (${routePath}) expected known legacy route.`
      );

      const screenshotPath = path.join(
        e2eRoot,
        "visual",
        "routes",
        viewport.id,
        `${String(row.index + 1).padStart(3, "0")}-${slugify(row.legacyState || row.modernRoute || "route")}.jpg`
      );

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: "jpeg",
        quality: 65
      });

      evidenceReport.routes.push({
        viewport: viewport.id,
        legacyState: row.legacyState,
        routePath,
        screenshotPath: path.relative(e2eRoot, screenshotPath)
      });
    }

    await context.close();
  }

  await browser.close();
  fs.writeFileSync(reportPath, `${JSON.stringify(evidenceReport, null, 2)}\n`);
  console.log(
    `[runtime-ui-matrix] Runtime UI matrix assertions passed (${String(
      rows.length
    )} routes x ${String(viewports.length)} viewports).`
  );
} finally {
  shutdown();
  await new Promise((resolve) => {
    webRuntime.once("exit", () => resolve(undefined));
    setTimeout(resolve, 2500);
  });
}
