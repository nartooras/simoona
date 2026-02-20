#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const fixtureMapPath = path.join(root, "contracts/wave-a/wave-a-realtime-fixture-map.json");

if (!fs.existsSync(fixtureMapPath)) {
  console.error(`[wave-a-realtime] Missing realtime fixture map: ${fixtureMapPath}`);
  process.exit(1);
}

const fixtureMap = JSON.parse(fs.readFileSync(fixtureMapPath, "utf8"));
const markersPath = fixtureMap.markersFile;
const fixturePackPath = fixtureMap.fixturePackFile;

for (const [name, targetPath] of Object.entries({
  markersPath,
  fixturePackPath
})) {
  if (typeof targetPath !== "string" || !targetPath.length || !fs.existsSync(targetPath)) {
    console.error(`[wave-a-realtime] Invalid ${name}: ${targetPath}`);
    process.exit(1);
  }
}

const markersContract = JSON.parse(fs.readFileSync(markersPath, "utf8"));
const fixturePack = JSON.parse(fs.readFileSync(fixturePackPath, "utf8"));

if (!Array.isArray(markersContract.markers) || markersContract.markers.length < 3) {
  console.error("[wave-a-realtime] Marker contract is incomplete.");
  process.exit(1);
}

if (!Array.isArray(fixturePack.fixtures) || fixturePack.fixtures.length < 3) {
  console.error("[wave-a-realtime] Fixture pack is incomplete.");
  process.exit(1);
}

const markerIds = new Set(markersContract.markers.map((marker) => marker.id));
const fixtureIds = new Set(fixturePack.fixtures.map((fixture) => fixture.id));

for (const markerId of markerIds) {
  if (!fixtureIds.has(markerId)) {
    console.error(`[wave-a-realtime] Missing fixture for marker id: ${markerId}`);
    process.exit(1);
  }
}

for (const fixture of fixturePack.fixtures) {
  if (!markerIds.has(fixture.id)) {
    console.error(`[wave-a-realtime] Fixture id does not match known marker: ${fixture.id}`);
    process.exit(1);
  }

  if (fixture.payload == null || typeof fixture.payload !== "object") {
    console.error(`[wave-a-realtime] Fixture payload must be object for id: ${fixture.id}`);
    process.exit(1);
  }
}

const requiredTouchpoints = fixtureMap.requiredTouchpoints ?? [];
for (const touchpoint of requiredTouchpoints) {
  const hasFixture = fixturePack.fixtures.some((fixture) => fixture.touchpoint === touchpoint);
  if (!hasFixture) {
    console.error(`[wave-a-realtime] Missing fixture coverage for touchpoint: ${touchpoint}`);
    process.exit(1);
  }
}

console.log("[wave-a-realtime] Wave A realtime fixture checks passed.");
