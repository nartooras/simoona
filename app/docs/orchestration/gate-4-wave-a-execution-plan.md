# Gate 4 Wave A Execution Plan

Date: `2026-02-20`
Phase: `Phase 4 - Feature Porting Waves`
Owner role: `$qa-parity-agent`

## Objective

Define the Wave A quality gate execution path before implementation merges.

## Scope

- Wave A API contract targets from `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-contract-targets.json`
- Wave A planned-response contract baseline from `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-planned-response-contract.json`
- Wave A realtime markers/fixtures from `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-realtime-markers.json`
- Wave A e2e targets from `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/wave-a/wave-a-e2e-targets.json`
- Wave A visual baseline scenarios from `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/visual/baseline-manifest.json`

## Gate 4 Pass Criteria (Wave A Release Candidate)

1. API: `100%` of Wave A contract targets pass against modern endpoints.
2. E2E: `100%` of Wave A e2e targets pass for authenticated user flow.
3. Visual: no unapproved diffs for Wave A changed shell/feed screens at desktop/tablet/mobile.
4. Defects: no open `P0`/`P1` defects tagged `wave-a`.

## Gate 4 Fail Criteria

1. Any Wave A contract target fails.
2. Any mandatory Wave A e2e flow fails.
3. Any visual diff is unresolved or rejected.
4. Any open `P0`/`P1` defect in Wave A scope.

## Verification Command Set

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-scope
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-api
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-planned
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-adapters
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-realtime
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:core
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:targets
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:visual-approvals
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e visual:baseline
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web shell:check
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app verify
```

## Execution Notes

- Run contract and e2e gates on every Wave A merge candidate.
- Keep `contract:wave-a-planned` green until runtime adapters replace planned scaffolds.
- Keep Wave A target manifests updated as routes/endpoints are remapped.
- Escalate immediately when any P0/P1 defect appears in Wave A scope.
- Gate 4 was closed on `2026-02-20` after runtime-backed bundle and changed-screen visual approvals both passed.
