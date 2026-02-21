#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const VALID_TARGETS = new Set(["all", "pages", "api"]);
const VALID_ENVS = new Set(["preview", "staging", "production"]);

function parseArgs(argv) {
  const options = {
    target: "all",
    env: "preview",
    execute: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--execute") {
      options.execute = true;
      continue;
    }

    if (token === "--target") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --target");
      }
      options.target = value;
      index += 1;
      continue;
    }

    if (token === "--env") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --env");
      }
      options.env = value;
      index += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!VALID_TARGETS.has(options.target)) {
    throw new Error(
      `Invalid --target value '${options.target}'. Expected one of: ${Array.from(VALID_TARGETS).join(", ")}`
    );
  }

  if (!VALID_ENVS.has(options.env)) {
    throw new Error(
      `Invalid --env value '${options.env}'. Expected one of: ${Array.from(VALID_ENVS).join(", ")}`
    );
  }

  return options;
}

function buildCommands({ target, env }) {
  const pagesProjectName = process.env.CF_PAGES_PROJECT_NAME ?? "simoona-modern-web";
  const pagesBranch =
    env === "production" ? "main" : env === "staging" ? "staging" : "preview";
  const pagesConfig = path.posix.join("infra", "cloudflare", "pages", "wrangler.toml");
  const containersConfig = path.posix.join(
    "infra",
    "cloudflare",
    "containers",
    "wrangler.toml"
  );

  const commands = [];

  if (target === "all" || target === "pages") {
    commands.push({
      id: "pages",
      command: "npx",
      args: [
        "wrangler",
        "pages",
        "deploy",
        "./web/dist",
        "--project-name",
        pagesProjectName,
        "--branch",
        pagesBranch,
        "--config",
        pagesConfig
      ]
    });
  }

  if (target === "all" || target === "api") {
    const args = ["wrangler", "deploy", "--config", containersConfig];
    if (env !== "production") {
      args.push("--env", env);
    }

    commands.push({
      id: "api",
      command: "npx",
      args
    });
  }

  return commands;
}

function formatCommand(command, args) {
  return [command, ...args].join(" ");
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function printHelp() {
  console.log("Cloudflare publish helper for Simoona modernization");
  console.log("");
  console.log("Usage:");
  console.log("  node ./infra/scripts/cloudflare-publish.mjs [--target all|pages|api] [--env preview|staging|production] [--execute]");
  console.log("");
  console.log("Underlying commands:");
  console.log("  npx wrangler whoami");
  console.log("  npx wrangler pages deploy ...");
  console.log("  npx wrangler deploy ...");
  console.log("");
  console.log("Default behavior prints the publish plan only (no commands executed).");
  console.log("Add --execute to run commands.");
}

let options;
try {
  options = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(`[cloudflare-publish] ${error.message}`);
  printHelp();
  process.exit(1);
}

if (options.help) {
  printHelp();
  process.exit(0);
}

const commands = buildCommands(options);

console.log(
  `[cloudflare-publish] target=${options.target} env=${options.env} execute=${options.execute}`
);

for (const item of commands) {
  console.log(`[cloudflare-publish] ${item.id}: ${formatCommand(item.command, item.args)}`);
}

if (!options.execute) {
  console.log(
    "[cloudflare-publish] Plan only. Re-run with --execute after explicit approval and valid Cloudflare auth."
  );
  process.exit(0);
}

run("npx", ["wrangler", "whoami"], process.cwd());

for (const item of commands) {
  run(item.command, item.args, process.cwd());
}

console.log("[cloudflare-publish] Publish execution complete.");
