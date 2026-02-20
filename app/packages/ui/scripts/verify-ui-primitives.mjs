#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  {
    path: path.join(root, "src/primitives/legacy-shell-button.ts"),
    markers: ["legacyShellButton", "createLegacyShellButton"]
  },
  {
    path: path.join(root, "src/primitives/legacy-shell-nav-item.ts"),
    markers: ["legacyShellNavItem", "createLegacyShellNavItem"]
  },
  {
    path: path.join(root, "src/motion/legacy-motion-tokens.ts"),
    markers: ["legacyReducedMotionMode", "pageTransitionMs", "microInteractionMs"]
  },
  {
    path: path.join(root, "src/index.ts"),
    markers: [
      "createLegacyShellButton",
      "createLegacyShellNavItem",
      "resolveLegacyMotionTokens"
    ]
  }
];

for (const required of requiredFiles) {
  if (!fs.existsSync(required.path)) {
    console.error(`[ui-primitives] Missing file: ${required.path}`);
    process.exit(1);
  }

  const source = fs.readFileSync(required.path, "utf8");
  for (const marker of required.markers) {
    if (!source.includes(marker)) {
      console.error(`[ui-primitives] Missing marker '${marker}' in ${required.path}`);
      process.exit(1);
    }
  }
}

console.log("[ui-primitives] Shared primitive compatibility checks passed.");
