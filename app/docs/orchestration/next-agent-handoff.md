# Next Agent Handoff Plan

Date: `2026-02-21`
Branch: `modernization`
Mode: `post-publish-hardening`

## Objective

Continue post-publish hardening from deployed state:
- staging and production publish commands executed,
- staging and production smoke checks are green,
- next target is remote parity assertions + rollback rehearsal evidence.

## Hard Rules

1. Work only on branch `modernization`.
2. Do not change `/src` or `/build`.
3. Any further publish/rollback commands must capture evidence and deployed version IDs.
4. Keep all work scoped to `/app`.
5. Any new parity claim must keep runtime evidence standard (no offline-only promotion).

## Immediate Execution Queue

1. `POST-R5-001` (`$qa`)
- In scope:
  - Run route-family parity checks against deployed staging + production URLs.
- Acceptance:
  - Remote runtime assertions evidence is added to orchestration docs.

2. `POST-R5-002` (`$platform-devops`)
- In scope:
  - Execute rollback rehearsal for Pages + API deploys and capture timings.
- Acceptance:
  - Rollback evidence recorded with command transcript + restored target versions.

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
- UI matrix state:
  - `115/115` rows `verified`
- API matrix state:
  - `190/190` rows `verified`

## Explicitly Deferred

1. DNS custom-domain traffic switching (outside current execution scope).
2. Data migrations.
