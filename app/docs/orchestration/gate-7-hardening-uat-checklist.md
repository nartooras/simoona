# Gate 7 Hardening and UAT Checklist

Date: `2026-02-20`
Phase: `Phase 7 - Hardening and UAT`
Owner role: `$qa-parity-agent` + `$platform-devops-agent`
Execution state: `COMPLETE`

## Regression Command Matrix (T-0080 Baseline)

| Order | Group | Owner | Command | Evidence Target |
| --- | --- | --- | --- | --- |
| 1 | `parity-core` | `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:core` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-uat-signoff-rehearsal.md` |
| 2 | `parity-wave-a` | `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-adapters && pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-realtime` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-uat-signoff-rehearsal.md` |
| 3 | `performance-baseline` | `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:runtime-smoke` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-performance-baseline.md` |
| 4 | `security-auth-boundary` | `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:auth` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-security-hardening-pack.md` |
| 5 | `security-permission-enforcement` | `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:tenant-permission` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-security-hardening-pack.md` |
| 6 | `security-secret-handling` | `$platform-devops-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict:staging` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-security-hardening-pack.md` |
| 7 | `uat-signoff-pack` | `$qa-parity-agent` | `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api test && pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e test` | `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-uat-signoff-rehearsal.md` |

## Checklist

- [x] Full parity matrix execution sign-off recorded
  - Current: `MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:core`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-adapters`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-realtime`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-uat-signoff-rehearsal.md`
- [x] Performance baseline is within accepted thresholds
  - Current: `MET`
  - Acceptance threshold:
    - runtime smoke startup readiness completes within built-in `20s` timeout
    - route checks pass for `/`, `/profile`, `/Wall/Feed`, `/Settings/Notifications`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:runtime-smoke`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-performance-baseline.md`
- [x] Security checks for auth, permissions, and secret handling pass
  - Current: `MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:auth`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:tenant-permission`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict:staging`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-security-hardening-pack.md`
- [x] UAT sign-off rehearsal is recorded
  - Current: `MET`
  - Evidence:
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api test`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e test`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-uat-signoff-rehearsal.md`

## QA Decision

- Status: `GREEN`
- Gate recommendation: `GO` for Gate 7 closure

## Findings by Severity

1. `P3` Runtime warns about module-type metadata in type-stripping mode.
- Repro:
  - Run `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e test`.
- Expected: command pack passes and warnings remain informational.
- Actual: command pack passes; warnings are informational and non-blocking.

## Required Fixes

- None for Gate 7 closure.

## Retest Commands

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:auth`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:tenant-permission`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict:staging`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:runtime-smoke`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api test`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e test`
