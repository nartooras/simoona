# Auth Contract Harness Skeleton

This folder hosts the initial auth contract harness wiring for Phase 2.

## Inputs

- Legacy fixture index:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md`
- Fixture mapping:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/auth/auth-fixture-map.json`
- Baseline expectations:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/auth/auth-contract-baseline.json`

## Validation

Run from repository root:

```bash
pnpm --dir app/tests/parity contract:auth
```

Current assertions verify:

- mapped fixture files exist and can be parsed
- fixture IDs/routes match baseline expectations
- compatibility keys are present in API auth compatibility service source
