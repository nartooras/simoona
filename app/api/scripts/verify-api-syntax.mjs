#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();

function collectFiles(dir, extensions, accumulator = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, extensions, accumulator);
      continue;
    }

    if (extensions.has(path.extname(entry.name))) {
      accumulator.push(fullPath);
    }
  }

  return accumulator;
}

function checkFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const useStdinInput = extension === ".tsx";
  const args = useStdinInput
    ? ["--experimental-strip-types", "--check", "--input-type=module"]
    : ["--experimental-strip-types", "--check", filePath];
  const result = spawnSync("node", args, {
    cwd: root,
    stdio: "pipe",
    input: useStdinInput ? fs.readFileSync(filePath, "utf8") : undefined
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.toString("utf8") ?? "";
    const stdout = result.stdout?.toString("utf8") ?? "";
    console.error(`[api-syntax] Syntax check failed for ${filePath}`);
    if (stdout.trim()) {
      console.error(stdout.trim());
    }
    if (stderr.trim()) {
      console.error(stderr.trim());
    }
    process.exit(result.status ?? 1);
  }
}

const sourceDirs = [path.join(root, "src"), path.join(root, "scripts")];
const extensions = new Set([".ts", ".tsx", ".mjs", ".js"]);
const files = sourceDirs.flatMap((dir) => collectFiles(dir, extensions));

if (files.length === 0) {
  console.error("[api-syntax] No source files found to check.");
  process.exit(1);
}

for (const filePath of files) {
  checkFile(filePath);
}

console.log(`[api-syntax] Syntax checks passed (${String(files.length)} files).`);
