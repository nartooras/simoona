#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = {
  module: path.join(root, "../../api/src/modules/core/core-compatibility.module.ts"),
  localization: path.join(root, "../../api/src/modules/core/system/controllers/localization-compatibility.controller.ts"),
  error: path.join(root, "../../api/src/modules/core/system/controllers/error-compatibility.controller.ts"),
  guard: path.join(root, "../../api/src/modules/core/permissions/legacy-permission.guard.ts")
};

for (const p of Object.values(files)) {
  if (!fs.existsSync(p)) {
    console.error(`[parity-contract] core implementation source missing: ${p}`);
    process.exit(1);
  }
}

const moduleSource = fs.readFileSync(files.module, "utf8");
const localizationSource = fs.readFileSync(files.localization, "utf8");
const errorSource = fs.readFileSync(files.error, "utf8");
const guardSource = fs.readFileSync(files.guard, "utf8");

if (!moduleSource.includes("SystemCompatibilityModule")) {
  console.error("[parity-contract] Core module missing SystemCompatibilityModule import.");
  process.exit(1);
}

for (const marker of ["Localization/GetResource", "Localization/GetResources", 'status: "implemented"']) {
  if (!localizationSource.includes(marker)) {
    console.error(`[parity-contract] Localization implementation marker missing: ${marker}`);
    process.exit(1);
  }
}

for (const marker of ["Error/NotFound", "LEGACY_NOT_FOUND", '@HttpCode(404)']) {
  if (!errorSource.includes(marker)) {
    console.error(`[parity-contract] Error implementation marker missing: ${marker}`);
    process.exit(1);
  }
}

if (!guardSource.includes('status: "implemented"')) {
  console.error('[parity-contract] Permission guard is not marked implemented.');
  process.exit(1);
}

console.log("[parity-contract] Core implementation contract assertions passed.");
