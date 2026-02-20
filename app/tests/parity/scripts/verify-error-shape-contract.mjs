#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baselinePath = path.join(root, "contracts/core/error-shape-baseline.json");
const fixtureMapPath = path.join(root, "contracts/core/error-shape-fixture-map.json");

if (!fs.existsSync(baselinePath) || !fs.existsSync(fixtureMapPath)) {
  console.error("[parity-contract] error-shape contract inputs are missing.");
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const fixtureMap = JSON.parse(fs.readFileSync(fixtureMapPath, "utf8"));

const mapperPath = path.join(root, "../../api/src/modules/core/errors/legacy-error.mapper.ts");
const filterPath = path.join(root, "../../api/src/modules/core/errors/legacy-error.filter.ts");

if (!fs.existsSync(mapperPath) || !fs.existsSync(filterPath)) {
  console.error("[parity-contract] error compatibility source files are missing.");
  process.exit(1);
}

const mapperSource = fs.readFileSync(mapperPath, "utf8");
const filterSource = fs.readFileSync(filterPath, "utf8");

const spec = baseline.genericLegacyError;
const fixturePath = fixtureMap.genericLegacyError;

if (!fixturePath || !fs.existsSync(fixturePath)) {
  console.error("[parity-contract] generic error-shape fixture is missing.");
  process.exit(1);
}

const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
if (fixture.fixtureId !== spec.fixtureId) {
  console.error(
    `[parity-contract] error fixtureId mismatch. expected='${spec.fixtureId}' actual='${fixture.fixtureId}'`
  );
  process.exit(1);
}

for (const code of spec.expectedCodes) {
  if (!mapperSource.includes(code)) {
    console.error(`[parity-contract] expected error code missing in mapper source: ${code}`);
    process.exit(1);
  }
}

if (!filterSource.includes("ExceptionFilter")) {
  console.error("[parity-contract] legacy error filter contract marker missing.");
  process.exit(1);
}

console.log("[parity-contract] Error-shape contract assertions passed.");
