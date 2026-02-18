import { readPidFile, removePidFile, stopProcessTree } from "./demo-lib.mjs";

const state = readPidFile();
if (!state) {
  console.log("[demo:stop] No running demo metadata found.");
  process.exit(0);
}

const apiResult = await stopProcessTree(state.apiPid);
const webappResult = await stopProcessTree(state.webappPid);

removePidFile();

console.log("[demo:stop] Completed.");
console.log(`[demo:stop] API process ${state.apiPid ?? "<none>"}: ${apiResult}`);
console.log(`[demo:stop] Webapp process ${state.webappPid ?? "<none>"}: ${webappResult}`);

if (apiResult === "timeout" || webappResult === "timeout") {
  process.exitCode = 1;
}
