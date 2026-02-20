# Phase Gates

Use this checklist to approve or reject phase completion.

## Gate 0: Baseline and Inventory

- API endpoint matrix exists and maps legacy to modern target.
- UI route/feature matrix exists and maps legacy to modern target.
- Golden fixtures exist for critical flows.
- Phase artifacts linked in `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`.

## Gate 1: Foundation

- Monorepo tooling works on macOS M3.
- Local Docker Compose startup is documented and reproducible.
- CI runs lint, typecheck, unit, and smoke checks.
- No writes to `/src` or `/build`.

## Gate 2: Core Compatibility

- Auth/token flow parity confirmed against legacy behavior.
- Tenant and permission behavior parity confirmed.
- Standard error mapping parity confirmed.
- Core contract tests pass against captured fixtures.

## Gate 3: UI Parity Foundation

- Shared UI primitives reproduce legacy behavior.
- Shell/navigation route behavior matches legacy.
- Animation layer is subtle and respects reduced-motion.
- Visual regression baseline approved.

## Gate 4: Feature Waves

- Wave-scoped API contract tests are 100% passing.
- Wave-scoped e2e tests are 100% passing.
- Visual diffs are approved for changed screens.
- No open P0/P1 defects in wave scope.

## Gate 5: Integrations

- Critical integrations run with staging credentials.
- Error handling paths are tested for outages/timeouts.
- Integration configuration is environment-safe and documented.

## Gate 6: Data and File Migration

- Migration tooling is idempotent.
- At least two dry-runs complete successfully.
- Integrity checks pass for row counts, references, and file checksums.
- Rollback steps are scripted and tested.

## Gate 7: Hardening and UAT

- Full parity matrix is executed and signed off.
- Performance baseline is within accepted thresholds.
- Security checks for auth, permissions, and secrets pass.
- UAT sign-off is recorded.

## Gate 8: Cutover and Hypercare

- Weekend cutover checklist is complete.
- Final migration run completed without critical errors.
- Post-cutover validation suite passes.
- Hypercare monitoring and rollback window are active.
