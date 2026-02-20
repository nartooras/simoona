#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "visual/baseline-manifest.json");
const workflowDocPath = path.join(root, "docs/visual-regression-workflow.md");

if (!fs.existsSync(manifestPath)) {
  console.error(`[visual-baseline] Missing manifest: ${manifestPath}`);
  process.exit(1);
}

if (!fs.existsSync(workflowDocPath)) {
  console.error(`[visual-baseline] Missing workflow doc: ${workflowDocPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (!Array.isArray(manifest.scenarios) || manifest.scenarios.length < 3) {
  console.error("[visual-baseline] Manifest must include at least 3 viewport scenarios.");
  process.exit(1);
}

const requiredViewports = new Set(["desktop", "tablet", "mobile"]);
for (const scenario of manifest.scenarios) {
  requiredViewports.delete(scenario.viewport);
  if (!scenario.snapshotPath || !scenario.path) {
    console.error(`[visual-baseline] Scenario '${scenario.id}' is missing required fields.`);
    process.exit(1);
  }
}

if (requiredViewports.size) {
  console.error(
    `[visual-baseline] Missing required viewports: ${Array.from(requiredViewports).join(", ")}`
  );
  process.exit(1);
}

console.log("[visual-baseline] Visual regression baseline checks passed.");
