#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const baselinePath = path.join(root, "contracts/core/tenant-permission-baseline.json");
const fixtureMapPath = path.join(root, "contracts/core/tenant-permission-fixture-map.json");

if (!fs.existsSync(baselinePath) || !fs.existsSync(fixtureMapPath)) {
  console.error("[parity-contract] tenant/permission contract inputs are missing.");
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const fixtureMap = JSON.parse(fs.readFileSync(fixtureMapPath, "utf8"));

const middlewareSourcePath = path.join(
  root,
  "../../api/src/modules/core/tenant/tenant-context.middleware.ts"
);
const guardSourcePath = path.join(
  root,
  "../../api/src/modules/core/permissions/legacy-permission.guard.ts"
);

if (!fs.existsSync(middlewareSourcePath) || !fs.existsSync(guardSourcePath)) {
  console.error("[parity-contract] tenant/permission source files are missing.");
  process.exit(1);
}

const middlewareSource = fs.readFileSync(middlewareSourcePath, "utf8");
const guardSource = fs.readFileSync(guardSourcePath, "utf8");

for (const [key, spec] of Object.entries(baseline)) {
  const fixturePath = fixtureMap[key];
  if (!fixturePath || !fs.existsSync(fixturePath)) {
    console.error(`[parity-contract] Missing fixture for '${key}'.`);
    process.exit(1);
  }

  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  if (fixture.fixtureId !== spec.fixtureId) {
    console.error(
      `[parity-contract] fixtureId mismatch for '${key}'. expected='${spec.fixtureId}' actual='${fixture.fixtureId}'`
    );
    process.exit(1);
  }
}

if (!middlewareSource.includes(baseline.tenantContextHeader.sourceMarker)) {
  console.error("[parity-contract] Tenant context marker missing in middleware source.");
  process.exit(1);
}

if (!guardSource.includes(baseline.permissionGuardContext.sourceMarker)) {
  console.error("[parity-contract] Permission marker missing in guard source.");
  process.exit(1);
}

console.log("[parity-contract] Tenant/permission contract assertions passed.");
