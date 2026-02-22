import {
  employeeRows,
  legacyLeftMenuGroups,
  wallFeedPosts
} from "./runtime/runtime-shared.js";
import { legacyRuntimeStyles } from "./runtime/legacy-runtime-styles.js";
import { renderRuntimeShell } from "./runtime/runtime-views.js";
import { attachRuntimeInteractions } from "./runtime/runtime-interactions.js";
import { createBaseRuntimeData, ensureClientRuntimePayload } from "./app/runtime-payload.js";

const root = document.getElementById("app");
const runtimeDataElement = document.getElementById("simoona-runtime-data");

if (!(root instanceof HTMLElement) || !(runtimeDataElement instanceof HTMLScriptElement)) {
  throw new Error("Missing runtime root elements.");
}

let runtimeData = createBaseRuntimeData();

try {
  const parsed = JSON.parse(runtimeDataElement.textContent || "{}");
  runtimeData = { ...runtimeData, ...parsed };
} catch (error) {
  console.error("[web-runtime] Failed to parse runtime payload:", error);
}

const defaultLeftMenuGroups = legacyLeftMenuGroups;
const defaultWallFeedPosts = wallFeedPosts;
const defaultEmployeeRows = employeeRows;

ensureClientRuntimePayload(runtimeData, {
  browserPath: window.location.pathname || runtimeData.route || "/",
  defaultLeftMenuGroups,
  defaultWallFeedPosts,
  defaultEmployeeRows
});

const leftMenuGroups = Array.isArray(runtimeData.leftMenu?.groups) &&
  runtimeData.leftMenu.groups.length > 0
  ? runtimeData.leftMenu.groups
  : defaultLeftMenuGroups;

const appShellMarkup = renderRuntimeShell({
  runtimeData,
  leftMenuGroups
});

root.innerHTML = `
  <style>
${legacyRuntimeStyles}
  </style>
${appShellMarkup}
`;

attachRuntimeInteractions({ root, runtimeData });
