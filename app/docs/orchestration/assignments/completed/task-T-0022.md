# Task Assignment `T-0022`

- Date assigned: `2026-02-20`
- Owner role: `$qa-parity-agent`
- Phase: `Phase 2 - Core Compatibility Layer`
- Priority: `P0`
- Status: `COMPLETED`

## Objective

Add a single aggregate contract command to run all core compatibility parity assertions.

## Completion Notes

- Completed on: `2026-02-20`
- Artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-auth-fixture-map.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-tenant-permission-contract.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-error-shape-contract.mjs`
- Result:
  - `contract:core` command now executes auth, tenant/permission, and error-shape checks and returns green.
