#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const mode = process.argv[2] ?? "check";
const root = process.cwd();

const requiredDirs = [
  "web",
  "api",
  "packages/contracts",
  "packages/ui",
  "packages/config",
  "tests/e2e",
  "tests/parity",
  "infra/docker",
  "infra/ci",
  "docs/foundation"
];

const requiredFiles = [
  "package.json",
  "pnpm-workspace.yaml",
  "docs/foundation/command-contract.md",
  "docs/foundation/local-bootstrap.md",
  "infra/docker/docker-compose.yml",
  "infra/ci/pipeline-contract.md"
];

const requiredFixtureDirs = [
  "tests/parity/fixtures/auth",
  "tests/parity/fixtures/wall",
  "tests/parity/fixtures/profile",
  "tests/parity/fixtures/admin",
  "tests/parity/fixtures/premium"
];

function hasMissing(items) {
  return items.filter((item) => !fs.existsSync(path.join(root, item)));
}

const missingDirs = hasMissing(requiredDirs);
const missingFiles = hasMissing(requiredFiles);
const missingFixtureDirs = hasMissing(requiredFixtureDirs);

if (missingDirs.length || missingFiles.length) {
  console.error("[foundation] Missing required foundation items.");
  if (missingDirs.length) {
    console.error(`- Directories: ${missingDirs.join(", ")}`);
  }
  if (missingFiles.length) {
    console.error(`- Files: ${missingFiles.join(", ")}`);
  }
  process.exit(1);
}

if ((mode === "test" || mode === "smoke") && missingFixtureDirs.length) {
  console.error("[foundation] Missing parity fixture directories.");
  console.error(`- Fixture directories: ${missingFixtureDirs.join(", ")}`);
  process.exit(1);
}

const okMessage = {
  bootstrap: "Workspace foundation bootstrapped and validated.",
  lint: "Lint gate passed for empty foundation skeleton.",
  typecheck: "Typecheck gate passed for empty foundation skeleton.",
  test: "Unit gate passed for empty foundation skeleton.",
  smoke: "Smoke gate passed for empty foundation skeleton.",
  build: "Build gate passed for empty foundation skeleton.",
  check: "Foundation check passed."
}[mode] ?? `Foundation mode '${mode}' passed.`;

console.log(`[foundation] ${okMessage}`);
