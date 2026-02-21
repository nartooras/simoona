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

## 2026-02-20 (R5 execution)

1. `D-R5-001` Readiness gate completion policy
- Decision: Mark `R5` complete when full verification pack is green, release checklist is complete, and publish execution plan exists without running publish commands.
- Rationale: Satisfies readiness objective while preserving explicit user-controlled publish boundary.

## 2026-02-20 (Correction)

1. `D-CORR-001` Offline verification invalidation
- Decision: Offline-only verification is no longer sufficient to mark API/UI parity rows as `verified` or to close `R2`, `R3`, or `R5`.
- Rationale: Current runtime does not visually/functionally match legacy behavior; prior closure criteria produced a false-ready state.

2. `D-CORR-002` Hard runtime parity gate
- Decision: A parity item can be `verified` only with runtime-backed evidence:
  1) executable modern runtime test for behavior,
  2) route/endpoint-specific assertion output,
  3) visual evidence for UI paths.
- Rationale: Prevents documentation-only or offline-only closure.

3. `D-CORR-003` Publish block policy
- Decision: Publish planning may continue, but publish execution is blocked until `R2` and `R3` are re-closed with runtime evidence and `R5` is re-approved.
- Rationale: Ensures deployment only after product reality matches readiness status.

4. `D-CORR-004` Screenshot-driven UI parity baseline
- Decision: Use the user-provided legacy screenshot as a mandatory visual target baseline for the first UI recovery wave, documented in `app/docs/parity/ui-visual-target-reference.md`.
- Rationale: Legacy runtime is unavailable locally; screenshot-based baseline prevents style/layout drift and anchors implementation to concrete visual expectations.

5. `D-CORR-005` Employee-list visual baseline expansion
- Decision: Extend mandatory UI visual baseline to include the user-provided `Employee List` legacy screenshot in `app/docs/parity/ui-visual-target-reference.md`.
- Rationale: Ensures parity recovery covers more than wall/feed and anchors table-heavy screens to concrete legacy layout/density expectations.

## 2026-02-20 (Recovery Runtime Evidence)

1. `D-RECOV-001` Offline verification demotion execution
- Decision: Demote all offline-only API/UI `verified` rows to `implemented`, then re-promote only rows with fresh runtime evidence.
- Rationale: Enforces `D-CORR-002` hard-gate policy and removes stale false-ready signals.

2. `D-RECOV-002` Runtime API seed-slice strategy
- Decision: Start runtime re-verification with bounded wall/feed API slice (`Wall/List`, `Wall/Posts`, `Post/Create`, `Comment/Create`) including negative-path assertions.
- Rationale: Establishes executable verification pattern that can be repeated across remaining API domains.

3. `D-RECOV-003` Runtime UI seed-slice strategy
- Decision: Start runtime re-verification with wall/feed UI route (`/:organizationName/Wall/Feed`) and require desktop/tablet/mobile screenshot capture plus runtime route assertions.
- Rationale: Aligns first UI recovery slice with mandatory visual baseline and hard-gate evidence triad.

4. `D-RECOV-004` Tooling fallback for visual capture
- Decision: Use `npx playwright screenshot` capture flow for wall/feed evidence while local Playwright test-runner installation via `pnpm` remains DNS-constrained.
- Rationale: Maintains forward progress on runtime visual evidence despite environment package-resolution limitations.

## 2026-02-21 (Recovery Completion)

1. `D-RECOV-005` Playwright runner stabilization
- Decision: Use approved unrestricted package install path to pin local `@playwright/test` + `playwright` dependencies and Chromium runtime for e2e interaction assertions.
- Rationale: Removes prior tooling blocker and enables reproducible browser-level behavior verification.

2. `D-RECOV-006` Full API runtime matrix verification policy
- Decision: Verify every API parity row through executable runtime matrix assertions (authorized success + auth-negative path where required) and promote to `verified` only after pass.
- Rationale: Provides deterministic route/endpoint-specific runtime evidence at full matrix scale.

3. `D-RECOV-007` Full UI runtime matrix verification policy
- Decision: Verify every UI parity row via executable runtime route assertions with desktop/tablet/mobile visual captures per route.
- Rationale: Satisfies hard-gate visual evidence requirement for all UI parity rows and re-closes `R3` on runtime proof.

4. `D-RECOV-008` R2/R3 re-closure
- Decision: Re-close `R2` and `R3` after reaching `190/190` API runtime-verified and `115/115` UI runtime-verified coverage.
- Rationale: Recovery objective is met under hard runtime parity gate criteria.

## 2026-02-21 (UI Recovery Reopen)

1. `D-RECOV-009` Visual parity truth-over-doc policy
- Decision: Reopen `R3` as `IN_PROGRESS` despite prior matrix-ready claims when user-visible runtime does not match legacy UI behavior.
- Rationale: Delivery readiness is determined by real runtime parity, not only matrix/document signals.

2. `D-RECOV-010` Route-family-first implementation sequencing
- Decision: Implement and verify UI parity by route families, starting with wall/feed and employee-list, then continuing profile/settings/admin families.
- Rationale: Produces usable incremental deliverables and avoids broad but shallow placeholder coverage.

3. `D-RECOV-011` Profile/Settings route-family recovery completion
- Decision: Mark `RECOV-R3-007` complete after implementing profile/details+edit and settings/general+notifications+providers runtime views with browser-level evidence.
- Rationale: Expands real UI parity beyond wall/feed and employee-list using legacy source-driven route-family delivery.

4. `D-RECOV-012` Admin route-family recovery completion
- Decision: Mark `RECOV-R3-008` complete after implementing admin route-family runtime views (users, roles, room types, offices/floors/rooms, customization, lotteries, kudos basket) with browser-level evidence.
- Rationale: Extends parity recovery into major administration flows and unblocks matrix re-verification for admin routes.

5. `D-RECOV-013` Auth/Public/Utility route-family recovery completion
- Decision: Mark `RECOV-R3-010` complete after implementing and runtime-verifying auth/public/utility routes (`/`, `/Login`, tenant auth routes, redirect, and utility/system routes).
- Rationale: Replaces generic placeholder pages for core login/system flows and raises evidence-backed UI coverage before advancing to remaining client feature families.
