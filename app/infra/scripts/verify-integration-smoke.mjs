#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
let strictMode = false;
let envFileArg;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--strict") {
    strictMode = true;
    continue;
  }

  if (arg === "--env-file") {
    const value = args[index + 1];
    if (!value) {
      console.error("[integration-smoke] Missing value for --env-file");
      process.exit(1);
    }

    envFileArg = value;
    index += 1;
    continue;
  }

  console.error(`[integration-smoke] Unknown argument: ${arg}`);
  process.exit(1);
}

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

const envFilePath = envFileArg
  ? path.resolve(root, envFileArg)
  : path.join(root, contract.defaults?.credentialReferenceEnvFile ?? "");

if (envFileArg || contract.defaults?.credentialReferenceEnvFile) {
  loadEnvFile(envFilePath);
  console.log(
    `[integration-smoke] Loaded credential references from ${path.relative(root, envFilePath) || envFilePath}`
  );
}

const runbookPath = path.join(root, contract.defaults?.runbookPath ?? "");
const runbookText = fs.existsSync(runbookPath) ? fs.readFileSync(runbookPath, "utf8") : "";

if (!runbookText) {
  console.error(`[integration-smoke] Missing or empty runbook: ${runbookPath}`);
  process.exit(1);
}

function loadEnvFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.error(`[integration-smoke] Missing env reference file: ${filePath}`);
    process.exit(1);
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
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

function isSecretReference(value) {
  return /^(1password|op|vault|aws-secretsmanager|azure-keyvault|gcp-secretmanager):\/\/[\w./:_-]+$/i.test(
    value
  );
}

function classifyFailure(error) {
  if (error?.code === "ETIMEDOUT" || error?.name === "AbortError") {
    return "timeout";
  }

  if (error?.code === "EAUTH" || error?.statusCode === 401 || error?.status === 401) {
    return "auth-failure";
  }

  return "unknown";
}

function simulateFailureType(type) {
  switch (type) {
    case "timeout":
      throw Object.assign(new Error("simulated timeout"), { code: "ETIMEDOUT" });
    case "auth-failure":
      throw Object.assign(new Error("simulated auth failure"), { code: "EAUTH", statusCode: 401 });
    default:
      throw new Error(`unsupported failure type ${type}`);
  }
}

const readinessResults = [];
const failurePathResults = [];

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

  for (const envName of checks.secretRefEnv ?? []) {
    const value = process.env[envName];
    if (isSet(value) && !isSecretReference(value)) {
      issues.push(`invalid secret reference env ${envName}`);
    }
  }

  for (const relativeFile of checks.requiredFiles ?? []) {
    const absoluteFile = path.join(root, relativeFile);
    if (!fs.existsSync(absoluteFile)) {
      issues.push(`missing file ${relativeFile}`);
    }
  }

  if (!isSet(provider.ownership?.ownerRole)) {
    issues.push("missing ownership.ownerRole");
  }

  if (!isSet(provider.ownership?.sourceOfTruth)) {
    issues.push("missing ownership.sourceOfTruth");
  }

  if (provider.id === "external-jobs") {
    if (!isSet(provider.ownership?.callbackBaseUrlOwnerRole)) {
      issues.push("missing ownership.callbackBaseUrlOwnerRole");
    }

    if (!isSet(provider.ownership?.callbackBaseUrlSourceOfTruth)) {
      issues.push("missing ownership.callbackBaseUrlSourceOfTruth");
    }

    if (!isSet(provider.ownership?.callbackTokenOwnerRole)) {
      issues.push("missing ownership.callbackTokenOwnerRole");
    }

    if (!isSet(provider.ownership?.callbackTokenSourceOfTruth)) {
      issues.push("missing ownership.callbackTokenSourceOfTruth");
    }
  }

  const status = issues.length === 0 ? "ready" : "missing";

  readinessResults.push({
    id: provider.id,
    priority: provider.priority,
    requiredForGate: Boolean(provider.requiredForGate),
    status,
    issues
  });

  for (const scenario of provider.failurePathChecks ?? []) {
    let observedType = "unknown";
    let scenarioIssues = [];

    try {
      simulateFailureType(scenario.type);
    } catch (error) {
      observedType = classifyFailure(error);
      if (observedType !== scenario.type) {
        scenarioIssues.push(
          `classification mismatch expected=${scenario.type} observed=${observedType}`
        );
      }
    }

    if (!isSet(scenario.remediationKey)) {
      scenarioIssues.push("missing remediationKey");
    } else {
      const keyMarker = `Remediation key: \`${scenario.remediationKey}\``;
      if (!runbookText.includes(keyMarker)) {
        scenarioIssues.push(`runbook missing ${keyMarker}`);
      }
    }

    failurePathResults.push({
      providerId: provider.id,
      scenarioId: scenario.id,
      requiredForGate: Boolean(scenario.requiredForGate),
      status: scenarioIssues.length === 0 ? "pass" : "fail",
      expected: scenario.type,
      observed: observedType,
      issues: scenarioIssues
    });
  }
}

for (const result of readinessResults) {
  const issueText = result.issues.length ? result.issues.join("; ") : "none";
  console.log(
    `[integration-smoke] readiness ${result.id} [${result.priority}] status=${result.status} issues=${issueText}`
  );
}

for (const result of failurePathResults) {
  const issueText = result.issues.length ? result.issues.join("; ") : "none";
  console.log(
    `[integration-smoke] failure-path ${result.providerId}/${result.scenarioId} status=${result.status} expected=${result.expected} observed=${result.observed} issues=${issueText}`
  );
}

const readinessBlocking = readinessResults.filter(
  (item) => item.requiredForGate && item.status !== "ready"
);
const failureBlocking = failurePathResults.filter(
  (item) => item.requiredForGate && item.status !== "pass"
);

console.log(
  `[integration-smoke] readiness-summary ready=${readinessResults.filter((item) => item.status === "ready").length} missing=${readinessResults.filter((item) => item.status !== "ready").length}`
);
console.log(
  `[integration-smoke] failure-summary pass=${failurePathResults.filter((item) => item.status === "pass").length} fail=${failurePathResults.filter((item) => item.status !== "pass").length}`
);

if (strictMode && (readinessBlocking.length > 0 || failureBlocking.length > 0)) {
  if (readinessBlocking.length > 0) {
    console.error(
      `[integration-smoke] STRICT readiness blockers: ${readinessBlocking
        .map((item) => item.id)
        .join(", ")}`
    );
  }

  if (failureBlocking.length > 0) {
    console.error(
      `[integration-smoke] STRICT failure-path blockers: ${failureBlocking
        .map((item) => `${item.providerId}/${item.scenarioId}`)
        .join(", ")}`
    );
  }

  process.exit(1);
}

if (readinessBlocking.length > 0 || failureBlocking.length > 0) {
  const blockers = [
    ...readinessBlocking.map((item) => item.id),
    ...failureBlocking.map((item) => `${item.providerId}/${item.scenarioId}`)
  ];
  console.log(`[integration-smoke] Baseline complete with blockers: ${blockers.join(", ")}`);
  process.exit(0);
}

console.log("[integration-smoke] All gate-critical providers and failure-path checks are ready.");
