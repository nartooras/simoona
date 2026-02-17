#!/usr/bin/env node

import { parseArgs, printHelp } from "../lib/cli.mjs";
import { enforceModeGuard, printDryRunBanner } from "../lib/banner.mjs";
import { extractLegacySnapshot } from "../lib/extract.mjs";
import { resolveFromCwd, writeJsonFile } from "../lib/io.mjs";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp("node modern/tools/migration/scripts/extract.mjs");
  process.exit(0);
}

try {
  printDryRunBanner(args.mode);
  const mode = enforceModeGuard(args.mode);
  const runAtUtc = new Date().toISOString();
  const extracted = extractLegacySnapshot({
    inputPath: resolveFromCwd(args.input),
    source: args.source,
    runAtUtc,
  });
  writeJsonFile(resolveFromCwd(args.extractedPath), extracted);
  console.log(`Mode: ${mode}`);
  console.log(`Extracted artifact: ${resolveFromCwd(args.extractedPath)}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
