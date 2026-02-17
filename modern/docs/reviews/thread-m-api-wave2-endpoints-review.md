# Review: thread-m-api-wave2-endpoints

## 1) Scope (branch + compared base)
- Reviewed branch: `codex/thread-m-api-wave2-endpoints`
- Compared against: `modernization-main`

## 2) Findings by severity (P0/P1/P2/P3) with file paths
### P1
- Required validation fails: webapp router test expects stale 404 copy for General Settings route.
  - File: `modern/apps/webapp/src/app/routes/AppRouter.test.tsx:54`
  - Details: with `fetch` mocked to `404`, the assertion expects the old empty-state text (`"General settings were returned without language or time zone options."`). The current behavior no longer renders that text for this path, causing `pnpm test` to fail and blocking the mandatory validation gate.

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
- Blocking:
  - P1 failing `pnpm test` assertion in `modern/apps/webapp/src/app/routes/AppRouter.test.tsx`.
- Non-blocking:
  - none.

## 5) Validation results
- `pnpm run arch:check` -> PASS
- `pnpm lint` -> PASS
- `pnpm typecheck` -> PASS
- `pnpm test` -> **FAIL** (`AppRouter > renders general-settings route`: expected stale text at `modern/apps/webapp/src/app/routes/AppRouter.test.tsx:54`)
- `pnpm build` -> PASS
- `dotnet build modern/apps/api/Simoona.Modern.Api.sln` -> PASS
- `dotnet test modern/apps/api/Simoona.Modern.Api.sln --no-build` -> PASS
- `git status --short` -> PASS (clean before review doc update)
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'` -> PASS (no tracked generated artifacts)

## 6) Final decision
`RETURN_TO_DEV`
