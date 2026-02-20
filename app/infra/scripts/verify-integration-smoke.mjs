#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const strictMode = process.argv.includes("--strict");
const root = process.cwd();
const contractPath = path.join(root, "infra/contracts/integration-smoke-contract.json");

if (!fs.existsSync(contractPath)) {
  console.error(`[integration-smoke] Missing contract: ${contractPath}`);
  process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
if (!Array.isArray(contract.providers) || contract.providers.length === 0) {
  console.error("[integration-smoke] Contract must define at least one provider.");
  process.exit(1);
}

function isSet(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const results = [];

for (const provider of contract.providers) {
  const checks = provider.checks ?? {};
  const issues = [];

  for (const envName of checks.requiredEnv ?? []) {
    if (!isSet(process.env[envName])) {
      issues.push(`missing env ${envName}`);
    }
  }

  for (const envName of checks.urlEnv ?? []) {
    const value = process.env[envName];
    if (isSet(value) && !isValidUrl(value)) {
      issues.push(`invalid URL env ${envName}`);
    }
  }

  for (const envName of checks.numericEnv ?? []) {
    const value = process.env[envName];
    if (isSet(value) && !/^\d+$/.test(value)) {
      issues.push(`invalid numeric env ${envName}`);
    }
  }

  for (const relativeFile of checks.requiredFiles ?? []) {
    const absoluteFile = path.join(root, relativeFile);
    if (!fs.existsSync(absoluteFile)) {
      issues.push(`missing file ${relativeFile}`);
    }
  }

  const status = issues.length === 0 ? "ready" : "missing";
  results.push({
    id: provider.id,
    priority: provider.priority,
    requiredForGate: Boolean(provider.requiredForGate),
    status,
    issues
  });
}

for (const result of results) {
  const issueText = result.issues.length ? result.issues.join("; ") : "none";
  console.log(
    `[integration-smoke] ${result.id} [${result.priority}] status=${result.status} issues=${issueText}`
  );
}

const blocking = results.filter((item) => item.requiredForGate && item.status !== "ready");

if (strictMode && blocking.length > 0) {
  console.error(
    `[integration-smoke] STRICT mode failed. Gate-blocking providers not ready: ${blocking
      .map((item) => item.id)
      .join(", ")}`
  );
  process.exit(1);
}

if (blocking.length > 0) {
  console.log(
    `[integration-smoke] Baseline complete with blockers: ${blocking
      .map((item) => item.id)
      .join(", ")}`
  );
  process.exit(0);
}

console.log("[integration-smoke] All gate-critical providers are ready.");
