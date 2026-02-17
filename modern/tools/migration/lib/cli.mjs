import path from "node:path";

const DEFAULT_OUTPUT_DIR = "modern/tools/migration/output";

export function parseArgs(argv) {
  const args = {
    input: process.env.MIGRATION_INPUT_PATH ?? "modern/tools/migration/fixtures/legacy-export-sample.json",
    outputDir: process.env.MIGRATION_OUTPUT_DIR ?? DEFAULT_OUTPUT_DIR,
    mode: process.env.MIGRATION_MODE ?? "dry-run",
    extractedPath: undefined,
    transformedPath: undefined,
    reportJsonPath: undefined,
    reportMarkdownPath: undefined,
    reportName: "dryrun-v1",
    source: process.env.MIGRATION_SOURCE ?? "legacy-export-json",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }

    const next = argv[index + 1];

    if (token === "--input") {
      args.input = next;
      index += 1;
    } else if (token === "--output-dir") {
      args.outputDir = next;
      index += 1;
    } else if (token === "--mode") {
      args.mode = next;
      index += 1;
    } else if (token === "--source") {
      args.source = next;
      index += 1;
    } else if (token === "--extracted") {
      args.extractedPath = next;
      index += 1;
    } else if (token === "--transformed") {
      args.transformedPath = next;
      index += 1;
    } else if (token === "--report-json") {
      args.reportJsonPath = next;
      index += 1;
    } else if (token === "--report-md") {
      args.reportMarkdownPath = next;
      index += 1;
    } else if (token === "--report-name") {
      args.reportName = next;
      index += 1;
    }
  }

  args.outputDir = path.normalize(args.outputDir);
  args.extractedPath ??= path.join(args.outputDir, `${args.reportName}.extracted.json`);
  args.transformedPath ??= path.join(args.outputDir, `${args.reportName}.transformed.json`);
  args.reportJsonPath ??= path.join(args.outputDir, `${args.reportName}.report.json`);
  args.reportMarkdownPath ??= path.join(args.outputDir, `${args.reportName}.report.md`);

  return args;
}

export function printHelp(command) {
  console.log(`Usage: ${command} [options]`);
  console.log("");
  console.log("Options:");
  console.log("  --input <path>        Legacy export JSON source path");
  console.log("  --output-dir <path>   Output folder for artifacts");
  console.log("  --mode <dry-run|write> Execution mode (default: dry-run)");
  console.log("  --source <name>       Source label for reports");
  console.log("  --report-name <name>  Base file name (default: dryrun-v1)");
  console.log("  --help                Show this help");
}
