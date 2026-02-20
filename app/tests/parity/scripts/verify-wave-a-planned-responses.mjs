#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contractPath = path.join(
  root,
  "contracts/wave-a/wave-a-planned-response-contract.json"
);

if (!fs.existsSync(contractPath)) {
  console.error(`[wave-a-planned] Missing contract file: ${contractPath}`);
  process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));

if (!Array.isArray(contract.contracts) || contract.contracts.length < 10) {
  console.error("[wave-a-planned] Planned response contract list is incomplete.");
  process.exit(1);
}

if (typeof contract.serviceFile !== "string" || contract.serviceFile.length === 0) {
  console.error("[wave-a-planned] Missing serviceFile in planned response contract.");
  process.exit(1);
}

if (!fs.existsSync(contract.serviceFile)) {
  console.error(`[wave-a-planned] Missing service source: ${contract.serviceFile}`);
  process.exit(1);
}

const serviceSource = fs.readFileSync(contract.serviceFile, "utf8");
const compatibilities = new Set();

for (const item of contract.contracts) {
  if (
    typeof item.serviceMethod !== "string" ||
    typeof item.compatibility !== "string" ||
    typeof item.expectedStatus !== "string"
  ) {
    console.error("[wave-a-planned] Invalid contract entry shape.");
    process.exit(1);
  }

  const startToken = `async ${item.serviceMethod}(`;
  const startIndex = serviceSource.indexOf(startToken);

  if (startIndex < 0) {
    console.error(
      `[wave-a-planned] Missing service method '${item.serviceMethod}' for '${item.id}'.`
    );
    process.exit(1);
  }

  const searchOffset = startIndex + startToken.length;
  const nextAsyncIndex = serviceSource.indexOf("\n  async ", searchOffset);
  const nextPrivateIndex = serviceSource.indexOf("\n  private ", searchOffset);
  const methodEndCandidates = [nextAsyncIndex, nextPrivateIndex].filter((index) => index > -1);
  const methodEnd =
    methodEndCandidates.length === 0
      ? serviceSource.length
      : Math.min(...methodEndCandidates);
  const methodBlock = serviceSource.slice(startIndex, methodEnd);

  if (!methodBlock.includes(`status: "${item.expectedStatus}"`)) {
    console.error(
      `[wave-a-planned] Method '${item.serviceMethod}' does not return status '${item.expectedStatus}'.`
    );
    process.exit(1);
  }

  if (!methodBlock.includes(`compatibility: "${item.compatibility}"`)) {
    console.error(
      `[wave-a-planned] Method '${item.serviceMethod}' does not return compatibility '${item.compatibility}'.`
    );
    process.exit(1);
  }

  compatibilities.add(item.compatibility);
}

if (compatibilities.size !== contract.contracts.length) {
  console.error("[wave-a-planned] Compatibility markers must be unique in planned response contract.");
  process.exit(1);
}

console.log("[wave-a-planned] Wave A planned response checks passed.");
