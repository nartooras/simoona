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
