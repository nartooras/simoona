# Gate 8 Cutover and Hypercare Checklist

Date: `2026-02-20`
Phase: `Phase 8 - Weekend Cutover and Hypercare`
Owner role: `$platform-devops-agent` + `$data-migration-agent` + `$qa-parity-agent`
Execution state: `COMPLETE`

## Command Matrix (T-0083 Baseline)

| Order | Group | Owner | Command | Evidence Target |
| --- | --- | --- | --- | --- |
| 1 | `freeze-window-preflight` | `$platform-devops-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict:staging` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-cutover-rehearsal.md` |
| 2 | `final-migration-rehearsal` | `$data-migration-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:002` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-cutover-rehearsal.md` |
| 3 | `migration-validation-suite` | `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:gate6:precheck` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-cutover-rehearsal.md` |
| 4 | `rollback-trigger-drill` | `$data-migration-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:rollback:rehearsal` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-cutover-rehearsal.md` |
| 5 | `traffic-switch-simulation` | `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:runtime-smoke` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-cutover-rehearsal.md` |
| 6 | `post-switch-validation` | `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api test && pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e test` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-cutover-rehearsal.md` |
| 7 | `hypercare-readiness-drill` | `$platform-devops-agent` + `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app verify && pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict:staging` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-hypercare-readiness-drill.md` |

## Checklist

- [x] Weekend cutover checklist is complete
  - Current: `MET`
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-cutover-rehearsal.md`
- [x] Final migration run completed without critical errors
  - Current: `MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:002`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:gate6:precheck`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-cutover-rehearsal.md`
- [x] Post-cutover validation suite passes
  - Current: `MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:runtime-smoke`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api test`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e test`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-cutover-rehearsal.md`
- [x] Hypercare monitoring and rollback window are active
  - Current: `MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app verify`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict:staging`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:rollback:rehearsal`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-8-hypercare-readiness-drill.md`

## QA Decision

- Status: `GREEN`
- Gate recommendation: `GO` for Gate 8 closure

## Findings by Severity

1. `P3` Environment-only port-binding restriction surfaced during one timed smoke attempt.
- Repro:
  - Run `/usr/bin/time -p pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:runtime-smoke` without elevated local bind permissions.
- Expected: command binds to `127.0.0.1:5174` and completes runtime checks.
- Actual: first attempt returned `EPERM`; rerun with elevated permission passed.

## Required Fixes

- None for Gate 8 closure.

## Retest Commands

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict:staging`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:002`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:gate6:precheck`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:rollback:rehearsal`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:runtime-smoke`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api test`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e test`
