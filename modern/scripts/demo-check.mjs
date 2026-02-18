import {
  ensurePortAvailable,
  mintDevToken,
  readDemoConfig,
  readProcessOutput,
  spawnApi,
  waitForApiHealthy,
} from "./demo-lib.mjs";

let apiProcess;

try {
  const config = readDemoConfig();

  console.log("[demo:check] Validating local demo prerequisites...");
  await ensurePortAvailable(config.apiHost, config.apiPort, "API");
  await ensurePortAvailable(config.webHost, config.webPort, "Webapp");

  apiProcess = spawnApi(config, { stdio: "pipe" });
  const readOutput = readProcessOutput(apiProcess);
  await new Promise((resolve, reject) => {
    const onExit = (code, signal) => {
      reject(
        new Error(
          `API process exited before health became ready (code=${code ?? "null"}, signal=${signal ?? "null"}). Startup output:\n${readOutput() || "<no output>"}`,
        ),
      );
    };

    apiProcess.once("exit", onExit);
    waitForApiHealthy(config.apiOrigin, config.healthTimeoutMs, config.healthPollIntervalMs)
      .then(() => {
        apiProcess.off("exit", onExit);
        resolve();
      })
      .catch((error) => {
        apiProcess.off("exit", onExit);
        reject(error);
      });
  });
  const token = await mintDevToken(config);

  console.log("[demo:check] PASS");
  console.log(`[demo:check] VITE_DEMO_MODE=${config.demoMode}`);
  console.log(`[demo:check] VITE_API_BASE_URL=${config.apiBaseUrl}`);
  console.log(`[demo:check] VITE_API_ORGANIZATION_ID=${config.organizationId}`);
  console.log(`[demo:check] VITE_API_BEARER_TOKEN=<minted:${token.slice(0, 12)}...>`);
  console.log(`[demo:check] API health verified at ${config.apiOrigin}/health`);
} catch (error) {
  console.error("[demo:check] FAIL");
  if (error instanceof Error) {
    console.error(`[demo:check] ${error.message}`);
  } else {
    console.error(`[demo:check] ${String(error)}`);
  }

  process.exitCode = 1;
} finally {
  if (apiProcess && !apiProcess.killed) {
    apiProcess.kill("SIGTERM");
  }
}
