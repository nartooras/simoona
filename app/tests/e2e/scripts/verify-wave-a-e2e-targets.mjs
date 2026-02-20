#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targetsPath = path.join(root, "wave-a/wave-a-e2e-targets.json");
const uiScopePath = path.join(root, "../../docs/parity/waves/wave-a-social-core-ui-scope.csv");

if (!fs.existsSync(targetsPath)) {
  console.error(`[wave-a-e2e] Missing Wave A e2e targets file: ${targetsPath}`);
  process.exit(1);
}

if (!fs.existsSync(uiScopePath)) {
  console.error(`[wave-a-e2e] Missing Wave A UI scope file: ${uiScopePath}`);
  process.exit(1);
}

const targets = JSON.parse(fs.readFileSync(targetsPath, "utf8"));
if (!Array.isArray(targets.targets) || targets.targets.length < 8) {
  console.error("[wave-a-e2e] Wave A e2e target list is incomplete.");
  process.exit(1);
}

const requiredRouteFragments = ["/Wall/Feed", "/Settings/Notifications"];
const routeSet = targets.targets.map((target) => target.route).join(" ");
for (const fragment of requiredRouteFragments) {
  if (!routeSet.includes(fragment)) {
    console.error(`[wave-a-e2e] Missing required Wave A route fragment: ${fragment}`);
    process.exit(1);
  }
}

const targetIds = new Set(targets.targets.map((target) => target.id));
for (const requiredId of [
  "wave-a-wall-members-open",
  "wave-a-wall-search-results",
  "wave-a-post-interactions"
]) {
  if (!targetIds.has(requiredId)) {
    console.error(`[wave-a-e2e] Missing required Wave A target id: ${requiredId}`);
    process.exit(1);
  }
}

if (!Array.isArray(targets.dependencies) || targets.dependencies.length < 2) {
  console.error("[wave-a-e2e] Wave A e2e dependencies are incomplete.");
  process.exit(1);
}

console.log("[wave-a-e2e] Wave A e2e target checks passed.");
