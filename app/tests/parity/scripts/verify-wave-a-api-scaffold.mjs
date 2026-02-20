#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baselinePath = path.join(root, "contracts/wave-a/wave-a-api-scaffold-baseline.json");

if (!fs.existsSync(baselinePath)) {
  console.error(`[wave-a-api] Missing baseline: ${baselinePath}`);
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const controllersDir = path.join(root, "../../api/src/modules/core/social/controllers");
const servicePath = path.join(root, "../../api/src/modules/core/social/services/social-compatibility.service.ts");

if (!fs.existsSync(servicePath)) {
  console.error(`[wave-a-api] Missing social compatibility service: ${servicePath}`);
  process.exit(1);
}

const serviceSource = fs.readFileSync(servicePath, "utf8");

for (const [sliceName, slice] of Object.entries(baseline)) {
  const controllerPath = path.join(controllersDir, slice.controllerFile);
  if (!fs.existsSync(controllerPath)) {
    console.error(`[wave-a-api] Missing controller for '${sliceName}': ${controllerPath}`);
    process.exit(1);
  }

  const controllerSource = fs.readFileSync(controllerPath, "utf8");

  for (const routeMarker of slice.requiredRoutes) {
    if (!serviceSource.includes(`compatibility: "${routeMarker}"`)) {
      console.error(
        `[wave-a-api] Missing compatibility marker '${routeMarker}' in social service source.`
      );
      process.exit(1);
    }
  }

  for (const handlerName of slice.requiredHandlers) {
    if (!controllerSource.includes(handlerName) && !serviceSource.includes(`async ${handlerName}`)) {
      console.error(
        `[wave-a-api] Missing handler marker '${handlerName}' for slice '${sliceName}'.`
      );
      process.exit(1);
    }
  }
}

console.log("[wave-a-api] Wave A API scaffold checks passed.");
