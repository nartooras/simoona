# Contracts Package

Canonical shared contracts for API/UI parity work.

## Modules

- `auth.ts`: auth/account request payload contracts.
- `auth-claims.ts`: canonical auth claim keys and auth context shape.
- `permissions.ts`: legacy permission flag constants and guard metadata source.
- `route-map.ts`: shared API/UI route map constants for parity-safe endpoint references.
- `error-envelope.ts`: legacy error envelope schema and constructor helper.

This package is the single source for cross-app parity contracts under `/app`.
