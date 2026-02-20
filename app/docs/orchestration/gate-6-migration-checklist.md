# Gate 6 Migration Checklist

Date: `2026-02-20`
Phase: `Phase 6 - Data and File Migration`
Owner role: `$qa-parity-agent` + `$data-migration-agent`
Execution state: `COMPLETE`

## Checklist

- [x] Migration tooling is idempotent
  - Current: `MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:002`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-002-integrity-report.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/migration-dry-run-contract.json`
- [x] At least two dry-runs complete successfully
  - Current: `MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:001`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:002`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-001-integrity-report.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-002-integrity-report.md`
- [x] Integrity checks pass for row counts, references, and file checksums
  - Current: `MET`
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-001-integrity-report.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-002-integrity-report.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/migration-snapshot-baseline.json`
- [x] Rollback steps are scripted and tested
  - Current: `MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:rollback:rehearsal`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/rollback-rehearsal-001.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/scripts/run-migration-rollback-rehearsal.mjs`

## QA Decision

- Status: `GREEN`
- Gate recommendation: `GO` for Gate 6 closure

## Findings by Severity

1. `P2` Rehearsal evidence is bounded to current migration scope (`identity/org + Wave A + notifications`)
- Repro:
  - Review dry-run reports and snapshot contract scope
- Expected: bounded rehearsal scope closes Gate 6 for current migration objective
- Actual: scope is bounded and valid; full production-scale rehearsal remains a later cutover hardening activity

## Required Fixes

- None for Gate 6 closure.

## Retest Commands

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:001`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:002`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:rollback:rehearsal`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:gate6:precheck`
