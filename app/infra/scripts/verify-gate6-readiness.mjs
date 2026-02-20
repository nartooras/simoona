#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const strict = process.argv.includes("--strict");
const root = process.cwd();

const contractPath = path.join(root, "infra/contracts/migration-dry-run-contract.json");
const snapshotPath = path.join(root, "infra/contracts/migration-snapshot-baseline.json");

if (!fs.existsSync(contractPath) || !fs.existsSync(snapshotPath)) {
  console.error("[gate6] Missing migration contract or snapshot baseline.");
  process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));

const requiredFiles = Object.values(contract.requiredEvidence).map((file) => path.join(root, file));
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));

const run1Path = path.join(root, "docs/orchestration/evidence/dry-run-001-integrity-report.json");
const run2Path = path.join(root, "docs/orchestration/evidence/dry-run-002-integrity-report.json");
const rollbackPath = path.join(root, "docs/orchestration/evidence/rollback-rehearsal-001.json");

const missingJson = [run1Path, run2Path, rollbackPath].filter((file) => !fs.existsSync(file));

let dryRunStatusPass = false;
let integrityPass = false;
let rollbackPass = false;
let durationPass = false;

if (missingJson.length === 0) {
  const run1 = JSON.parse(fs.readFileSync(run1Path, "utf8"));
  const run2 = JSON.parse(fs.readFileSync(run2Path, "utf8"));
  const rollback = JSON.parse(fs.readFileSync(rollbackPath, "utf8"));

  dryRunStatusPass = run1.status === "SUCCESS" && run2.status === "SUCCESS";
  integrityPass =
    run1.rowCountPass &&
    run1.referentialPass &&
    run1.criticalPass &&
    run1.filePass &&
    run2.rowCountPass &&
    run2.referentialPass &&
    run2.criticalPass &&
    run2.filePass &&
    run2.idempotencyPass;
  rollbackPass = rollback.status === "SUCCESS";
  durationPass = snapshot.projectedFullRunDurationMinutes <= contract.weekendWindowMinutes;
}

const checks = [
  {
    id: "required-evidence-files",
    pass: missingFiles.length === 0,
    notes: missingFiles.length === 0 ? "all present" : missingFiles.join(", ")
  },
  {
    id: "required-json-artifacts",
    pass: missingJson.length === 0,
    notes: missingJson.length === 0 ? "all present" : missingJson.join(", ")
  },
  {
    id: "two-dry-runs-success",
    pass: dryRunStatusPass,
    notes: dryRunStatusPass ? "dry-run-001 and dry-run-002 are SUCCESS" : "missing or failed dry-run reports"
  },
  {
    id: "integrity-checks-pass",
    pass: integrityPass,
    notes: integrityPass ? "row/ref/domain/file checks are green" : "integrity mismatch or idempotency failure"
  },
  {
    id: "rollback-rehearsal-pass",
    pass: rollbackPass,
    notes: rollbackPass ? "rollback rehearsal status is SUCCESS" : "rollback rehearsal missing or failed"
  },
  {
    id: "weekend-window-fit",
    pass: durationPass,
    notes: durationPass
      ? `projected=${snapshot.projectedFullRunDurationMinutes}m <= window=${contract.weekendWindowMinutes}m`
      : `projected=${snapshot.projectedFullRunDurationMinutes}m > window=${contract.weekendWindowMinutes}m`
  }
];

for (const check of checks) {
  console.log(`[gate6] ${check.id} status=${check.pass ? "pass" : "fail"} notes=${check.notes}`);
}

const failing = checks.filter((check) => !check.pass);
if (strict && failing.length > 0) {
  console.error(`[gate6] STRICT precheck failed: ${failing.map((check) => check.id).join(", ")}`);
  process.exit(1);
}

if (failing.length > 0) {
  console.log(`[gate6] Precheck complete with blockers: ${failing.map((check) => check.id).join(", ")}`);
  process.exit(0);
}

console.log("[gate6] Gate 6 precheck is GREEN.");
