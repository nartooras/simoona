# ADR 0003: Auth Migration Strategy

- Status: Accepted

## Context

Legacy authentication/authorization in `src/api/**` relies on OWIN OAuth/cookie flows, organization-aware middleware, and custom permission checks. Modern API work in `modern/apps/api/**` already enforces authenticated access for protected endpoints but still uses transitional patterns (for example header-based org context and development/testing user-id fallback).

Modernization requires a clear, enforceable direction for auth migration that preserves tenant/organization security boundaries while supporting incremental delivery.

## Decision

- Adopt `modern/docs/auth-migration.md` as the authoritative auth migration strategy for modernization threads.
- Standardize on modern JWT-based authentication with policy-based authorization and canonical identity claims (`sub`, `org_id`, `tenant_id`, plus standard JWT validation claims).
- Treat token claims as authoritative identity scope; client-supplied org/tenant headers are request context and must be validated against claims.
- Enforce deterministic org/tenant conflict handling (reject mismatches; no silent fallback).
- Limit header-based user identity fallback to local/testing or explicitly declared compatibility phases; disallow in staging/production.
- Execute migration in explicit phases with exit criteria, cutover controls, rollback triggers, and security test requirements.

## Consequences

- Security posture improves by reducing tenant spoofing and confused-deputy risk.
- Auth behavior becomes more consistent across modern endpoints through shared policies and canonical claims.
- Migration speed may be lower initially due to required policy mapping, observability, and phased controls.
- Some temporary compatibility logic remains during transition and must be tightly constrained.

## Alternatives Considered

- Keep legacy claim/header behavior as-is while modern endpoints grow ad hoc.
  - Rejected: increases inconsistency and long-term security risk.
- Migrate all auth behavior in one cutover release.
  - Rejected: too risky for tenant/org isolation and operational rollback.
- Defer auth strategy until write-path migration is complete.
  - Rejected: auth and tenant boundaries are prerequisite guardrails for safe endpoint migration.
