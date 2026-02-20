#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contractPath = path.join(root, "infra/contracts/cloudflare-deploy-contract.json");
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));

for (const relPath of contract.requiredFiles) {
  const absolutePath = path.join(root, relPath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`[cloudflare-contract] Missing required file: ${relPath}`);
    process.exit(1);
  }
}

for (const markerCheck of contract.fileMarkers) {
  const absolutePath = path.join(root, markerCheck.path);
  const source = fs.readFileSync(absolutePath, "utf8");

  for (const marker of markerCheck.markers) {
    if (!source.includes(marker)) {
      console.error(
        `[cloudflare-contract] Missing marker '${marker}' in ${markerCheck.path}.`
      );
      process.exit(1);
    }
  }
}

console.log("[cloudflare-contract] Cloudflare deployment artifact checks passed.");
