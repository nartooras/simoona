# Backlog

Modernization source-of-truth backlog for full-parity recovery (`R0` to `R5`).

## Priority Queue

1. `R4-INTEGRATION-PARITY-001B` (`P0`, owner `$platform-devops` + `$react-frontend-developer` + `$full-stack-developer`)
- Scope:
  - Complete remaining integration parity after `R4-INTEGRATION-PARITY-001A` by validating provider-backed adapter wiring and staging callback behavior against real environment contracts.
- Acceptance:
  - Runtime failure-path + provider adapter evidence captured and reviewed.

2. `R3-FEATURE-WAVE-D` (`P0`, owner `$react-frontend-developer` + `$full-stack-developer`)
- Scope:
  - Full parity for features domains previously treated as gated scope:
    events, kudos, lotteries, vacations, service requests, books, projects, committees, office map, organizational structure, submit ticket, widgets.
- Acceptance:
  - Runtime behavior parity and tests pass for all domains.

3. `R6-REVIEW-QA-ENFORCEMENT-001` (`P0`, owner `$reviewer` + `$qa`)
- Scope:
  - Produce review and QA reports for each implementation slice before closure.
- Acceptance:
  - Reviewer decision `APPROVED` exists before QA.
  - QA decision `GREEN` exists before merge/closure.

4. `R5-RELEASE-UNFREEZE-001` (`P0`, owner `$qa` + `$reviewer` + `$simoona-modernization-orchestrator`)
- Scope:
  - Final GO/NO-GO decision for production unfreeze.
- Acceptance:
  - Reviewer `APPROVED`, QA `GREEN`, no open P0/P1 parity issues, rollback evidence complete.

## Completed

1. `R0-DOC-SYNC-001`
- Outcome: 58/58 in-scope markdown files audited and synchronized (`app/docs/orchestration/doc-sync-manifest.md`).

2. `R1-GATE-HARDEN-001A`
- Outcome: web/api lint/typecheck/test/build now include real source syntax checks (`verify-web-syntax.mjs`, `verify-api-syntax.mjs`).

3. `R3-WEB-REFACTOR-001A`
- Outcome: shared runtime module introduced (`app/web/src/runtime/runtime-shared.js`) and consumed by both `main.tsx` and `live-web-runtime.mjs`.

4. `R5-RELEASE-FREEZE-001`
- Outcome: Cloudflare production publish guard enforced by default.

5. `R6-REVIEW-QA-ENFORCEMENT-001A`
- Outcome: reviewer report (`APPROVED`) and QA report (`GREEN`) published for current recovery slice.

6. `R2-AUTH-REAL-001A`
- Outcome: real runtime token/session handling and auth-context enforcement landed for `/token`, `/Account/UserInfo`, `/Account/Logout`, and protected compatibility routes (source + runtime check paths).

7. `R6-REVIEW-QA-ENFORCEMENT-001B`
- Outcome: reviewer (`APPROVED`) and QA (`GREEN`) artifacts published for `R2-AUTH-REAL-001A`.

8. `R2-AUTH-REAL-001B`
- Outcome: runtime auth/session state now resolves from SQL-backed tables (`node:sqlite`) in both source compatibility service and runtime parity server; unresolved legacy-header users no longer authenticate.

9. `R6-REVIEW-QA-ENFORCEMENT-001C`
- Outcome: reviewer (`APPROVED`) and QA (`GREEN`) artifacts published for `R2-AUTH-REAL-001B`.

10. `R3-WEB-REFACTOR-001B`
- Outcome: web runtime monolith split from `main.tsx` into dedicated styles/render/interactions runtime modules while keeping shell route checks and runtime build green.

11. `R6-REVIEW-QA-ENFORCEMENT-001D`
- Outcome: reviewer (`APPROVED`) and QA (`GREEN`) artifacts published for `R3-WEB-REFACTOR-001B`.

12. `R3-WEB-REFACTOR-001C`
- Outcome: feature-level render and interaction modules introduced under `app/web/src/features/**`; runtime orchestrators reduced and shared payload normalization unified between `main.tsx` and `live-web-runtime.mjs`.

13. `R6-REVIEW-QA-ENFORCEMENT-001E`
- Outcome: reviewer (`APPROVED`) and QA (`GREEN`) artifacts published for `R3-WEB-REFACTOR-001C`.

14. `WORKSTREAM-3-ENGINEERING-BASELINE`
- Outcome: all Workstream 3 objectives complete (real gates, frontend refactor to feature modules, drift reduction between browser/runtime server paths).

15. `R3-WEB-REACT-001`
- Outcome: migrated `/app/web` from imperative runtime rendering to React/Vite runtime with component-based UI, strict TypeScript checks, and middleware-backed route payload/health endpoints for parity harnesses.

16. `R6-REVIEW-QA-ENFORCEMENT-001F`
- Outcome: reviewer (`APPROVED`) and QA (`GREEN`) artifacts published for `R3-WEB-REACT-001`.

17. `R3-WEB-STRUCTURE-002`
- Outcome: `App.tsx` reduced to orchestration-only entry, feature view logic extracted to `src/features/core/CoreFeatureViews.tsx` and `src/features/extended/ExtendedFeatureViews.tsx`, runtime data split to `src/runtime/data/{contracts,fixtures,resolver}.ts` with facade retained at `src/app/runtime-data.ts`, dead compatibility runtime/render files removed, active web runtime migrated to TypeScript-only source (`allowJs: false`), and legacy style payload moved to `src/shared/styles/legacy-runtime.css`.

18. `R6-REVIEW-QA-ENFORCEMENT-001G`
- Outcome: reviewer (`APPROVED`) and QA (`GREEN`) artifacts published for `R3-WEB-STRUCTURE-002`.

19. `R4-INTEGRATION-PARITY-001A`
- Outcome: integration runtime failure-path coverage implemented and verified for OAuth, SMTP, storage/media upload, external jobs callbacks, and localization settings via dedicated parity runtime gate (`runtime:api:integration`), with source compatibility handlers and runtime API harness aligned on deterministic failure policy.

20. `R6-REVIEW-QA-ENFORCEMENT-001H`
- Outcome: reviewer (`APPROVED`) and QA (`GREEN`) artifacts published for `R4-INTEGRATION-PARITY-001A`.

## Validation Notes

1. `pnpm --dir app install` passes in unrestricted mode; constrained sandbox mode can still fail with DNS/network limits (`ENOTFOUND registry.npmjs.org`).
2. Runtime smoke uses fallback route checks when sandbox blocks port binding (`EPERM 127.0.0.1:5173`).
3. `pnpm --dir app/tests/parity runtime:api:auth`, `runtime:api:wall-feed`, `runtime:api:matrix`, and `runtime:api:integration` require unrestricted execution in this environment due localhost bind restrictions (`EPERM` in sandbox).
