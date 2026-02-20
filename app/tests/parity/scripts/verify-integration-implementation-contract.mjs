#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const modulePath = path.join(root, "../../api/src/modules/core/integration/integration-compatibility.module.ts");
const servicePath = path.join(root, "../../api/src/modules/core/integration/services/integration-compatibility.service.ts");
const jobsControllerPath = path.join(root, "../../api/src/modules/core/integration/controllers/external-jobs-compatibility.controller.ts");
const pictureControllerPath = path.join(root, "../../api/src/modules/core/integration/controllers/picture-compatibility.controller.ts");

for (const p of [modulePath, servicePath, jobsControllerPath, pictureControllerPath]) {
  if (!fs.existsSync(p)) {
    console.error(`[parity-contract] integration source missing: ${p}`);
    process.exit(1);
  }
}

const moduleSource = fs.readFileSync(modulePath, "utf8");
const serviceSource = fs.readFileSync(servicePath, "utf8");
const jobsSource = fs.readFileSync(jobsControllerPath, "utf8");
const pictureSource = fs.readFileSync(pictureControllerPath, "utf8");

for (const marker of ["ExternalJobsCompatibilityController", "PictureCompatibilityController"]) {
  if (!moduleSource.includes(marker)) {
    console.error(`[parity-contract] integration module marker missing: ${marker}`);
    process.exit(1);
  }
}

const keys = [
  "ExternalJobs/SendDailyMails",
  "ExternalJobs/SendBirthdaysNotifications",
  "ExternalJobs/AnonymizeUsers",
  "ExternalJobs/ProcessExpiredBlacklistUsers",
  "Picture/Upload"
];
for (const key of keys) {
  if (!serviceSource.includes(`\"${key}\"`)) {
    console.error(`[parity-contract] missing integration compatibility marker for ${key}`);
    process.exit(1);
  }
}

for (const marker of ["SendDailyMails", "SendBirthdaysNotifications", "AnonymizeUsers", "ProcessExpiredBlacklistUsers"]) {
  if (!jobsSource.includes(`\"${marker}\"`)) {
    console.error(`[parity-contract] external jobs controller marker missing: ${marker}`);
    process.exit(1);
  }
}

if (!pictureSource.includes('@All("Upload")')) {
  console.error('[parity-contract] picture upload marker missing in controller.');
  process.exit(1);
}

console.log('[parity-contract] Integration implementation contract assertions passed.');
