#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const modernRoot = path.join(repoRoot, "modern");

const skipDirs = new Set([
  ".git",
  ".vite",
  ".pnpm",
  "bin",
  "coverage",
  "dist",
  "node_modules",
  "obj",
]);

const codeExtensions = new Set([
  ".cjs",
  ".cs",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
]);

const forbiddenPatterns = [
  /\bfrom\s*["'](?:\.\.\/)+src\//,
  /\brequire\(\s*["'](?:\.\.\/)+src\//,
  /["']\/(?:Users|home|workspace)\/[^"']*\/src\//,
  /ProjectReference\s+Include=["'][^"']*[\\/](src)[\\/]/,
];

const violations = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) {
        continue;
      }

      walk(path.join(dir, entry.name));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!codeExtensions.has(ext)) {
      continue;
    }

    const filePath = path.join(dir, entry.name);
    const relPath = path.relative(repoRoot, filePath);
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (forbiddenPatterns.some((pattern) => pattern.test(line))) {
        violations.push(`${relPath}:${i + 1}: ${line.trim()}`);
      }
    }
  }
}

walk(modernRoot);

if (violations.length > 0) {
  console.error("Architecture boundary check failed.");
  console.error("Found forbidden legacy src/** references from modern/**:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("Architecture boundary check passed (no modern/** -> src/** references).");
