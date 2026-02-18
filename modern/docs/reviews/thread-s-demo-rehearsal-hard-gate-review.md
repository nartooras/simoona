# Review: thread-s-demo-rehearsal-hard-gate

## 1) Scope (branch + compared base)
- Reviewed branch: `codex/thread-s-demo-rehearsal-hard-gate`
- Compared against: `modernization-main`

## 2) Findings by severity (P0/P1/P2/P3) with file paths
- P2: Minted demo bearer token is persisted in plain text into `/tmp/simoona-modern-demo.json` (`env.VITE_API_BEARER_TOKEN`), which increases local token exposure risk on shared/dev machines.
  - `modern/scripts/demo-start.mjs`
  - `modern/scripts/demo-lib.mjs`

## 3) Architecture conformance section (pass/fail + issues)
- Result: **PASS**
- Required references reviewed:
  - `modern/docs/architecture.md`
  - `modern/docs/adr/0001-modernization-structure.md`
  - `modern/docs/adr/0002-read-only-first-data-migration.md`
- Boundary enforcement checks:
  - apps -> packages allowed: PASS
  - packages -> apps forbidden: PASS
  - no modern/** imports from legacy src/**: PASS
- Guardrail command:
  - `pnpm run arch:check` -> PASS

## 4) Blocking vs non-blocking list
- Blocking: none.
- Non-blocking:
  - P2 token persistence in demo process metadata file (`modern/scripts/demo-start.mjs`, `modern/scripts/demo-lib.mjs`).

## 5) Validation results
- `pnpm install` -> PASS
- `pnpm run arch:check` -> PASS
- `pnpm lint` -> PASS
- `pnpm typecheck` -> PASS
- `pnpm test` -> PASS
- `pnpm build` -> PASS
- `dotnet build modern/apps/api/Simoona.Modern.Api.sln` -> PASS
- `dotnet test modern/apps/api/Simoona.Modern.Api.sln --no-build` -> PASS
- `pnpm smoke` -> PASS (required escalated run due sandbox IPC restriction)
- `pnpm demo:check` (local mode) -> FAIL in current environment (`/api/v1/account/user-info` returned `500` due SQL connectivity; command behavior matches hard-gate intent)
- `pnpm demo:check -- --ci` -> PASS
- `git status --short` -> PASS (clean working tree before adding review doc)
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'` -> PASS (no tracked generated artifacts)

## 6) Final decision
`CONTINUE_TO_QA`
