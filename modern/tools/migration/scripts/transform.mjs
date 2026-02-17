#!/usr/bin/env node

import { parseArgs, printHelp } from "../lib/cli.mjs";
import { enforceModeGuard, printDryRunBanner } from "../lib/banner.mjs";
import { readJsonFile, resolveFromCwd, writeJsonFile } from "../lib/io.mjs";
import { transformToModernContracts } from "../lib/transform.mjs";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp("node modern/tools/migration/scripts/transform.mjs");
  process.exit(0);
}

try {
  printDryRunBanner(args.mode);
  const mode = enforceModeGuard(args.mode);
  const extracted = readJsonFile(resolveFromCwd(args.extractedPath));
  const transformed = transformToModernContracts(extracted);
  writeJsonFile(resolveFromCwd(args.transformedPath), transformed);
  console.log(`Mode: ${mode}`);
  console.log(`Transformed artifact: ${resolveFromCwd(args.transformedPath)}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
