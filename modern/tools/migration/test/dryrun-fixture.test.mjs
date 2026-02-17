import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runDryRun } from "../lib/run-dryrun.mjs";

test("fixture dry-run generates deterministic report artifacts", () => {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "dryrun-v1-"));

  const result = runDryRun({
    inputPath: "modern/tools/migration/fixtures/legacy-export-sample.json",
    outputDir,
    extractedPath: path.join(outputDir, "fixture.extracted.json"),
    transformedPath: path.join(outputDir, "fixture.transformed.json"),
    reportJsonPath: path.join(outputDir, "fixture.report.json"),
    reportMarkdownPath: path.join(outputDir, "fixture.report.md"),
    source: "fixture",
    mode: "dry-run",
  });

  assert.equal(result.validation.isValid, true);
  assert.equal(result.summary.counts.extracted.users, 2);
  assert.equal(result.summary.counts.transformed.usersProfileBasics, 2);

  const reportRaw = fs.readFileSync(result.artifacts.reportJsonPath, "utf8");
  const report = JSON.parse(reportRaw);
  assert.equal(report.validation.isValid, true);
  assert.ok(Array.isArray(report.unmappedFields.users));

  fs.rmSync(outputDir, { recursive: true, force: true });
});
