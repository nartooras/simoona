# Gate 5 Integration Checklist

Date: `2026-02-20`
Phase: `Phase 5 - Integration Parity`
Owner role: `$qa-parity-agent`
Execution state: `IN_PROGRESS` (Gate 3 and Gate 4 re-closed; Phase 5 resumed)

## Checklist

- [ ] Critical integrations run with staging credentials
  - Current: `NOT_MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict` (fails)
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/integration-inventory-matrix.md`
- [ ] Error handling paths tested for outages/timeouts
  - Current: `NOT_MET`
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-smoke-contract.json`
    - failure-path checks are not implemented for live providers yet
- [x] Integration configuration is environment-safe and documented
  - Current: `MET`
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/integration-smoke-runbook.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-smoke-contract.json`

## QA Decision

- Status: `RED`
- Gate recommendation: `NO-GO` for Gate 5 closure

## Findings by Severity

1. `P1` Missing gate-critical staging credentials for OAuth/SMTP/storage/external-jobs
- Repro:
  - Run `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict`
- Expected: strict smoke passes with all gate-critical providers `ready`
- Actual: strict smoke fails with `missing` statuses for all gate-critical providers

2. `P1` Live failure-path verification is not yet implemented
- Repro:
  - Review integration smoke contract and runbook
- Expected: documented + executable timeout/outage checks for critical integrations
- Actual: baseline contract exists, but failure-path execution tests are pending

## Required Fixes

1. Provision and inject secret references + non-secret env values for gate-critical integrations in staging-safe manner.
2. Add provider-specific read-only failure-path checks (timeout/auth failure simulation where possible).
3. Re-run strict integration smoke and update Gate 5 checklist.

## Retest Commands

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict`
