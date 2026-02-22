# Backlog

Modernization source-of-truth backlog for full-parity recovery (`R0` to `R5`).

## Priority Queue

1. `R2-AUTH-REAL-001B` (`P0`, owner `$full-stack-developer`)
- Scope:
  - Replace seeded runtime auth/session backing with SQL-backed identity and session resolution.
  - Remove synthetic authenticated fallback for unresolved `x-legacy-user-id`.
- Acceptance:
  - Auth source for protected routes resolves from SQL-compatible identity/session state.
  - Unresolved user headers do not silently grant authenticated access.

2. `R3-WEB-REFACTOR-001B` (`P0`, owner `$full-stack-developer`)
- Scope:
  - Continue decomposing `app/web/src/main.tsx` into feature modules.
  - Remove remaining drift between browser runtime rendering and runtime server payload generation.
- Acceptance:
  - Main runtime module decomposition complete for wall, employee list, auth utility, profile/settings, and admin slices.

3. `R3-FEATURE-WAVE-D` (`P0`, owner `$full-stack-developer`)
- Scope:
  - Full parity for feature domains previously treated as gated scope:
    events, kudos, lotteries, vacations, service requests, books, projects, committees, office map, organizational structure, submit ticket, widgets.
- Acceptance:
  - Runtime behavior parity and tests pass for all domains.

4. `R4-INTEGRATION-PARITY-001` (`P0`, owner `$platform-devops` + `$full-stack-developer`)
- Scope:
  - Integration parity for OAuth, SMTP, storage/media, external callbacks, localization, background jobs.
- Acceptance:
  - Failure-path coverage and runtime evidence captured.

5. `R6-REVIEW-QA-ENFORCEMENT-001` (`P0`, owner `$reviewer` + `$qa`)
- Scope:
  - Produce review and QA reports for each implementation slice before closure.
- Acceptance:
  - Reviewer decision `APPROVED` exists before QA.
  - QA decision `GREEN` exists before merge/closure.

6. `R5-RELEASE-UNFREEZE-001` (`P0`, owner `$qa` + `$reviewer` + `$simoona-modernization-orchestrator`)
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

## Validation Notes

1. `pnpm --dir app install` currently fails in sandbox (`ENOTFOUND registry.npmjs.org`), but remaining validation gates run successfully.
2. Runtime smoke uses fallback route checks when sandbox blocks port binding (`EPERM 127.0.0.1:5173`).
3. `pnpm --dir app/tests/parity runtime:api:auth` requires unrestricted execution in this environment due localhost bind restrictions (`EPERM 127.0.0.1:4313` in sandbox).
