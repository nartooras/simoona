# Phase 2 Core Compatibility Plan

Date: `2026-02-20`

## Objective

Deliver core compatibility boundaries for auth/token, tenant context, permissions, and legacy error contracts before feature-wave migration.

## Workstream slices

1. Auth/token compatibility
- Scope:
  - `/app/api/src/modules/core/auth/**`
  - `/app/packages/contracts/auth.ts`
  - auth rows in `/app/docs/parity/api-endpoint-matrix.csv`
- Exit signal:
  - runnable parity assertions for auth/token fixtures

2. Tenant + permission compatibility
- Scope:
  - `/app/api/src/modules/core/tenant/**`
  - `/app/api/src/modules/core/permissions/**`
- Exit signal:
  - deterministic permission + tenant behavior checks against legacy expectations

3. Legacy error mapping compatibility
- Scope:
  - `/app/api/src/modules/core/errors/**`
- Exit signal:
  - reproducible error payload assertions for known auth/permission failures

4. Contract harness expansion
- Scope:
  - `/app/tests/parity/contracts/**`
  - `/app/tests/parity/fixtures/**`
- Exit signal:
  - auth/token + tenant/permission + error-path contract checks green

## Sequence

1. Complete auth contract assertions (`T-0015`).
2. Expand token/login parity mappings.
3. Add tenant/permission/error assertions.
4. Run Gate 2 incremental checklist.
