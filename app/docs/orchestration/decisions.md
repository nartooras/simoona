# Decisions

## 2026-02-20

1. `D-R0-001` Cleanup policy
- Decision: Apply hard-delete cleanup for obsolete modernization artifacts (no in-repo archive for removed files).
- Rationale: Reset baseline quickly and remove stale gate/wave signal noise from active delivery paths.

2. `D-R0-002` Gate model reset
- Decision: Replace legacy gate sequence with `R0-R5` (`Cleanup`, `Architecture`, `API Parity`, `UI Parity`, `Cloudflare Deployment`, `Release Readiness`).
- Rationale: Align orchestration with finalized delivery objective and stop using prior partial-modernization lifecycle.

3. `D-R0-003` Branch policy
- Decision: Execute modernization work only on branch `modernization`.
- Rationale: User-defined constraint for all ongoing implementation and review cycles.

4. `D-R0-004` Deployment target
- Decision: Target Cloudflare Pages for web and Cloudflare Containers for API in no-migration phase.
- Rationale: Matches user constraints for deployable no-migration runtime while preserving existing SQL Server schema.

5. `D-R0-005` Stop boundary for this run
- Decision: Stop execution after completing `R0`; do not start `R1` implementation tasks.
- Rationale: Explicit user instruction to stop before Phase 1.

6. `D-R0-006` Build-first execution policy
- Decision: Prioritize implementation of a fully working parity application before any publishing/deployment execution.
- Rationale: User requested focus on creating a working deliverable first and defer publishing decisions.

7. `D-R0-007` Deployment deferral
- Decision: Keep Cloudflare deployment planning artifacts in scope, but defer actual publish/release actions until application parity gates are complete.
- Rationale: Prevents environment and infrastructure uncertainty from blocking core product completion.

## 2026-02-20 (R1 execution)

1. `D-R1-001` Parity matrix normalization
- Decision: Normalize API/UI parity matrices to stable schemas with explicit domain columns and per-domain status counters.
- Rationale: Enables deterministic coverage reporting and cleaner phase handoff decisions for `R1` and `R2/R3` wave planning.

2. `D-R1-002` Runtime command contract policy
- Decision: Replace placeholder root/API gate wrappers with executable lint/typecheck/test/smoke/build command contracts; permit smoke fallback to static shell + visual checks when local port binding is blocked by environment restrictions.
- Rationale: Keeps CI/local contracts executable in constrained environments while preserving deterministic gate behavior.

3. `D-R1-003` Canonical shared contracts baseline
- Decision: Establish `app/packages/contracts` as canonical source for route map, auth claims, permissions, and error envelope schemas used by both API and web compatibility layers.
- Rationale: Reduces cross-app drift and sets contract-first baseline required before `R2/R3` parity implementation waves.
