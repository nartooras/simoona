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

1. `R1-001` (`$parity-analyst`)
- In scope:
  - Re-baseline `app/docs/parity/api-endpoint-matrix.csv`.
  - Re-baseline `app/docs/parity/ui-route-matrix.csv`.
  - Update `app/docs/parity/parity-gap-report.md` with current factual coverage.
- Acceptance:
  - Coverage summary includes mapped/implemented/verified percentages for API and UI.
  - Domain grouping columns are present and consistent.

2. `R1-002` (`$platform-devops`)
- In scope:
  - Remove remaining placeholder-oriented language or command behavior in active `/app` scripts.
  - Ensure root/api/web/tests commands represent real baseline execution contracts.
- Acceptance:
  - `pnpm --dir app lint|typecheck|test|smoke|build|verify` pass.
  - `pnpm --dir app/api lint|typecheck|test|build` pass.
  - No active command script references deleted `wave-a` artifacts.

3. `R1-003` (`$full-stack-developer`)
- In scope:
  - Expand `app/packages/contracts` into the canonical parity contract package.
  - Add typed route map, auth claim contracts, permission constants, and error envelope types.
- Acceptance:
  - API and web import these shared contracts where applicable.
  - Type checks remain green.

## Success Criteria For This Stage

1. `R1` tasks are complete and documented in orchestration files.
2. The app workspace runs as a coherent baseline for implementation waves.
3. A next implementation wave (`R2-001`) is READY with explicit endpoint scope.

## Explicitly Deferred

1. Cloudflare publishing/deployment execution.
2. Production DNS or traffic switching.
3. Release cutover tasks.

