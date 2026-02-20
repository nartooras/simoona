#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const servicePath = path.join(root, "../../api/src/modules/core/auth/services/auth-compatibility.service.ts");
const accountControllerPath = path.join(root, "../../api/src/modules/core/auth/controllers/account-compatibility.controller.ts");
const tokenControllerPath = path.join(root, "../../api/src/modules/core/auth/controllers/token-compatibility.controller.ts");

for (const p of [servicePath, accountControllerPath, tokenControllerPath]) {
  if (!fs.existsSync(p)) {
    console.error(`[parity-contract] auth implementation source missing: ${p}`);
    process.exit(1);
  }
}

const serviceSource = fs.readFileSync(servicePath, "utf8");
const accountControllerSource = fs.readFileSync(accountControllerPath, "utf8");
const tokenControllerSource = fs.readFileSync(tokenControllerPath, "utf8");

const compatibilityKeys = [
  "Account/UserInfo",
  "Account/Register",
  "Account/RegisterExternal",
  "Account/RequestPasswordReset",
  "Account/ResetPassword",
  "Account/VerifyEmail",
  "Account/ExternalLogins",
  "Account/InternalLogins",
  "Account/ExternalLogin",
  "Account/Logout",
  "/token"
];

for (const key of compatibilityKeys) {
  const marker = `compatibility: \"${key}\"`;
  if (!serviceSource.includes(marker)) {
    console.error(`[parity-contract] Missing compatibility marker for ${key}`);
    process.exit(1);
  }
}

const implementedCount = (serviceSource.match(/status: \"implemented\"/g) ?? []).length;
if (implementedCount < compatibilityKeys.length) {
  console.error("[parity-contract] Auth service implementation markers are incomplete.");
  process.exit(1);
}

for (const marker of [
  '@Controller("Account")',
  '"UserInfo"',
  '"Register"',
  '"RequestPasswordReset"',
  '"Logout"'
]) {
  if (!accountControllerSource.includes(marker)) {
    console.error(`[parity-contract] Account controller marker missing: ${marker}`);
    process.exit(1);
  }
}

for (const marker of ["LEGACY_API_ROUTES.token", "issueToken"] ) {
  if (!tokenControllerSource.includes(marker)) {
    console.error(`[parity-contract] Token controller marker missing: ${marker}`);
    process.exit(1);
  }
}

console.log("[parity-contract] Auth implementation contract assertions passed.");
