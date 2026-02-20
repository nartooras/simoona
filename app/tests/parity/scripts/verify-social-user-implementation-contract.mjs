#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const socialServicePath = path.join(root, "../../api/src/modules/core/social/services/social-compatibility.service.ts");
const userControllerPath = path.join(root, "../../api/src/modules/core/auth/controllers/user-compatibility.controller.ts");
const authModulePath = path.join(root, "../../api/src/modules/core/auth/auth-compatibility.module.ts");

for (const p of [socialServicePath, userControllerPath, authModulePath]) {
  if (!fs.existsSync(p)) {
    console.error(`[parity-contract] social/user implementation source missing: ${p}`);
    process.exit(1);
  }
}

const socialSource = fs.readFileSync(socialServicePath, "utf8");
const userSource = fs.readFileSync(userControllerPath, "utf8");
const authModuleSource = fs.readFileSync(authModulePath, "utf8");

const socialCompatibilityKeys = [
  "Wall/Create",
  "Wall/Edit",
  "Wall/Delete",
  "Wall/List",
  "Wall/Details",
  "Wall/Posts",
  "Wall/AllPosts",
  "Wall/Members",
  "Wall/Follow",
  "Wall/Search",
  "Post/Create",
  "Post/Edit",
  "Post/Delete",
  "Post/GetPost",
  "Post/Hide",
  "Post/Like",
  "Post/Watch",
  "Post/Unwatch",
  "Comment/Create",
  "Comment/Edit",
  "Comment/Delete",
  "Comment/Hide",
  "Comment/Like",
  "Notification/GetAll",
  "Notification/MarkAsRead",
  "Notification/MarkAllAsRead",
  "User/Notifications:Get",
  "User/Notifications:Put"
];

for (const key of socialCompatibilityKeys) {
  const marker = `compatibility: \"${key}\"`;
  if (!socialSource.includes(marker)) {
    console.error(`[parity-contract] Missing social compatibility marker for ${key}`);
    process.exit(1);
  }
}

if ((socialSource.match(/status: \"implemented\"/g) ?? []).length < socialCompatibilityKeys.length) {
  console.error("[parity-contract] Social service implemented markers are incomplete.");
  process.exit(1);
}

for (const marker of [
  '@Controller("User")',
  '"GeneralSettings"',
  '"Logins"',
  '"DeleteLogin"',
  '"GetUsersForAutocomplete"'
]) {
  if (!userSource.includes(marker)) {
    console.error(`[parity-contract] User controller marker missing: ${marker}`);
    process.exit(1);
  }
}

if (!authModuleSource.includes("UserCompatibilityController")) {
  console.error("[parity-contract] Auth module missing UserCompatibilityController.");
  process.exit(1);
}

console.log("[parity-contract] Social/User implementation contract assertions passed.");
