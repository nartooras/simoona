# CI Pipeline Contract (Phase 1 Baseline)

This contract defines the minimum CI steps for the empty `/app` skeleton.

## Required steps

Run from repository root:

```bash
bash app/infra/ci/run-foundation-ci.sh
pnpm --dir app build
```

## Expected result

- All commands pass on macOS M3 local environment.
- Same command sequence is used by CI wiring for the modern app workspace.

## Transition rule

When web/api implementation begins, replace placeholder checks with real lint/typecheck/test/build jobs while preserving command names.
