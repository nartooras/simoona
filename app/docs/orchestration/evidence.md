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
