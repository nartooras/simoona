# ADR 0002: Read-Only-First Data Migration

- Status: Accepted

## Context

Modern API capabilities are being introduced incrementally against an existing legacy database and domain model. Early write-path migration carries high risk due to ownership ambiguity, invariants, and rollback complexity.

## Decision

- Adopt a read-only-first migration strategy for data access in modern APIs.
- Prioritize contract-compatible read endpoints before introducing writes.
- Treat write-path migration as a separate decision stream requiring explicit ADRs.
- Keep legacy database/system behavior unchanged during read-first phase.

## Consequences

- Reduced risk for early modernization releases.
- Faster validation of modern API contracts and tenant/auth assumptions.
- Write capabilities take longer and require additional design work.
- Temporary dual-path complexity remains until write strategy is defined.

## Alternatives Considered

- Migrate reads and writes simultaneously.
  - Rejected: too much coupled risk for early migration phases.
- Build a new database first, then migrate all consumers.
  - Rejected: high upfront cost and delayed delivery of incremental value.
- Proxy all modern reads through legacy API only.
  - Rejected: limits direct modernization of API/data boundaries and observability.
