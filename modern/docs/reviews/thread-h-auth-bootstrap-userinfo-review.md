# Review: thread-h-auth-bootstrap-userinfo

## 1) Scope (branch + compared base)
- Reviewed branch: `codex/thread-h-auth-bootstrap-userinfo`
- Compared against: `modernization-main`

## 2) Findings by severity (P0/P1/P2/P3) with file paths
### P1
- Missing org claim vs header consistency check allows cross-org data access with a valid token.
  - File: `modern/apps/api/src/Simoona.Modern.Api/Endpoints/UserInfo/UserInfoEndpoints.cs:30`
  - Details: endpoint authorization requires authentication, but org scope is resolved only from request header (`X-Org-Id`) and never validated against token claim (`org_id`). A caller with a valid token for one organization can send a different org header and query data in that organization when `sub` matches an existing user row, violating tenant/org isolation expectations.

### P2
- Contract tests do not cover org claim/header mismatch rejection for user-info.
  - File: `modern/tests/api/Simoona.Modern.Api.Tests/Contracts/UserInfoContractTests.cs:40`
  - Details: tests cover missing/invalid token and missing org header, but no negative test asserts that mismatched token org and `X-Org-Id` is rejected (expected 403 per migration strategy), so the regression in P1 is not caught.

### P3
- None.

## 3) Architecture conformance section (pass/fail + issues)
- Result: **FAIL**
- Read documents:
  - `modern/docs/architecture.md`
  - `modern/docs/adr/0001-modernization-structure.md`
  - `modern/docs/adr/0002-read-only-first-data-migration.md`
- Boundary rules:
  - apps -> packages allowed: PASS
  - packages -> apps forbidden: PASS
  - no modern/** imports from legacy src/**: PASS
- Guardrail command:
  - `pnpm run arch:check` -> PASS
- Conformance issue:
  - Tenant/org model in architecture requires validated org context; current endpoint does not enforce claim/header org consistency.

## 4) Blocking vs non-blocking list
- Blocking:
  - P1 org claim/header mismatch not enforced in user-info endpoint.
- Non-blocking:
  - P2 missing negative contract test for org mismatch path.

## 5) Validation results
- `pnpm run arch:check` -> PASS
- `pnpm lint` -> PASS
- `pnpm typecheck` -> PASS
- `pnpm test` -> PASS
- `pnpm build` -> PASS
- `dotnet build modern/apps/api/Simoona.Modern.Api.sln` -> PASS
- `dotnet test modern/apps/api/Simoona.Modern.Api.sln --no-build` -> PASS
- `git status --short` -> PASS (clean before review doc update)
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'` -> PASS (no tracked generated artifacts)

## 6) Final decision
`RETURN_TO_DEV`
