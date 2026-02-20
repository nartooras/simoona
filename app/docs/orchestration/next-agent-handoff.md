# Next Agent Handoff Plan

Date: `2026-02-20`
Branch: `modernization`
Mode: `build-first`

## Objective

Build a working, parity-focused application under `/app` before any publishing/deployment execution.

## Hard Rules

1. Work only on branch `modernization`.
2. Do not change `/src` or `/build`.
3. Do not execute Cloudflare publish/deploy commands yet.
4. Keep all work scoped to `/app`.

## Immediate Execution Queue

1. `R2-001` (`$full-stack-developer`)
- In scope:
  - Implement auth/token/account endpoint parity slice using canonical contracts package.
  - Move mapped auth/account/token endpoints from `mapped` to `implemented` with fixture-backed checks.
- Acceptance:
  - Endpoint handlers exist for scoped auth/account/token contracts.
  - Contract fixtures and parity tests pass for the scoped endpoints.
  - `app/docs/parity/api-endpoint-matrix.csv` statuses updated for implemented rows.

2. `R2-002` (`$full-stack-developer`)
- In scope:
  - Implement tenant/permission/localization/error compatibility slice.
  - Ensure legacy error/permission behavior remains contract-compatible.
- Acceptance:
  - Scoped API parity tests pass and fixtures remain aligned.
  - Permission and error compatibility contracts remain green.

3. `R3-001` prep (`$parity-analyst` + `$full-stack-developer`)
- In scope:
  - Use rebased UI matrix to define first auth shell + core route implementation slice.
  - Prepare route-level parity verification requirements for runtime and visual checks.
- Acceptance:
  - `R3-001` task scope lists exact routes and verification commands.

## Success Criteria For This Stage

1. `R1` tasks are complete and documented in orchestration files.
2. The app workspace runs as a coherent baseline for implementation waves.
3. `R2-001` is the active next gate and ready for endpoint implementation execution.

## Explicitly Deferred

1. Cloudflare publishing/deployment execution.
2. Production DNS or traffic switching.
3. Release cutover tasks.
