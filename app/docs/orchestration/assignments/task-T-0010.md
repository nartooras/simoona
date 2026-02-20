# Task Assignment `T-0010`

- Date assigned: `2026-02-20`
- Owner role: `$api-compat-agent`
- Phase: `Phase 2 - Core Compatibility Layer`
- Priority: `P0`
- Status: `READY`

## Objective

Create the initial core auth/token compatibility scaffold in `/app/api` for legacy parity planning.

## Scope In

- `/Users/arturasnikoncukas/code/repo/simoona/app/api/**`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/**`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv` (mapping updates only)

## Scope Out

- Any changes under `/Users/arturasnikoncukas/code/repo/simoona/src/**`
- Any changes under `/Users/arturasnikoncukas/code/repo/simoona/build/**`
- UI implementation in `/Users/arturasnikoncukas/code/repo/simoona/app/web/**`

## Constraints

- Contract-first behavior for auth endpoints.
- Keep endpoint parity metadata explicit in matrix updates.
- No unrelated refactors.

## Acceptance Criteria

1. API scaffold includes explicit module boundary for auth/token compatibility.
2. Parity matrix rows for `Account/*` auth endpoints have planned `modern_module` and `modern_handler` values.
3. Command contract gates still pass from `/app` after scaffolding.

## Validation Commands

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app lint
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app typecheck
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app test
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app build
rg -n "^AccountController," /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv
```
