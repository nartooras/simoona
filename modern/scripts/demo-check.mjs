import { spawn } from "node:child_process";
import {
  assertApiHealthAndAuthBaseline,
  assertDemoEnvironmentConsistency,
  assertDemoRouteDefinitions,
  ensurePortAvailable,
  mintDevToken,
  readDemoConfig,
  readProcessOutput,
  spawnApi,
  waitForApiHealthy,
} from "./demo-lib.mjs";

let apiProcess;

try {
  const checkMode = readCheckMode(process.argv.slice(2), process.env);
  const config = readDemoConfig();

  console.log(`[demo:check] Validating demo prerequisites (mode=${checkMode})...`);
  assertDemoEnvironmentConsistency(config);
  assertDemoRouteDefinitions();

  if (checkMode === "ci") {
    await runSmokeCiGate();
    console.log("[demo:check] PASS");
    console.log("[demo:check] CI-safe gate completed via pnpm smoke:ci.");
    process.exit(0);
  }

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
  await assertApiHealthAndAuthBaseline(config, token);

  console.log("[demo:check] PASS");
  console.log(`[demo:check] VITE_DEMO_MODE=${config.demoMode}`);
  console.log(`[demo:check] VITE_API_BASE_URL=${config.apiBaseUrl}`);
  console.log(`[demo:check] VITE_API_ORGANIZATION_ID=${config.organizationId}`);
  console.log(`[demo:check] VITE_API_BEARER_TOKEN=<minted:${token.slice(0, 12)}...>`);
  console.log(`[demo:check] API health/auth baseline verified at ${config.apiOrigin}`);
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

function readCheckMode(args, env) {
  const requested = args.includes("--ci") ? "ci" : env.DEMO_CHECK_MODE ?? "local";
  if (requested !== "local" && requested !== "ci") {
    throw new Error(`Unsupported demo check mode '${requested}'. Use 'local' or 'ci'.`);
  }

  return requested;
}

async function runSmokeCiGate() {
  const commandOutput = await new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["smoke:ci"], {
      stdio: "pipe",
      env: process.env,
    });

    let output = "";
    const append = (chunk) => {
      output += chunk.toString();
      if (output.length > 8000) {
        output = output.slice(output.length - 8000);
      }
    };

    child.stdout.on("data", append);
    child.stderr.on("data", append);
    child.on("error", (error) => reject(error));
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`pnpm smoke:ci failed with exit code ${code}.\n${output || "<no output>"}`));
      }
    });
  });

  if (typeof commandOutput !== "string") {
    throw new Error("Unexpected smoke:ci output state.");
  }
}
