# Backlog

Modernization source-of-truth backlog for the reset delivery model (`R0` to `R5`).

Use `app/docs/orchestration/next-agent-handoff.md` as the immediate execution brief for the next AI agent.

## Priority Queue

1. `R1-001` (`P0`, owner `$parity-analyst`): Re-baseline API/UI matrices with domain columns and real coverage counters.
   - Depends on: `R0-001`, `R0-002`
   - Acceptance:
     - `app/docs/parity/api-endpoint-matrix.csv` updated with grouped controller domains and status counters.
     - `app/docs/parity/ui-route-matrix.csv` updated with grouped route domains and status counters.
2. `R1-002` (`P0`, owner `$platform-devops`): Replace placeholder command contracts with runtime-backed lint/typecheck/test/build.
   - Depends on: `R1-001`
   - Acceptance:
     - Root, API, web, parity, and e2e commands execute without placeholder/wave-specific wiring.
3. `R1-003` (`P0`, owner `$full-stack-developer`): Create canonical shared contracts package for API/UI parity work.
   - Depends on: `R1-001`
   - Acceptance:
     - `app/packages/contracts` includes typed route map, auth claims, permission constants, and error envelope schema.
4. `R2-001` (`P0`, owner `$full-stack-developer`): Implement auth/token/account API parity wave.
   - Depends on: `R1-002`, `R1-003`
5. `R2-002` (`P0`, owner `$full-stack-developer`): Implement tenant/permission/localization/error API parity wave.
   - Depends on: `R2-001`
6. `R3-001` (`P0`, owner `$full-stack-developer`): Implement auth shell and core route parity wave.
   - Depends on: `R1-003`
7. `R4-001` (`P1`, owner `$cloudflare-deploy` + `$platform-devops`): Create Cloudflare Pages and Containers deployment assets (no publish execution yet).
   - Depends on: `R2-*` and `R3-*` completion gates

## Completed

1. `R0-001` (`P0`, owner `$platform-devops`): Hard-delete obsolete modernization artifacts from orchestration, wave scaffolding, and foundation docs.
2. `R0-002` (`P0`, owner `$simoona-modernization-orchestrator`): Recreate orchestration control files with gate model `R0-R5`.
