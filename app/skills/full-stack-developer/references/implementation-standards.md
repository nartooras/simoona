# Implementation Standards

Apply these standards when writing code under `/app`.

## General

- Prefer clarity over cleverness.
- Keep modules cohesive and responsibilities explicit.
- Avoid hidden side effects and implicit contracts.
- Add concise comments only where logic is non-obvious.

## Frontend (React + TypeScript)

- Use typed props and typed API client contracts.
- Keep route behavior aligned with legacy flows.
- Preserve screen information hierarchy and user actions.
- Use subtle animations only; respect reduced-motion.
- Keep components focused and reusable.

## Backend (NestJS + TypeScript)

- Keep modules feature-oriented.
- Use DTO validation at controller boundaries.
- Keep authorization and tenant context explicit.
- Normalize errors into parity-compatible response shapes.
- Avoid breaking existing HTTP contract expectations.

## Data and Integration

- Prefer idempotent operations for migration/replay safety.
- Preserve semantic behavior for existing schema contracts.
- Guard external calls with timeout/retry where appropriate.
- Emit actionable logs for migration and debugging workflows.

## Tests

- Add tests for new behavior and changed behavior.
- Add regression tests for bug fixes.
- Update contract tests when behavior mappings are added.
- Keep tests deterministic and environment-aware.
