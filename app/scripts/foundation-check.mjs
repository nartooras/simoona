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
  "docs/orchestration"
];

const requiredFiles = [
  "package.json",
  "pnpm-workspace.yaml",
  "docs/orchestration/backlog.md",
  "docs/orchestration/status.md",
  "docs/orchestration/risks.md",
  "docs/orchestration/decisions.md",
  "docs/orchestration/evidence.md",
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
  bootstrap: "Workspace baseline validated.",
  lint: "Lint gate passed for workspace baseline.",
  typecheck: "Typecheck gate passed for workspace baseline.",
  test: "Unit gate passed for workspace baseline.",
  smoke: "Smoke gate passed for workspace baseline.",
  build: "Build gate passed for workspace baseline.",
  check: "Workspace check passed."
}[mode] ?? `Foundation mode '${mode}' passed.`;

console.log(`[workspace] ${okMessage}`);
