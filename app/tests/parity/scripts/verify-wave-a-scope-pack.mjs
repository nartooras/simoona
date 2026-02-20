#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredPaths = {
  apiScope: path.join(root, "../../docs/parity/waves/wave-a-social-core-api-scope.csv"),
  uiScope: path.join(root, "../../docs/parity/waves/wave-a-social-core-ui-scope.csv"),
  scopePackDoc: path.join(root, "../../docs/parity/waves/wave-a-social-core-scope-pack.md"),
  contractTargets: path.join(root, "contracts/wave-a/wave-a-contract-targets.json"),
  realtimeMarkers: path.join(root, "contracts/wave-a/wave-a-realtime-markers.json")
};

for (const [name, filePath] of Object.entries(requiredPaths)) {
  if (!fs.existsSync(filePath)) {
    console.error(`[wave-a-scope] Missing ${name}: ${filePath}`);
    process.exit(1);
  }
}

const apiScopeContent = fs.readFileSync(requiredPaths.apiScope, "utf8");
for (const marker of [
  "Wall/Posts",
  "Wall/Create",
  "Wall/Members",
  "Post/Create",
  "Post/Watch",
  "Comment/Create",
  "Notification/GetAll"
]) {
  if (!apiScopeContent.includes(marker)) {
    console.error(`[wave-a-scope] Missing API marker '${marker}' in Wave A API scope.`);
    process.exit(1);
  }
}

const uiScopeContent = fs.readFileSync(requiredPaths.uiScope, "utf8");
for (const marker of ["/:organizationName/Wall", "/:organizationName/Wall/Feed", "/Notifications"]) {
  if (!uiScopeContent.includes(marker)) {
    console.error(`[wave-a-scope] Missing UI marker '${marker}' in Wave A UI scope.`);
    process.exit(1);
  }
}

const contractTargets = JSON.parse(fs.readFileSync(requiredPaths.contractTargets, "utf8"));
if (!Array.isArray(contractTargets.contractTargets) || contractTargets.contractTargets.length < 5) {
  console.error("[wave-a-scope] Wave A contract target list is incomplete.");
  process.exit(1);
}

if (
  contractTargets.realtimeCompatibility == null ||
  contractTargets.realtimeCompatibility.ownerRole !== "$api-compat-agent" ||
  !Array.isArray(contractTargets.realtimeCompatibility.touchpoints) ||
  contractTargets.realtimeCompatibility.touchpoints.length < 3
) {
  console.error("[wave-a-scope] Wave A realtime compatibility ownership is incomplete.");
  process.exit(1);
}

if (!Array.isArray(contractTargets.dependencies) || contractTargets.dependencies.length < 2) {
  console.error("[wave-a-scope] Wave A dependency list is incomplete.");
  process.exit(1);
}

const realtimeMarkers = JSON.parse(fs.readFileSync(requiredPaths.realtimeMarkers, "utf8"));
if (!Array.isArray(realtimeMarkers.markers) || realtimeMarkers.markers.length < 3) {
  console.error("[wave-a-scope] Wave A realtime marker contract is incomplete.");
  process.exit(1);
}

console.log("[wave-a-scope] Wave A scope pack checks passed.");
