export function printDryRunBanner(mode) {
  const normalized = (mode ?? "dry-run").toLowerCase();
  const isDryRun = normalized !== "write";

  console.log("============================================================");
  console.log("DATA MIGRATION DRY-RUN v1");
  console.log(
    isDryRun
      ? "WARNING: DRY-RUN MODE (READ-ONLY). NO PRODUCTION WRITES WILL OCCUR."
      : "WARNING: WRITE MODE REQUESTED. WRITES ARE NOT IMPLEMENTED IN THIS THREAD.",
  );
  console.log("============================================================");
}

export function enforceModeGuard(mode) {
  const normalized = (mode ?? "dry-run").toLowerCase();
  if (normalized === "write") {
    throw new Error(
      "Write mode requires explicit approval and is intentionally not implemented. Use --mode dry-run.",
    );
  }

  if (normalized !== "dry-run") {
    throw new Error(`Unsupported mode '${mode}'. Allowed: dry-run, write.`);
  }

  return "dry-run";
}
