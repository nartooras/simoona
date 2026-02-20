#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  {
    path: path.join(root, "src/shell/auth-boundary.ts"),
    markers: ["legacyLoginBoundary", "/account/login"]
  },
  {
    path: path.join(root, "src/shell/tenant-route-container.ts"),
    markers: ["legacyTenantRouteContainer", "tenantId"]
  },
  {
    path: path.join(root, "src/shell/top-level-layout.ts"),
    markers: [
      "legacyTopLevelLayout",
      "legacyTopNavFrame",
      "createLegacyShellNavItem",
      "resolveLegacyMotionTokens"
    ]
  },
  {
    path: path.join(root, "src/main.ts"),
    markers: ["bootstrapShell", "resolveTenantRoute"]
  }
];

for (const requirement of requiredFiles) {
  if (!fs.existsSync(requirement.path)) {
    console.error(`[web-shell] Missing file: ${requirement.path}`);
    process.exit(1);
  }

  const source = fs.readFileSync(requirement.path, "utf8");
  for (const marker of requirement.markers) {
    if (!source.includes(marker)) {
      console.error(`[web-shell] Missing marker '${marker}' in ${requirement.path}`);
      process.exit(1);
    }
  }
}

console.log("[web-shell] Shell compatibility foundation checks passed.");
