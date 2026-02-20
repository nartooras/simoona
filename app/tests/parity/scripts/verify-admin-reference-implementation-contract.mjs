#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const modulePath = path.join(root, "../../api/src/modules/core/admin/admin-reference-compatibility.module.ts");
const servicePath = path.join(root, "../../api/src/modules/core/admin/services/admin-reference-compatibility.service.ts");
const orgPath = path.join(root, "../../api/src/modules/core/admin/controllers/organization-compatibility.controller.ts");
const officePath = path.join(root, "../../api/src/modules/core/admin/controllers/office-compatibility.controller.ts");
const floorPath = path.join(root, "../../api/src/modules/core/admin/controllers/floor-compatibility.controller.ts");

for (const p of [modulePath, servicePath, orgPath, officePath, floorPath]) {
  if (!fs.existsSync(p)) {
    console.error(`[parity-contract] admin reference source missing: ${p}`);
    process.exit(1);
  }
}

const moduleSource = fs.readFileSync(modulePath, "utf8");
const serviceSource = fs.readFileSync(servicePath, "utf8");
const orgSource = fs.readFileSync(orgPath, "utf8");
const officeSource = fs.readFileSync(officePath, "utf8");
const floorSource = fs.readFileSync(floorPath, "utf8");

if (!moduleSource.includes("OrganizationCompatibilityController") ||
    !moduleSource.includes("OfficeCompatibilityController") ||
    !moduleSource.includes("FloorCompatibilityController")) {
  console.error("[parity-contract] admin module missing controller registrations.");
  process.exit(1);
}

const compatibilityKeys = [
  "Organization/Get",
  "Organization/GetAll",
  "Organization/Post",
  "Organization/Put",
  "Organization/Delete",
  "Organization/GetManagingDirector",
  "Organization/SetManagingDirector",
  "Office/GetAll",
  "Office/GetDefault",
  "Office/GetAllOfficesForDropdown",
  "Office/Post",
  "Office/Put",
  "Office/Delete",
  "Floor/Post",
  "Floor/Put",
  "Floor/GetByRoom",
  "Floor/GetByOffice",
  "Floor/GetAllFloors",
  "Floor/GetPaged",
  "Floor/Delete"
];

for (const key of compatibilityKeys) {
  const marker = `\"${key}\"`;
  if (!serviceSource.includes(marker)) {
    console.error(`[parity-contract] Missing admin compatibility marker for ${key}`);
    process.exit(1);
  }
}

for (const marker of ['@Controller("Organization")', '"GetManagingDirector"']) {
  if (!orgSource.includes(marker)) {
    console.error(`[parity-contract] Organization controller marker missing: ${marker}`);
    process.exit(1);
  }
}
for (const marker of ['@Controller("Office")', '"GetAllOfficesForDropdown"']) {
  if (!officeSource.includes(marker)) {
    console.error(`[parity-contract] Office controller marker missing: ${marker}`);
    process.exit(1);
  }
}
for (const marker of ['@Controller("Floor")', '"GetPaged"']) {
  if (!floorSource.includes(marker)) {
    console.error(`[parity-contract] Floor controller marker missing: ${marker}`);
    process.exit(1);
  }
}

console.log("[parity-contract] Admin/reference implementation contract assertions passed.");
