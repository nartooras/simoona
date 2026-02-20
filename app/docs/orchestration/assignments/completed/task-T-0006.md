# Task Assignment `T-0006`

- Date assigned: `2026-02-20`
- Owner role: `$parity-analyst`
- Phase: `Phase 0 - Parity Baseline and Inventory`
- Priority: `P0`
- Status: `COMPLETED`

## Objective

Capture and index critical-flow golden fixtures required to complete Gate 0 baseline evidence.

## Scope In

- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md` (entry linkage)
- Reference-only analysis from:
  - `/Users/arturasnikoncukas/code/repo/simoona/src/api/**`
  - `/Users/arturasnikoncukas/code/repo/simoona/src/webapp/**`

## Scope Out

- Any modifications under `/Users/arturasnikoncukas/code/repo/simoona/src/**`
- Any modifications under `/Users/arturasnikoncukas/code/repo/simoona/build/**`
- Implementation of modern API/web features

## Constraints

- Keep all new artifacts under `/Users/arturasnikoncukas/code/repo/simoona/app`.
- For each fixture entry, specify capture source and storage location.
- Use domain headings exactly: `auth`, `wall`, `profile`, `admin`, `premium`.

## Acceptance Criteria

1. `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md` exists.
2. The fixture index contains sections:
   - `## auth`
   - `## wall`
   - `## profile`
   - `## admin`
   - `## premium`
3. Each section contains at least one fixture entry with:
   - legacy endpoint or route
   - expected request/response or UI behavior summary
   - artifact path placeholder under `/app/tests/parity/fixtures`
4. `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md` includes an entry linking this fixture index.

## Validation Commands

```bash
test -s /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md
rg -n "^## (auth|wall|profile|admin|premium)$" /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md
rg -n "/app/tests/parity/fixtures" /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md
```

## Completion Notes

- Completed on: `2026-02-20`
- Artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md`
- Validation result:
  - required sections present: `auth`, `wall`, `profile`, `admin`, `premium`
  - fixture paths referenced under `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures`
