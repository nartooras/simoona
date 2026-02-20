#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const approvalsPath = path.join(root, "visual/wave-a-changed-screen-approvals.json");
const targetsPath = path.join(root, "wave-a/wave-a-e2e-targets.json");
const uiScopePath = path.join(root, "../../docs/parity/waves/wave-a-social-core-ui-scope.csv");

for (const requiredPath of [approvalsPath, targetsPath, uiScopePath]) {
  if (!fs.existsSync(requiredPath)) {
    console.error(`[wave-a-visual] Missing required file: ${requiredPath}`);
    process.exit(1);
  }
}

const approvals = JSON.parse(fs.readFileSync(approvalsPath, "utf8"));
const targets = JSON.parse(fs.readFileSync(targetsPath, "utf8"));
const uiScopeCsv = fs.readFileSync(uiScopePath, "utf8");

if (!Array.isArray(approvals.changedScreens) || approvals.changedScreens.length < 5) {
  console.error("[wave-a-visual] Changed-screen pack is incomplete.");
  process.exit(1);
}

const uiScopeStates = new Set(
  uiScopeCsv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.split(",")[0])
    .filter(Boolean)
);

const targetIds = new Set((targets.targets ?? []).map((target) => target.id));
const coveredTargetIds = new Set();
const allowedStatuses = new Set(["approved", "approved_with_notes", "diff_tracked"]);

for (const screen of approvals.changedScreens) {
  if (!screen.id || !screen.legacyState || !screen.route) {
    console.error("[wave-a-visual] Each changed screen must include id, legacyState, and route.");
    process.exit(1);
  }

  if (!uiScopeStates.has(screen.legacyState)) {
    console.error(`[wave-a-visual] legacyState not found in Wave A UI scope: ${screen.legacyState}`);
    process.exit(1);
  }

  const traceTargets = screen.traceability?.e2eTargets;
  if (!Array.isArray(traceTargets) || traceTargets.length === 0) {
    console.error(`[wave-a-visual] Screen '${screen.id}' must map to at least one Wave A e2e target.`);
    process.exit(1);
  }

  for (const targetId of traceTargets) {
    if (!targetIds.has(targetId)) {
      console.error(`[wave-a-visual] Unknown e2e target id in '${screen.id}': ${targetId}`);
      process.exit(1);
    }

    coveredTargetIds.add(targetId);
  }

  if (!Array.isArray(screen.captures) || screen.captures.length < 3) {
    console.error(`[wave-a-visual] Screen '${screen.id}' must include captures for desktop/tablet/mobile.`);
    process.exit(1);
  }

  const viewportSet = new Set();
  for (const capture of screen.captures) {
    viewportSet.add(capture.viewport);
    if (!capture.artifact || !capture.capturedAtUtc || !capture.approvalStatus) {
      console.error(`[wave-a-visual] Capture in '${screen.id}' is missing required fields.`);
      process.exit(1);
    }

    if (!allowedStatuses.has(capture.approvalStatus)) {
      console.error(`[wave-a-visual] Invalid approval status in '${screen.id}': ${capture.approvalStatus}`);
      process.exit(1);
    }

    if (capture.approvalStatus === "diff_tracked" && !capture.issueRef) {
      console.error(
        `[wave-a-visual] Capture in '${screen.id}' marked diff_tracked must include issueRef.`
      );
      process.exit(1);
    }
  }

  for (const viewport of ["desktop", "tablet", "mobile"]) {
    if (!viewportSet.has(viewport)) {
      console.error(`[wave-a-visual] Screen '${screen.id}' is missing viewport: ${viewport}`);
      process.exit(1);
    }
  }
}

if (coveredTargetIds.size < targetIds.size) {
  const missing = [...targetIds].filter((targetId) => !coveredTargetIds.has(targetId));
  console.error(`[wave-a-visual] Missing changed-screen coverage for target ids: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("[wave-a-visual] Wave A changed-screen approval checks passed.");
