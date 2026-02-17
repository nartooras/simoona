#!/usr/bin/env node

import { parseArgs, printHelp } from "../lib/cli.mjs";
import { enforceModeGuard, printDryRunBanner } from "../lib/banner.mjs";
import { readJsonFile, resolveFromCwd, writeJsonFile, writeTextFile } from "../lib/io.mjs";
import { validateDryRunResult } from "../lib/validate.mjs";
import { buildSummaryReport, renderMarkdownReport } from "../lib/report.mjs";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp("node modern/tools/migration/scripts/validate.mjs");
  process.exit(0);
}

try {
  printDryRunBanner(args.mode);
  const mode = enforceModeGuard(args.mode);
  const runAtUtc = new Date().toISOString();
  const extracted = readJsonFile(resolveFromCwd(args.extractedPath));
  const transformed = readJsonFile(resolveFromCwd(args.transformedPath));
  const validation = validateDryRunResult(extracted, transformed);
  const summary = buildSummaryReport({
    runAtUtc,
    source: args.source,
    mode,
    extracted,
    transformed,
    validation,
  });

  writeJsonFile(resolveFromCwd(args.reportJsonPath), summary);
  writeTextFile(resolveFromCwd(args.reportMarkdownPath), renderMarkdownReport(summary));

  console.log(`Report JSON: ${resolveFromCwd(args.reportJsonPath)}`);
  console.log(`Report Markdown: ${resolveFromCwd(args.reportMarkdownPath)}`);
  console.log(`Validation status: ${validation.isValid ? "PASS" : "FAIL"}`);

  if (!validation.isValid) {
    process.exitCode = 1;
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
