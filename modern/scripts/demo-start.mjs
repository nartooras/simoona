import path from "node:path";
import {
  assertApiHealthAndAuthBaseline,
  assertDemoEnvironmentConsistency,
  assertDemoRouteDefinitions,
  ensureLogDir,
  ensurePortAvailable,
  killProcessTree,
  mintDevToken,
  openLogFile,
  readDemoConfig,
  readPidFile,
  removePidFile,
  spawnApi,
  spawnWebapp,
  waitForApiHealthy,
  waitForWebappReady,
  writePidFile,
} from "./demo-lib.mjs";

try {
  const existing = readPidFile();
  if (existing?.apiPid || existing?.webappPid) {
    throw new Error("Existing demo process metadata was found. Run 'pnpm demo:stop' first.");
  }

  const config = readDemoConfig();
  console.log("[demo:start] Running preflight checks...");
  assertDemoEnvironmentConsistency(config);
  assertDemoRouteDefinitions();

  await ensurePortAvailable(config.apiHost, config.apiPort, "API");
  await ensurePortAvailable(config.webHost, config.webPort, "Webapp");

  const logDir = ensureLogDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const apiLogPath = path.join(logDir, `api-${timestamp}.log`);
  const webappLogPath = path.join(logDir, `webapp-${timestamp}.log`);

  const apiStdoutFd = openLogFile(apiLogPath);
  const apiStderrFd = openLogFile(apiLogPath);
  const apiProcess = spawnApi(config, {
    detached: true,
    stdio: ["ignore", apiStdoutFd, apiStderrFd],
  });
  apiProcess.unref();

  try {
    await waitForApiHealthy(config.apiOrigin, config.healthTimeoutMs, config.healthPollIntervalMs);
  } catch (error) {
    killProcessTree(apiProcess.pid);
    throw error;
  }

  const mintedToken = await mintDevToken(config);
  await assertApiHealthAndAuthBaseline(config, mintedToken);

  const webappStdoutFd = openLogFile(webappLogPath);
  const webappStderrFd = openLogFile(webappLogPath);
  const webappProcess = spawnWebapp(config, mintedToken, {
    detached: true,
    stdio: ["ignore", webappStdoutFd, webappStderrFd],
  });
  webappProcess.unref();
  try {
    await waitForWebappReady(config.webOrigin, config.healthTimeoutMs, config.healthPollIntervalMs);
  } catch (error) {
    killProcessTree(apiProcess.pid);
    killProcessTree(webappProcess.pid);
    throw error;
  }

  writePidFile({
    startedAt: new Date().toISOString(),
    apiPid: apiProcess.pid,
    webappPid: webappProcess.pid,
    apiOrigin: config.apiOrigin,
    webOrigin: config.webOrigin,
    env: {
      VITE_DEMO_MODE: config.demoMode,
      VITE_API_BASE_URL: config.apiBaseUrl,
      VITE_API_ORGANIZATION_ID: config.organizationId,
      VITE_API_BEARER_TOKEN: mintedToken,
    },
    logs: {
      api: apiLogPath,
      webapp: webappLogPath,
    },
  });

  console.log("[demo:start] PASS");
  console.log(`[demo:start] API: ${config.apiOrigin}`);
  console.log(`[demo:start] Webapp: ${config.webOrigin}`);
  console.log(`[demo:start] VITE_DEMO_MODE=${config.demoMode}`);
  console.log(`[demo:start] VITE_API_BASE_URL=${config.apiBaseUrl}`);
  console.log(`[demo:start] VITE_API_ORGANIZATION_ID=${config.organizationId}`);
  console.log("[demo:start] VITE_API_BEARER_TOKEN=<minted at startup>");
  console.log(`[demo:start] Logs: api=${apiLogPath} webapp=${webappLogPath}`);
  console.log("[demo:start] Stop with: pnpm demo:stop");
} catch (error) {
  removePidFile();
  console.error("[demo:start] FAIL");
  if (error instanceof Error) {
    console.error(`[demo:start] ${error.message}`);
  } else {
    console.error(`[demo:start] ${String(error)}`);
  }
  process.exit(1);
}
