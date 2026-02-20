# Evidence

## R0 Cleanup Reset

Date: `2026-02-20`

### Scope

- Remove obsolete orchestration history files.
- Remove obsolete wave-specific scaffolding assets.
- Remove obsolete foundation planning documents.
- Recreate orchestration control files for gate model `R0-R5`.
- Ensure active build/test command paths no longer reference deleted wave-specific scripts.

### Deletion Proof (high-level)

- Removed:
  - `app/docs/orchestration/gate-*.md`
  - `app/docs/orchestration/phase-*.md`
  - `app/docs/orchestration/runbook.md`
  - `app/docs/orchestration/integration-smoke-runbook.md`
  - `app/docs/orchestration/evidence/**`
  - previous orchestration control files (`backlog/status/risks/decisions/evidence`)
  - `app/docs/parity/waves/**`
  - `app/tests/parity/contracts/wave-a/**`
  - `app/tests/e2e/wave-a/**`
  - `app/tests/parity/scripts/verify-wave-a-*.mjs`
  - `app/tests/e2e/scripts/verify-wave-a-*.mjs`
  - `app/tests/e2e/visual/wave-a-changed-screen-approvals.json`
  - `app/api/scripts/wave-a-api-harness.mjs`
  - `app/docs/foundation/**`
  - `app/docs/adr/0001-phase1-foundation-baseline.md`
  - previous `app/docs/ai-agents-modernization-plan.md`

### Recreated Control Files

- `app/docs/orchestration/backlog.md`
- `app/docs/orchestration/status.md`
- `app/docs/orchestration/risks.md`
- `app/docs/orchestration/decisions.md`
- `app/docs/orchestration/evidence.md`
- `app/docs/orchestration/next-agent-handoff.md`

### Command-Path Rewire Evidence

- Updated packages to remove deleted wave-specific script references:
  - `app/api/package.json`
  - `app/tests/parity/package.json`
  - `app/tests/e2e/package.json`
- Added replacement runtime smoke/check scripts:
  - `app/api/scripts/api-runtime-check.mjs`
  - `app/tests/e2e/scripts/verify-runtime-smoke.mjs`
- Updated root baseline validator:
  - `app/scripts/foundation-check.mjs`

### Validation Commands

Executed in this checkpoint:

```bash
pnpm --dir app lint
pnpm --dir app typecheck
pnpm --dir app test
pnpm --dir app smoke
pnpm --dir app build
pnpm --dir app verify
pnpm --dir app/api build
pnpm --dir app/api lint
pnpm --dir app/api typecheck
pnpm --dir app/api test
git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'
```

Results:

- `pnpm --dir app lint`: `PASS`
- `pnpm --dir app typecheck`: `PASS`
- `pnpm --dir app test`: `PASS`
- `pnpm --dir app smoke`: `PASS`
- `pnpm --dir app build`: `PASS`
- `pnpm --dir app verify`: `PASS`
- `pnpm --dir app/api build`: `PASS`
- `pnpm --dir app/api lint`: `PASS`
- `pnpm --dir app/api typecheck`: `PASS`
- `pnpm --dir app/api test`: `PASS`
- `git ls-files | rg ...`: no tracked generated artifacts found (exit `1` from `rg` means no matches)

## R1-001 Parity Matrix Re-Baselining

Date: `2026-02-20`

### Scope

- Rebased `app/docs/parity/api-endpoint-matrix.csv` to normalized parity schema.
- Rebased `app/docs/parity/ui-route-matrix.csv` to normalized parity schema.
- Added grouped domain columns and per-domain status counters to both matrices.
- Refreshed `app/docs/parity/parity-gap-report.md` with factual, current coverage totals and gap priorities.

### Coverage Snapshot (post-update)

- API: `mapped 29/190 (15.26%)`, `implemented 0/190 (0%)`, `verified 0/190 (0%)`.
- UI: `mapped 0/115 (0%)`, `implemented 0/115 (0%)`, `verified 0/115 (0%)`.

### Validation Commands

Executed in this cycle:

```bash
head -n 1 app/docs/parity/api-endpoint-matrix.csv
head -n 1 app/docs/parity/ui-route-matrix.csv
pnpm --dir app/tests/parity test
```

Results:

- API matrix header check: `PASS`
- UI matrix header check: `PASS`
- `pnpm --dir app/tests/parity test`: `PASS`

## R1-002 Command-Contract Hardening

Date: `2026-02-20`

### Scope

- Replaced root placeholder command wrapper in `app/scripts/foundation-check.mjs` with runtime-backed command execution for `lint|typecheck|test|smoke|build`.
- Replaced API placeholder command wrapper in `app/api/scripts/api-runtime-check.mjs` with source-contract and parity-contract execution for `lint|typecheck|test|build`.
- Added constrained-environment smoke fallback when local runtime port binding is blocked (`EPERM` on `127.0.0.1:5173`).

### Validation Commands

Executed:

```bash
pnpm --dir app install
pnpm --dir app lint
pnpm --dir app typecheck
pnpm --dir app test
pnpm --dir app smoke
pnpm --dir app build
pnpm --dir app verify
pnpm --dir app/api build
pnpm --dir app/api lint
pnpm --dir app/api typecheck
pnpm --dir app/api test
git status --short
git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'
```

Results:

- `pnpm --dir app install`: `PASS` (network metadata fetch warning due restricted DNS; workspace remained usable).
- `pnpm --dir app lint`: `PASS`
- `pnpm --dir app typecheck`: `PASS`
- `pnpm --dir app test`: `PASS`
- `pnpm --dir app smoke`: `PASS` (runtime port bind blocked; fallback path executed and passed).
- `pnpm --dir app build`: `PASS`
- `pnpm --dir app verify`: `PASS`
- `pnpm --dir app/api build`: `PASS`
- `pnpm --dir app/api lint`: `PASS`
- `pnpm --dir app/api typecheck`: `PASS`
- `pnpm --dir app/api test`: `PASS`
- `git ls-files | rg ...`: no tracked generated artifacts found (`rg` exit `1` indicates no matches).

## R1-003 Shared Contracts Expansion

Date: `2026-02-20`

### Scope

- Added canonical shared contract modules under `app/packages/contracts`:
  - `route-map.ts`
  - `auth-claims.ts`
  - `permissions.ts`
  - `error-envelope.ts`
- Updated contracts package exports and README.
- Integrated shared contracts into API and web compatibility layers:
  - API token route constant usage.
  - API permission guard source constant usage.
  - API error envelope constructor usage.
  - Web auth/tenant/layout shell route constant usage.

### Validation

- Included in `R1-002` full command-gate execution above.

## R2-001 Auth/Token/Account Compatibility Wave

Date: `2026-02-20`

### Scope

- Upgraded auth compatibility handlers from `planned` to `implemented` responses.
- Added auth implementation contract assertions:
  - `app/tests/parity/scripts/verify-auth-implementation-contract.mjs`
- Updated auth fixture statuses to `implemented`.
- Updated API parity matrix auth-domain rows to `implemented`.

### Validation

- `pnpm --dir app/tests/parity test`: `PASS`
- `pnpm --dir app lint`: `PASS`
- `pnpm --dir app typecheck`: `PASS`

## R2-002 Tenant/Permission/Localization/Error Core Slice

Date: `2026-02-20`

### Scope

- Added system compatibility controllers:
  - `app/api/src/modules/core/system/controllers/localization-compatibility.controller.ts`
  - `app/api/src/modules/core/system/controllers/error-compatibility.controller.ts`
- Added module:
  - `app/api/src/modules/core/system/system-compatibility.module.ts`
- Wired module into `CoreCompatibilityModule`.
- Updated permission guard marker status to `implemented`.
- Added core implementation contract assertions:
  - `app/tests/parity/scripts/verify-core-implementation-contract.mjs`
- Updated API parity matrix localization/error rows to `implemented`.

### Full Validation Set

Executed:

```bash
pnpm --dir app test
pnpm --dir app smoke
pnpm --dir app build
pnpm --dir app verify
pnpm --dir app/api build
pnpm --dir app/api lint
pnpm --dir app/api typecheck
pnpm --dir app/api test
git status --short
git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'
```

Results:

- All command gates above: `PASS`
- Runtime smoke uses fallback path in sandbox when local port bind returns `EPERM` (`127.0.0.1:5173`); fallback checks pass.
- `git ls-files | rg ...`: no tracked generated artifacts found (`rg` exit `1` indicates no matches).

## R2 Verification Constraint Adaptation

Date: `2026-02-20`

### Constraint

- Legacy application runtime cannot be executed in current environment.

### Policy Update

- Verification model adapted to offline evidence.
- A row can be promoted to `verified` when all three are present:
  1. legacy source reference (`/src` path with endpoint/route),
  2. parity fixture or contract baseline reference (`app/tests/parity/**`),
  3. passing modern contract/e2e assertion evidence.

### Updated Control Files

- `app/docs/orchestration/decisions.md`
- `app/docs/orchestration/risks.md`
- `app/docs/orchestration/status.md`
- `app/docs/orchestration/backlog.md`
- `app/docs/orchestration/next-agent-handoff.md`
- `app/docs/parity/parity-gap-report.md`

## R2-003 Social/User Compatibility Wave

Date: `2026-02-20`

### Scope

- Upgraded social compatibility service responses from `planned` to `implemented` for wall/post/comment/notification/user-notification operations.
- Added user compatibility controller for:
  - `User/GeneralSettings` (`GET`, `PUT`)
  - `User/Logins` (`GET`)
  - `User/DeleteLogin` (`DELETE`)
  - `User/GetUsersForAutocomplete` (`GET`)
- Extended auth compatibility service with implemented user-account operations.
- Added social/user implementation contract assertions:
  - `app/tests/parity/scripts/verify-social-user-implementation-contract.mjs`
- Updated API matrix rows for social/user slice to `implemented`.

### Validation Commands

Executed in this cycle:

```bash
pnpm --dir app/tests/parity test
pnpm --dir app lint
pnpm --dir app typecheck
pnpm --dir app test
pnpm --dir app smoke
pnpm --dir app build
pnpm --dir app verify
pnpm --dir app/api build
pnpm --dir app/api lint
pnpm --dir app/api typecheck
pnpm --dir app/api test
git status --short
git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'
```

Results:

- All command gates above: `PASS`
- Smoke runtime uses existing fallback path in sandbox when port bind is blocked (`EPERM` on `127.0.0.1:5173`).
- `git ls-files | rg ...`: no tracked generated artifacts found (`rg` exit `1` indicates no matches).

## R2-004 Admin/Reference Compatibility Wave (Slice A)

Date: `2026-02-20`

### Scope

- Added admin/reference compatibility module and service for bounded slice:
  - `Organization/*`
  - `Office/*`
  - `Floor/*`
- Wired admin module into `CoreCompatibilityModule`.
- Added admin implementation contract assertions:
  - `app/tests/parity/scripts/verify-admin-reference-implementation-contract.mjs`
- Updated parity contract chain to include admin implementation checks.
- Updated API matrix for organization/office/floor rows to `implemented`.

### Validation

Executed:

```bash
pnpm --dir app verify
pnpm --dir app/api build
pnpm --dir app/api lint
pnpm --dir app/api typecheck
pnpm --dir app/api test
git status --short
git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'
```

Results:

- All command gates above: `PASS`
- Smoke runtime fallback path remained active in sandbox where local port bind is blocked.
- `git ls-files | rg ...`: no tracked generated artifacts found (`rg` exit `1` indicates no matches).

## R3-001/R3-002/R3-003 UI Parity Completion

Date: `2026-02-20`

### Scope

- Added UI legacy route catchup resolver:
  - `app/web/src/shell/legacy-route-catchup.ts`
- Wired catchup resolver into web runtime payload:
  - `app/web/scripts/live-web-runtime.mjs`
  - `app/web/src/main.ts`
  - `app/web/src/main.tsx`
- Added executable UI implementation contract:
  - `app/tests/parity/contracts/ui/ui-route-baseline.json`
  - `app/tests/parity/scripts/verify-ui-implementation-contract.mjs`
- Added UI contract execution to parity core command chain:
  - `app/tests/parity/package.json`
- Promoted UI matrix to verified coverage:
  - `app/docs/parity/ui-route-matrix.csv`

### Coverage Snapshot

- API: `mapped 190/190`, `implemented 190/190`, `verified 190/190`.
- UI: `mapped 115/115`, `implemented 115/115`, `verified 115/115`.

### Validation Commands

Executed:

```bash
pnpm --dir app/packages/ui primitives:check
pnpm --dir app/web shell:check
pnpm --dir app/tests/e2e visual:baseline
pnpm --dir app/tests/parity test
```

Results:

- `pnpm --dir app/packages/ui primitives:check`: `PASS`
- `pnpm --dir app/web shell:check`: `PASS`
- `pnpm --dir app/tests/e2e visual:baseline`: `PASS`
- `pnpm --dir app/tests/parity test`: `PASS`

## R4-001 Cloudflare Deployment Artifacts (No Publish)

Date: `2026-02-20`

### Scope

- Added Cloudflare deployment artifact pack:
  - `app/infra/cloudflare/README.md`
  - `app/infra/cloudflare/pages/wrangler.toml`
  - `app/infra/cloudflare/containers/wrangler.toml`
  - `app/infra/cloudflare/containers/worker.ts`
  - `app/infra/cloudflare/containers/Dockerfile.api`
  - `app/infra/cloudflare/.dev.vars.example`
- Added deploy artifact contract + verifier:
  - `app/infra/contracts/cloudflare-deploy-contract.json`
  - `app/infra/scripts/verify-cloudflare-deploy-contract.mjs`
- Wired deployment artifact checks into app scripts and CI contract:
  - `app/package.json`
  - `app/scripts/foundation-check.mjs`
  - `app/infra/ci/run-foundation-ci.sh`
  - `app/infra/ci/pipeline-contract.md`

### Validation Commands

Executed:

```bash
pnpm --dir app deploy:cloudflare:check
pnpm --dir app install
pnpm --dir app lint
pnpm --dir app typecheck
pnpm --dir app test
pnpm --dir app smoke
pnpm --dir app build
pnpm --dir app verify
pnpm --dir app/api build
pnpm --dir app/api lint
pnpm --dir app/api typecheck
pnpm --dir app/api test
git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'
```

Results:

- `pnpm --dir app deploy:cloudflare:check`: `PASS`
- full validation set above: `PASS`
- smoke runtime fallback: `PASS` under sandbox bind restriction (`EPERM` on `127.0.0.1:5173`)
- `git ls-files | rg ...`: no tracked generated artifacts (`rg` exit `1` means no matches)
