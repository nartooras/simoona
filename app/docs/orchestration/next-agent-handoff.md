# Next Agent Handoff Plan

Date: `2026-02-21`
Branch: `modernization`
Mode: `ui-parity-recovery`

## Objective

Continue real UI parity implementation from current working baseline:
- wall/feed route family is implemented with legacy-like shell and interactions,
- employee-list route family is implemented with filter/sort/pagination,
- profile/settings route families are implemented with route-specific views and interactions,
- admin route family is implemented with route-specific list/form behaviors and runtime evidence,
- auth/public/utility route family is implemented with route-specific auth/system views and runtime evidence,
- remaining route families still require parity implementation.

## Hard Rules

1. Work only on branch `modernization`.
2. Do not change `/src` or `/build`.
3. Do not execute Cloudflare publish/deploy commands without explicit user approval.
4. Keep all work scoped to `/app`.
5. Do not mark UI matrix rows `verified` without route-family runtime evidence.

## Immediate Execution Queue

1. `RECOV-R3-011` (`$full-stack-developer`)
- In scope:
  - Implement next remaining client route-family parity wave:
    - `events`, `kudos`, `books`, `projects`, `service requests`, `vacation`,
    - `committees`, `office`, `organizational structure`, `submit ticket`,
    - remaining wall sub-routes (`create/edit/list/members`).
- Acceptance:
  - Legacy URLs unchanged.
  - Route-family runtime evidence captured for implemented scope.

2. `RECOV-R3-012` (`$qa` + `$parity-analyst`)
- In scope:
  - Add dedicated runtime evidence harness for `RECOV-R3-011` scope and promote only covered matrix rows.
- Acceptance:
  - No blanket `verified` promotion without route-family runtime evidence.

3. `RECOV-R4-PLAN-HOLD` (`$platform-devops`)
- In scope:
  - Keep publish/deploy path deferred until `R3` completion.
- Acceptance:
  - No publish commands executed.

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
- Foundation verification:
  - `pnpm --dir app verify` (`PASS`, with expected sandbox runtime smoke fallback)
- UI matrix state:
  - `81/115` rows `verified`
  - `34/115` rows `implemented` (pending runtime evidence)

## Explicitly Deferred

1. Cloudflare publish/deploy execution.
2. Final release-readiness (`R5`) gate.
3. Any claim that UI parity is complete across all `115` routes.
