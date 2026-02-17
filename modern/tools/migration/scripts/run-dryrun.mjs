#!/usr/bin/env node

import { parseArgs, printHelp } from "../lib/cli.mjs";
import { runDryRun } from "../lib/run-dryrun.mjs";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp("node modern/tools/migration/scripts/run-dryrun.mjs");
  process.exit(0);
}

try {
  const result = runDryRun(args);
  if (!result.validation.isValid) {
    process.exitCode = 1;
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
