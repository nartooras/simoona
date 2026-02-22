#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const root = process.cwd();

const result = spawnSync("pnpm", ["exec", "tsc", "--noEmit", "-p", "tsconfig.json"], {
  cwd: root,
  stdio: "inherit"
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("[web-syntax] TypeScript checks passed.");
