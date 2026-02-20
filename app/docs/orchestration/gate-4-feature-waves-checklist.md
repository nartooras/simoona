# Gate 4 Feature Waves Checklist

Date: `2026-02-20`
Phase: `Phase 4 - Feature Porting Waves`
Re-opened: `2026-02-20` (Wave A UI runtime requirement missing from prior closure)
Re-closed: `2026-02-20` (runtime-backed UI evidence added)

## Checklist

- [x] Wave-scoped API contract tests are 100% passing
  - Current: runtime-backed Wave A API harness bundle (`contract:wave-a-scope|api|planned|adapters|realtime|core`) passed on `2026-02-20`
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-api-scope.csv`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-contract-targets.json`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-planned-response-contract.json`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-realtime-markers.json`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-wave-a-api-scaffold.mjs`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-wave-a-planned-responses.mjs`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-wave-a-adapter-boundaries.mjs`
- [x] Wave-scoped e2e tests are 100% passing against live web runtime
  - Current: `MET` (`wave-a:runtime-smoke` executes runtime route checks against running web process)
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/wave-a/wave-a-e2e-targets.json`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/scripts/verify-wave-a-runtime-smoke.mjs`
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:runtime-smoke` -> PASS
- [x] Wave A UI routes are validated in a running browser/runtime process
  - Current: `MET`
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/package.json`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-wave-a-execution-plan.md`
    - HTTP `200` route checks for `/`, `/profile`, `/Wall/Feed`, `/Settings/Notifications`
- [x] Visual diffs are approved for changed screens
  - Current: Wave A changed-screen approval pack is complete with desktop/tablet/mobile approvals and zero unresolved diffs
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/visual/baseline-manifest.json`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/visual/wave-a-changed-screen-approvals.json`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-visual-approval-pack.md`
- [x] No open P0/P1 defects in wave scope
  - Current: Gate 4 closure review found no open Wave A `P0/P1` defects on `2026-02-20`
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/risks.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-wave-a-execution-plan.md`

## Current recommendation

- Gate status recommendation: `COMPLETE`

## Required closure evidence (new mandatory)

- live web runtime startup evidence:
  - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web dev`
- runtime-backed Wave A route checks:
  - executable browser/runtime checks for `/Wall/Feed` and `/Settings/Notifications`
- QA record linking runtime web evidence to Wave A target IDs and changed-screen approvals

## Closure decision

- QA decision: `GREEN`
- Notes:
  - Runtime-backed e2e evidence now exists and is linked to Wave A targets and visual approvals.
