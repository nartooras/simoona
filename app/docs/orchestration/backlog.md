# Backlog

Modernization source-of-truth backlog for the reset delivery model (`R0` to `R5`).

Use `app/docs/orchestration/next-agent-handoff.md` as the immediate execution brief for the next AI agent.

## Priority Queue

1. `RECOV-R5-001` (`P0`, owner `$qa` + `$reviewer`): Re-run release readiness gate with runtime-backed parity evidence now that `R2` and `R3` are re-closed.
   - Acceptance:
     - Runtime evidence artifacts are linked and accepted for API/UI parity.
     - Gate recommendation is `GREEN` or explicit actionable defects are listed.
2. `RECOV-R5-002` (`P1`, owner `$qa`): Refresh final verification report with runtime matrix assertion and visual evidence results.
   - Acceptance:
     - Report reflects runtime-backed evidence (not offline-only artifacts).
3. `RECOV-R5-003` (`P1`, owner `$platform-devops`): Keep publish execution deferred and prepare decision-ready publish recommendation.
   - Acceptance:
     - No publish command is executed without explicit user approval.

## Completed

1. `R0-001` (`P0`, owner `$platform-devops`): Hard-delete obsolete modernization artifacts from orchestration, wave scaffolding, and foundation docs.
2. `R0-002` (`P0`, owner `$simoona-modernization-orchestrator`): Recreate orchestration control files with gate model `R0-R5`.
3. `R1-001` (`P0`, owner `$parity-analyst`): Re-baselined API/UI parity matrices with normalized schema, grouped domains, and status counters.
4. `R1-002` (`P0`, owner `$platform-devops`): Replaced placeholder root/API command wrappers with runtime-backed contract execution across lint/typecheck/test/smoke/build (including constrained-environment smoke fallback path).
5. `R1-003` (`P0`, owner `$full-stack-developer`): Expanded `app/packages/contracts` with canonical route-map, auth-claims, permissions, and error-envelope modules; wired API and web to consume shared contracts.
6. `R2-001` (`P0`, owner `$full-stack-developer`): Implemented auth/token/account compatibility endpoints and contract assertions.
7. `R2-002` (`P0`, owner `$full-stack-developer`): Implemented tenant/permission/localization/error core compatibility slice and contract assertions.
8. `R2-003` (`P0`, owner `$full-stack-developer`): Implemented social + user compatibility endpoints with explicit social/user implementation contract assertions.
9. `R2-004` (`P0`, owner `$full-stack-developer`): Implemented admin/reference-data slice for organization/office/floor endpoints with contract assertions.
10. `R2-005` (`P0`, owner `$full-stack-developer` + `$qa`): Implemented external jobs and media upload integration-sensitive endpoints with contract assertions.
11. `R2-006` (`P0`, owner `$qa` + `$parity-analyst`): Promoted API matrix rows to `verified` under offline verification triad (`190/190`).
12. `R3-001` (`P0`, owner `$full-stack-developer`): Added UI legacy route catchup resolver and runtime route classification for tenant/public/auth shapes.
13. `R3-002` (`P0`, owner `$full-stack-developer` + `$parity-analyst`): Promoted UI route matrix from unmapped to mapped/implemented with explicit modern route/component targets.
14. `R3-003` (`P0`, owner `$qa` + `$parity-analyst`): Added executable UI implementation contract and promoted UI rows to `verified` under offline verification triad (`115/115`).
15. `R4-001` (`P1`, owner `$cloudflare-deploy` + `$platform-devops`): Added Cloudflare Pages/Containers no-publish deployment artifacts and deployment contract checks.
16. `R5-001` (`P1`, owner `$qa` + `$platform-devops`): Added release readiness checklist with explicit go/no-go criteria and risk references.
17. `R5-002` (`P1`, owner `$qa`): Added final verification report and executed full command pack.
18. `R5-003` (`P1`, owner `$simoona-modernization-orchestrator`): Added publish-ready execution plan while keeping publish commands deferred.
19. `CORR-001` (`P0`, owner `$simoona-modernization-orchestrator`): Reopened `R2`, `R3`, and `R5` after detecting false readiness from offline-only verification.
20. `RECOV-R3-000` (`P0`, owner `$parity-analyst` + `$full-stack-developer`): Bound wall/feed recovery to the mandatory screenshot baseline in `app/docs/parity/ui-visual-target-reference.md`.
21. `RECOV-R2-001` (`P0`, owner `$parity-analyst` + `$qa`): Demoted offline-only API `verified` rows and reset runtime verification requirement.
22. `RECOV-R3-001` (`P0`, owner `$parity-analyst` + `$qa`): Demoted offline-only UI `verified` rows and reset runtime verification requirement.
23. `RECOV-R2-002-A` (`P0`, owner `$full-stack-developer` + `$qa`): Delivered first runtime API parity wave for wall/feed endpoints with assertion evidence.
24. `RECOV-R3-002-A` (`P0`, owner `$full-stack-developer` + `$qa`): Delivered first runtime UI wall/feed evidence slice with desktop/tablet/mobile screenshot artifacts.
25. `RECOV-R3-004` (`P1`, owner `$platform-devops` + `$qa`): Stabilized local Playwright runner installation and enabled browser-level wall/feed interaction assertions.
26. `RECOV-R2-003` (`P0`, owner `$full-stack-developer` + `$qa`): Executed full runtime API matrix verification (`190` endpoints, including auth-negative assertions) and promoted API matrix to `190/190 verified`.
27. `RECOV-R3-003` (`P0`, owner `$full-stack-developer` + `$qa`): Executed full runtime UI matrix verification (`115` routes x desktop/tablet/mobile) and promoted UI matrix to `115/115 verified`.
