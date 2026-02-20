#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baselinePath = path.join(root, "contracts/ui/ui-route-baseline.json");
const matrixPath = path.join(root, "../../docs/parity/ui-route-matrix.csv");
const routePackPath = path.join(root, "../../docs/parity/ui-shell-route-pack.md");
const catchupResolverPath = path.join(root, "../../web/src/shell/legacy-route-catchup.ts");

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const matrixCsv = fs.readFileSync(matrixPath, "utf8");
const routePack = fs.readFileSync(routePackPath, "utf8");
const catchupResolver = fs.readFileSync(catchupResolverPath, "utf8");

const lines = matrixCsv
  .split(/\r?\n/)
  .slice(1)
  .filter(Boolean);

if (lines.length !== baseline.totalRoutes) {
  console.error(
    `[parity-ui-contract] Expected ${baseline.totalRoutes} UI routes, found ${lines.length}.`
  );
  process.exit(1);
}

let verifiedCount = 0;
for (const line of lines) {
  const cols = line.split(",");
  const status = cols[8]?.trim() ?? "";
  const modernRoute = cols[6]?.trim() ?? "";
  const modernComponent = cols[7]?.trim() ?? "";

  if (status === baseline.requiredStatus) {
    verifiedCount += 1;
  }

  if (!modernRoute || modernRoute === "TBD") {
    console.error(`[parity-ui-contract] Missing modern route mapping in row: ${line}`);
    process.exit(1);
  }

  if (!modernComponent || modernComponent === "TBD") {
    console.error(`[parity-ui-contract] Missing modern component mapping in row: ${line}`);
    process.exit(1);
  }
}

if (verifiedCount !== baseline.totalRoutes) {
  console.error(
    `[parity-ui-contract] Expected ${baseline.totalRoutes} verified routes, found ${verifiedCount}.`
  );
  process.exit(1);
}

for (const marker of baseline.requiredMarkers) {
  const markerExists = routePack.includes(marker) || catchupResolver.includes(marker);
  if (!markerExists) {
    console.error(`[parity-ui-contract] Missing required UI marker '${marker}'.`);
    process.exit(1);
  }
}

console.log(
  `[parity-ui-contract] UI route implementation contract passed (${verifiedCount}/${baseline.totalRoutes} verified).`
);
