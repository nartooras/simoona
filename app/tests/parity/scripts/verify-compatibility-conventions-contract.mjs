#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baselinePath = path.join(root, "contracts/core/compatibility-conventions-baseline.json");
const fixtureMapPath = path.join(root, "contracts/core/compatibility-conventions-fixture-map.json");

if (!fs.existsSync(baselinePath) || !fs.existsSync(fixtureMapPath)) {
  console.error("[parity-contract] compatibility conventions contract inputs are missing.");
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const fixtureMap = JSON.parse(fs.readFileSync(fixtureMapPath, "utf8"));

const sourcePathByKey = {
  paginationConvention: path.join(
    root,
    "../../api/src/modules/core/conventions/legacy-pagination.middleware.ts"
  ),
  responseEnvelopeConvention: path.join(
    root,
    "../../api/src/modules/core/conventions/legacy-response-envelope.interceptor.ts"
  ),
  dateSerializationConvention: path.join(
    root,
    "../../api/src/modules/core/conventions/legacy-date-serialization.interceptor.ts"
  )
};

for (const [key, spec] of Object.entries(baseline)) {
  const fixturePath = fixtureMap[key];
  if (!fixturePath || !fs.existsSync(fixturePath)) {
    console.error(`[parity-contract] Missing conventions fixture for '${key}'.`);
    process.exit(1);
  }

  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  if (fixture.fixtureId !== spec.fixtureId) {
    console.error(
      `[parity-contract] conventions fixtureId mismatch for '${key}'. expected='${spec.fixtureId}' actual='${fixture.fixtureId}'`
    );
    process.exit(1);
  }

  const sourcePath = sourcePathByKey[key];
  if (!sourcePath || !fs.existsSync(sourcePath)) {
    console.error(`[parity-contract] conventions source file missing for '${key}'.`);
    process.exit(1);
  }

  const source = fs.readFileSync(sourcePath, "utf8");
  if (!source.includes(spec.sourceMarker)) {
    console.error(
      `[parity-contract] conventions marker missing in '${spec.sourceFile}': ${spec.sourceMarker}`
    );
    process.exit(1);
  }
}

console.log("[parity-contract] Compatibility conventions contract assertions passed.");
