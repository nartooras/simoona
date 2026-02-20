#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const routePackPath = path.join(root, "../docs/parity/ui-shell-route-pack.md");
const tenantContainerPath = path.join(root, "src/shell/tenant-route-container.ts");
const authBoundaryPath = path.join(root, "src/shell/auth-boundary.ts");

if (!fs.existsSync(routePackPath)) {
  console.error(`[web-shell-route-pack] Missing route pack document: ${routePackPath}`);
  process.exit(1);
}

const routePack = fs.readFileSync(routePackPath, "utf8");
for (const marker of [
  "legacy route",
  "/account/login",
  "legacyTenantRouteContainer",
  "legacyLoginBoundary"
]) {
  if (!routePack.includes(marker)) {
    console.error(`[web-shell-route-pack] Missing route-pack marker '${marker}'.`);
    process.exit(1);
  }
}

for (const filePath of [tenantContainerPath, authBoundaryPath]) {
  if (!fs.existsSync(filePath)) {
    console.error(`[web-shell-route-pack] Missing shell source file: ${filePath}`);
    process.exit(1);
  }
}

console.log("[web-shell-route-pack] Shell route parity pack checks passed.");
