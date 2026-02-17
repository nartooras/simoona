# ADR 0001: Modernization Structure

- Status: Accepted

## Context

Modernization work is active while legacy systems remain in production use. Without explicit structure and boundaries, threads can drift in folder layout, dependency direction, and migration decisions.

## Decision

- Use `modern/**` as the primary modernization workspace.
- Place deployable apps in `modern/apps/*`.
- Place reusable shared code in `modern/packages/*`.
- Place modern-focused tests in `modern/tests/*`.
- Keep architecture baseline in `modern/docs/architecture.md`.
- Enforce dependency direction:
  - Apps may depend on packages.
  - Packages may not depend on apps.
  - Tests may depend on apps/packages.
  - `modern/**` must not import/reference legacy `src/**`.

## Consequences

- Thread output remains consistent and reviewable.
- Risk of accidental coupling to legacy internals is reduced.
- Migration decisions become easier to reason about and enforce.
- Some short-term duplication is acceptable to preserve boundaries.

## Alternatives Considered

- Keep structure conventions informal in PR comments only.
  - Rejected: too easy to drift and hard to audit.
- Allow direct modern-to-legacy imports for speed.
  - Rejected: increases coupling and migration reversal risk.
- Merge modern and legacy code in shared folders.
  - Rejected: obscures runtime boundaries and slows phased migration.
