import { killProcessTree, readPidFile, removePidFile } from "./demo-lib.mjs";

const state = readPidFile();
if (!state) {
  console.log("[demo:stop] No running demo metadata found.");
  process.exit(0);
}

const apiStopped = killProcessTree(state.apiPid);
const webappStopped = killProcessTree(state.webappPid);

removePidFile();

console.log("[demo:stop] Completed.");
console.log(`[demo:stop] API process ${state.apiPid ?? "<none>"}: ${apiStopped ? "stopped" : "not running"}`);
console.log(`[demo:stop] Webapp process ${state.webappPid ?? "<none>"}: ${webappStopped ? "stopped" : "not running"}`);
