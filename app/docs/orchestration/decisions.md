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

## 2026-02-20 (R2 execution)

1. `D-R2-001` Auth/token/account first API wave
- Decision: Implement auth/account/token compatibility handlers with explicit contract assertions, then mark corresponding API matrix rows as `implemented`.
- Rationale: Establishes first concrete `R2` delivery slice and validates the implementation workflow for subsequent API domains.

2. `D-R2-002` Core localization/error slice
- Decision: Implement localization and error-notfound compatibility controllers in a dedicated `SystemCompatibilityModule` and include module in core compatibility graph.
- Rationale: Advances tenant/permission/localization/error parity objective in bounded scope while keeping module boundaries explicit.

3. `D-R2-003` Verification harness escalation
- Decision: Keep `R2` phase `IN_PROGRESS` and open a hard blocker for missing legacy-vs-modern runtime comparison harness needed for broad `verified` progression.
- Rationale: Prevents false-positive phase closure with implemented-only markers and insufficient runtime parity evidence.
- Status: `Superseded by D-R2-004` due to confirmed legacy runtime unavailability.

4. `D-R2-004` Offline verification policy
- Decision: Adopt offline parity verification because legacy runtime execution is unavailable. Mark items as `verified` when evidence includes:
  1) legacy source-of-truth reference (`/src` path + route/action),
  2) fixture or contract baseline linked in `/app/tests/parity`,
  3) passing modern contract/e2e assertions covering the same behavior.
- Rationale: Maintains objective verification progress under environment constraints while preserving traceable parity evidence quality.

5. `D-R2-005` Social/user implementation wave policy
- Decision: Treat mapped social + user compatibility endpoints as implementation-ready and promote them to `implemented` once explicit implementation contract assertions pass.
- Rationale: Accelerates R2 throughput by converting existing mapped controller surface into validated implementation coverage without waiting for later waves.

6. `D-R2-006` Admin/reference implementation wave policy
- Decision: Implement bounded admin/reference-data compatibility slice for organization/office/floor as concrete `R2-004` scope before broader admin controllers.
- Rationale: Reduces risk by landing a high-value, reviewable subset and validates admin wave pattern before scaling to remaining reference-data controllers.

## 2026-02-20 (R3 execution)

1. `D-R3-001` UI route catchup implementation policy
- Decision: Implement `legacy-route-catchup` resolver in the modern web shell and use it as the canonical broad legacy route classification layer for tenant/public/auth route families.
- Rationale: Provides executable route-shape compatibility coverage for the full UI route matrix without requiring legacy runtime execution.

2. `D-R3-002` UI offline verification policy application
- Decision: Promote UI matrix rows to `verified` using offline evidence triad (legacy source references + parity baseline contract + passing modern shell/visual checks).
- Rationale: Maintains deterministic parity progress under confirmed legacy runtime unavailability.

## 2026-02-20 (R4 execution)

1. `D-R4-001` Artifact-only deployment gate policy
- Decision: Complete `R4` using Cloudflare Pages/Containers deployment artifacts plus executable artifact-contract checks, while keeping publish commands deferred.
- Rationale: Satisfies deployment-readiness objectives under explicit no-publish user constraint.
