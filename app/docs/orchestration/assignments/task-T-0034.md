# Task Assignment `T-0034`

- Date assigned: `2026-02-20`
- Owner role: `$parity-analyst-agent`
- Phase: `Phase 4 - Feature Porting Waves`
- Priority: `P0`
- Status: `READY`

## Objective

Build Wave A (Social Core) scope-to-contract mapping pack for first feature-wave implementation.

## Scope In

- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-route-matrix.csv`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/**`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/**`

## Scope Out

- Any changes under `/Users/arturasnikoncukas/code/repo/simoona/src/**`
- Any changes under `/Users/arturasnikoncukas/code/repo/simoona/build/**`
- Wave implementation code for domains outside scope mapping baseline

## Acceptance Criteria

1. Wave A scope pack explicitly lists included API endpoints and UI routes from parity matrices.
2. Wave A contract/e2e target artifacts are linked with clear ownership and dependencies.
3. Existing Phase 3 validation commands remain green after documentation updates.

## Validation Commands

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web shell:check
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:core
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app verify
```
