#!/usr/bin/env node

import http from "node:http";

const baseUrl = process.env.WEB_RUNTIME_BASE_URL ?? "http://127.0.0.1:5173";
const routes = ["/", "/profile", "/Wall/Feed", "/Settings/Notifications"];

function request(pathname) {
  return new Promise((resolve, reject) => {
    const requestUrl = new URL(pathname, baseUrl);
    const req = http.get(requestUrl, (res) => {
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

const health = await request("/healthz");
if (health.statusCode !== 200) {
  console.error(`[runtime-smoke] /healthz returned ${String(health.statusCode)}.`);
  process.exit(1);
}

for (const route of routes) {
  const response = await request(route);
  if (response.statusCode !== 200) {
    console.error(`[runtime-smoke] ${route} returned ${String(response.statusCode)}.`);
    process.exit(1);
  }
  if (!response.body.includes('id="simoona-runtime-data"')) {
    console.error(`[runtime-smoke] ${route} did not include runtime payload marker.`);
    process.exit(1);
  }
  if (!response.body.includes('src="/src/main.tsx"')) {
    console.error(`[runtime-smoke] ${route} did not include runtime client module reference.`);
    process.exit(1);
  }
}

console.log("[runtime-smoke] Runtime route checks passed.");
