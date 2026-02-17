import path from "node:path";

import { enforceModeGuard, printDryRunBanner } from "./banner.mjs";
import { extractLegacySnapshot } from "./extract.mjs";
import { transformToModernContracts } from "./transform.mjs";
import { validateDryRunResult } from "./validate.mjs";
import { buildSummaryReport, renderMarkdownReport } from "./report.mjs";
import { resolveFromCwd, writeJsonFile, writeTextFile } from "./io.mjs";

export function runDryRun({ inputPath, outputDir, extractedPath, transformedPath, reportJsonPath, reportMarkdownPath, source, mode }) {
  printDryRunBanner(mode);
  const safeMode = enforceModeGuard(mode);
  const runAtUtc = new Date().toISOString();

  const resolvedInputPath = resolveFromCwd(inputPath);
  const resolvedOutputDir = resolveFromCwd(outputDir);
  const resolvedExtractedPath = resolveFromCwd(extractedPath);
  const resolvedTransformedPath = resolveFromCwd(transformedPath);
  const resolvedReportJsonPath = resolveFromCwd(reportJsonPath);
  const resolvedReportMarkdownPath = resolveFromCwd(reportMarkdownPath);

  const extracted = extractLegacySnapshot({
    inputPath: resolvedInputPath,
    source,
    runAtUtc,
  });

  const transformed = transformToModernContracts(extracted);
  const validation = validateDryRunResult(extracted, transformed);
  const summary = buildSummaryReport({
    runAtUtc,
    source,
    mode: safeMode,
    extracted,
    transformed,
    validation,
  });

  writeJsonFile(resolvedExtractedPath, extracted);
  writeJsonFile(resolvedTransformedPath, transformed);
  writeJsonFile(resolvedReportJsonPath, summary);
  writeTextFile(resolvedReportMarkdownPath, renderMarkdownReport(summary));

  console.log(`Input snapshot: ${resolvedInputPath}`);
  console.log(`Output directory: ${resolvedOutputDir}`);
  console.log(`Extracted artifact: ${resolvedExtractedPath}`);
  console.log(`Transformed artifact: ${resolvedTransformedPath}`);
  console.log(`Report JSON: ${resolvedReportJsonPath}`);
  console.log(`Report Markdown: ${resolvedReportMarkdownPath}`);
  console.log(`Validation status: ${validation.isValid ? "PASS" : "FAIL"}`);

  return {
    extracted,
    transformed,
    validation,
    summary,
    artifacts: {
      extractedPath: resolvedExtractedPath,
      transformedPath: resolvedTransformedPath,
      reportJsonPath: resolvedReportJsonPath,
      reportMarkdownPath: resolvedReportMarkdownPath,
      outputDir: path.resolve(resolvedOutputDir),
    },
  };
}
