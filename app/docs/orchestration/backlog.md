# Backlog

Modernization source-of-truth backlog for the reset delivery model (`R0` to `R5`).

Use `app/docs/orchestration/next-agent-handoff.md` as the immediate execution brief for the next AI agent.

## Priority Queue

1. `R2-001` (`P0`, owner `$full-stack-developer`): Implement auth/token/account API parity wave.
   - Depends on: `R1-002`, `R1-003`
2. `R2-002` (`P0`, owner `$full-stack-developer`): Implement tenant/permission/localization/error API parity wave.
   - Depends on: `R2-001`
3. `R3-001` (`P0`, owner `$full-stack-developer`): Implement auth shell and core route parity wave.
   - Depends on: `R1-003`
4. `R4-001` (`P1`, owner `$cloudflare-deploy` + `$platform-devops`): Create Cloudflare Pages and Containers deployment assets (no publish execution yet).
   - Depends on: `R2-*` and `R3-*` completion gates

## Completed

1. `R0-001` (`P0`, owner `$platform-devops`): Hard-delete obsolete modernization artifacts from orchestration, wave scaffolding, and foundation docs.
2. `R0-002` (`P0`, owner `$simoona-modernization-orchestrator`): Recreate orchestration control files with gate model `R0-R5`.
3. `R1-001` (`P0`, owner `$parity-analyst`): Re-baselined API/UI parity matrices with normalized schema, grouped domains, and status counters; refreshed `parity-gap-report.md` with factual coverage.
4. `R1-002` (`P0`, owner `$platform-devops`): Replaced placeholder root/API command wrappers with runtime-backed contract execution across lint/typecheck/test/smoke/build (including constrained-environment smoke fallback path).
5. `R1-003` (`P0`, owner `$full-stack-developer`): Expanded `app/packages/contracts` with canonical route-map, auth-claims, permissions, and error-envelope modules; wired API and web to consume shared contracts.
