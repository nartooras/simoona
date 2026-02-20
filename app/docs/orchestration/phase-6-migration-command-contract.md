# Phase 6 Migration Command Contract (`T-0077`)

Date: `2026-02-20`
Phase: `Phase 6 - Data and File Migration`
Owner role: `$data-migration-agent`

## Objective

Define a deterministic command contract for migration dry-runs, idempotency checks, rollback rehearsal, and Gate 6 precheck readiness.

## Contract Sources

- `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/migration-dry-run-contract.json`
- `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/migration-snapshot-baseline.json`

## Commands

Run from repository root:

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:001
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:002
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:rollback:rehearsal
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:gate6:precheck
```

## Invariant Enforcement

### Idempotency

- Re-running dry-run on the same snapshot must preserve row totals.
- Dry-Run 002 validates idempotency against Dry-Run 001 evidence.

### Rollback Safety

- Rollback steps are deterministic and scripted.
- Post-rollback validation must pass before Gate 6 can be recommended `GO`.

### Integrity Coverage

- Row count checks
- Referential consistency checks
- Critical domain checks
- File/media checksum checks

## Required Evidence Artifacts

- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/staging-clone-access.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-001-integrity-report.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-002-integrity-report.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/rollback-rehearsal-001.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-6-migration-checklist.md`

## Alignment Notes

- Scope and prerequisites are aligned with `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/phase-6-dry-run-plan-v1.md`.
- This contract introduces executable command gates without changing Phase 6 scope boundaries.
