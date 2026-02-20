#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baselinePath = path.join(root, "contracts/core/catchup-route-baseline.json");
const controllerPath = path.join(root, "../../api/src/modules/core/catchup/controllers/legacy-catchup-compatibility.controller.ts");
const modulePath = path.join(root, "../../api/src/modules/core/catchup/catchup-compatibility.module.ts");

if (!fs.existsSync(baselinePath) || !fs.existsSync(controllerPath) || !fs.existsSync(modulePath)) {
  console.error("[parity-contract] catchup compatibility inputs are missing.");
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const controllerSource = fs.readFileSync(controllerPath, "utf8");
const moduleSource = fs.readFileSync(modulePath, "utf8");

if (!moduleSource.includes("LegacyCatchupCompatibilityController")) {
  console.error("[parity-contract] catchup module missing controller registration.");
  process.exit(1);
}

for (const item of baseline.routes) {
  if (!controllerSource.includes(`compatibility: \"${item.compatibility}\"`)) {
    console.error(`[parity-contract] catchup compatibility marker missing for ${item.compatibility}`);
    process.exit(1);
  }
}

console.log("[parity-contract] Catchup implementation contract assertions passed.");
