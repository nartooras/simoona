# Next Agent Handoff Plan

Date: `2026-02-22`
Branch: `modernization`
Mode: `parity-recovery-truth-reset`

## Objective

Continue parity recovery from deployed state:
- staging and production are published and reachable,
- root placeholder hotfix is deployed,
- next target is replacing mock-runtime UI/API behavior with source-backed parity implementation.

## Hard Rules

1. Work only on branch `modernization`.
2. Do not change `/src` or `/build`.
3. Do not mark any phase complete from matrix/contracts only; require user-visible runtime parity evidence.
4. Keep all work scoped to `/app`.
5. Any new parity claim must keep runtime evidence standard (no offline-only promotion).

## Immediate Execution Queue

1. `RECOV-R3-013` (`$full-stack-developer`)
- In scope:
  - Replace wall feed + employee list mock/static runtime models with source-backed behavior implementation.
- Acceptance:
  - No placeholder fallback for these routes and behavior is parity-verified at runtime.

2. `RECOV-R3-014` (`$qa` + `$parity-analyst`)
- In scope:
  - Re-verify route families against runtime behavior and screenshots.
- Acceptance:
  - Evidence added for true rendered parity, not contract-only checks.

3. `RECOV-R5-REBASE` (`$simoona-modernization-orchestrator`)
- In scope:
  - Rebase gates to reopened `R3/R5` truth state and drive implementation to genuine parity closure.
- Acceptance:
  - Status/backlog/risks/decisions remain aligned with runtime reality.

## Current Working Evidence

- Wall/feed runtime evidence:
  - `pnpm --dir app/tests/e2e runtime:wall-feed` (`PASS` in unrestricted mode)
- Employee-list runtime evidence:
  - `pnpm --dir app/tests/e2e runtime:employee-list` (`PASS` in unrestricted mode)
- Profile/settings runtime evidence:
  - `pnpm --dir app/tests/e2e runtime:profile-settings` (`PASS` in unrestricted mode)
- Admin runtime evidence:
  - `pnpm --dir app/tests/e2e runtime:admin` (`PASS` in unrestricted mode)
- Auth/Public/Utility runtime evidence:
  - `pnpm --dir app/tests/e2e runtime:auth-utility` (`PASS` in unrestricted mode)
- Client features runtime evidence:
  - `pnpm --dir app/tests/e2e runtime:client-features` (`PASS` in unrestricted mode)
- Foundation verification:
  - `pnpm --dir app verify` (`PASS`, with expected sandbox runtime smoke fallback)
- Latest hold-phase verification refresh:
  - `pnpm --dir app verify` (`PASS`, expected sandbox smoke fallback)
  - `pnpm --dir app deploy:cloudflare:check` (`PASS`)
- Staging deploys:
  - `https://staging.simoona-modern-web.pages.dev`
  - `https://simoona-modern-api-staging.arturas-nikoncukas.workers.dev`
- Production deploys:
  - `https://simoona-modern-web.pages.dev`
  - `https://simoona-modern-api.arturas-nikoncukas.workers.dev`
- Reality checkpoint:
  - Deployed app is reachable and no longer blank at root after hotfix.
  - Implementation remains mock-heavy and requires parity recovery before any release-ready claims.

## Explicitly Deferred

1. DNS custom-domain traffic switching (outside current execution scope).
2. Data migrations.
3. Any final GO-LIVE declaration.
