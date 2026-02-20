#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const candidatePaths = [
  path.join(root, "contracts/auth/auth-fixture-map.json"),
  path.join(root, "app/tests/parity/contracts/auth/auth-fixture-map.json")
];

const mapPath = candidatePaths.find((p) => fs.existsSync(p));

if (!mapPath) {
  console.error("[parity-contract] auth fixture map not found.");
  process.exit(1);
}

const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const baselinePath = path.join(path.dirname(mapPath), "auth-contract-baseline.json");
if (!fs.existsSync(baselinePath)) {
  console.error("[parity-contract] auth contract baseline not found.");
  process.exit(1);
}
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

const requiredKeys = Object.keys(baseline);
const missingKeys = requiredKeys.filter((key) => !map[key]);

if (missingKeys.length) {
  console.error(`[parity-contract] Missing required fixture mappings: ${missingKeys.join(", ")}`);
  process.exit(1);
}

const serviceSourceCandidates = [
  path.join(
    root,
    "app/api/src/modules/core/auth/services/auth-compatibility.service.ts"
  ),
  path.join(root, "../../api/src/modules/core/auth/services/auth-compatibility.service.ts")
];
const serviceSourcePath = serviceSourceCandidates.find((p) => fs.existsSync(p));

if (!serviceSourcePath) {
  console.error("[parity-contract] auth compatibility service source not found.");
  process.exit(1);
}

const serviceSource = fs.readFileSync(serviceSourcePath, "utf8");

for (const key of requiredKeys) {
  const fixturePath = map[key];
  if (!fs.existsSync(fixturePath)) {
    console.error(`[parity-contract] Fixture path missing for '${key}': ${fixturePath}`);
    process.exit(1);
  }

  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const expected = baseline[key];

  if (fixture.fixtureId !== expected.fixtureId) {
    console.error(
      `[parity-contract] FixtureId mismatch for '${key}'. expected='${expected.fixtureId}' actual='${fixture.fixtureId}'`
    );
    process.exit(1);
  }

  if (fixture.legacyRoute !== expected.legacyRoute) {
    console.error(
      `[parity-contract] legacyRoute mismatch for '${key}'. expected='${expected.legacyRoute}' actual='${fixture.legacyRoute}'`
    );
    process.exit(1);
  }

  const marker = `compatibility: \"${expected.compatibilityKey}\"`;
  if (!serviceSource.includes(marker)) {
    console.error(
      `[parity-contract] Compatibility marker missing in auth service for '${key}': ${expected.compatibilityKey}`
    );
    process.exit(1);
  }
}

console.log("[parity-contract] Auth contract assertions passed.");
