# Gate 2 Core Compatibility Checklist

Date: `2026-02-20`
Phase: `Phase 2 - Core Compatibility Layer`

## Checklist

- [x] Auth/token flow parity confirmed against legacy behavior
  - Current: scaffold + fixture contracts with runnable assertions in place
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/auth-compatibility.module.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/auth/auth-contract-baseline.json`
- [x] Tenant and permission behavior parity confirmed
  - Current: middleware + guard scaffolds validated by fixture assertions
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/tenant/tenant-context.middleware.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/permissions/legacy-permission.guard.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/tenant-permission-baseline.json`
- [x] Standard error mapping parity confirmed
  - Current: mapper/filter scaffolds validated by error-shape assertions
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/errors/legacy-error.mapper.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/errors/legacy-error.filter.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/error-shape-baseline.json`
- [x] Core contract tests pass against captured fixtures
  - Current: `contract:core` aggregate command passes auth + tenant/permission + error-shape checks
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/package.json`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-auth-fixture-map.mjs`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-tenant-permission-contract.mjs`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-error-shape-contract.mjs`
- [x] Legacy response/date/pagination conventions middleware wired
  - Current: conventions middleware/interceptors are scaffolded and wired via bootstrap + module path
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/conventions/legacy-pagination.middleware.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/conventions/legacy-date-serialization.interceptor.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/conventions/legacy-response-envelope.interceptor.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-compatibility-conventions-contract.mjs`
- [x] Web shell reproduces legacy entry/login/org switch behaviors
  - Current: shell auth boundary and tenant-aware route container baseline added with passing shell checks
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/README.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/auth-boundary.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/tenant-route-container.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-shell-foundation-links.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/verify-web-shell-foundation.mjs`

## Current recommendation

- Gate status recommendation: `COMPLETE`
