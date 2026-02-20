#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contractPath = path.join(root, "contracts/wave-a/wave-a-adapter-boundaries.json");

if (!fs.existsSync(contractPath)) {
  console.error(`[wave-a-adapter] Missing contract file: ${contractPath}`);
  process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const servicePath = contract.serviceFile;

if (typeof servicePath !== "string" || servicePath.length === 0 || !fs.existsSync(servicePath)) {
  console.error(`[wave-a-adapter] Missing service file: ${String(servicePath)}`);
  process.exit(1);
}

if (!Array.isArray(contract.rules) || contract.rules.length === 0) {
  console.error("[wave-a-adapter] Adapter boundary rules are missing.");
  process.exit(1);
}

const serviceSource = fs.readFileSync(servicePath, "utf8");

for (const rule of contract.rules) {
  if (
    !Array.isArray(rule.requiredMethods) ||
    rule.requiredMethods.length === 0 ||
    typeof rule.requiredToken !== "string" ||
    rule.requiredToken.length === 0
  ) {
    console.error("[wave-a-adapter] Invalid rule shape.");
    process.exit(1);
  }

  for (const methodName of rule.requiredMethods) {
    const startToken = `async ${methodName}(`;
    const startIndex = serviceSource.indexOf(startToken);

    if (startIndex < 0) {
      console.error(`[wave-a-adapter] Missing method '${methodName}' for rule '${rule.name}'.`);
      process.exit(1);
    }

    const searchOffset = startIndex + startToken.length;
    const nextAsyncIndex = serviceSource.indexOf("\n  async ", searchOffset);
    const nextPrivateIndex = serviceSource.indexOf("\n  private ", searchOffset);
    const methodEndCandidates = [nextAsyncIndex, nextPrivateIndex].filter((index) => index > -1);
    const methodEnd =
      methodEndCandidates.length === 0 ? serviceSource.length : Math.min(...methodEndCandidates);
    const methodBlock = serviceSource.slice(startIndex, methodEnd);

    if (!methodBlock.includes(rule.requiredToken)) {
      console.error(
        `[wave-a-adapter] Method '${methodName}' is missing token '${rule.requiredToken}'.`
      );
      process.exit(1);
    }
  }
}

console.log("[wave-a-adapter] Wave A adapter boundary checks passed.");
