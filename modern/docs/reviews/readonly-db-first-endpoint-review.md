# Review: readonly-db-first-endpoint

## Scope
- Reviewed branch: `codex/readonly-db-first-endpoint`
- Compared against: `modernization-main`
- Review branch: `codex/review-readonly-db-first-endpoint`

## Findings (ordered by severity)

### P1 - `GET /api/v1/account/user-info` is effectively unauthenticated and accepts spoofable identity header
- Files:
  - `modern/apps/api/src/Simoona.Modern.Api/Endpoints/UserInfo/UserInfoEndpoints.cs`
  - `modern/apps/api/src/Simoona.Modern.Api/Endpoints/UserInfo/HttpCurrentUserResolver.cs`
  - `modern/apps/api/src/Simoona.Modern.Api/Program.cs`
- Details:
  - Endpoint does not require authorization (`.RequireAuthorization()` is not used and auth middleware is not configured).
  - `HttpCurrentUserResolver` accepts `X-User-Id` fallback unconditionally.
  - Any caller can request another user's profile by supplying `X-User-Id` and `X-Org-Id`.
- Risk:
  - Security regression vs legacy `GET /Account/UserInfo` contract, which is auth-protected.
- Recommended follow-up:
  - Add auth/authz middleware and enforce authorization on the route.
  - Restrict `X-User-Id` fallback to explicit non-production/test mode only, or remove it.

### P2 - Contract test coverage is missing key negative-path cases
- Files:
  - `modern/tests/api/Simoona.Modern.Api.Tests/Contracts/UserInfoContractTests.cs`
- Details:
  - Current tests cover `200 OK` happy path and missing org header (`400`).
  - Missing explicit tests for:
    - missing user context (`400`)
    - user not found (`404`)
    - cross-org user access (`404`)
- Risk:
  - Regressions in endpoint guard behavior may pass unnoticed.
- Recommended follow-up:
  - Add explicit contract tests for the missing scenarios above.

## Small safe fixes applied in review branch
- Updated contract documentation note to match current endpoint payload behavior:
  - `modern/docs/api-contracts.md`
  - Clarified that `organizationName` is not yet returned for the modern endpoint.

## Validation results
- `pnpm lint` -> PASS
- `pnpm typecheck` -> PASS
- `pnpm test` -> PASS
- `pnpm build` -> PASS
- `dotnet build modern/apps/api/Simoona.Modern.Api.sln` -> PASS
- `dotnet test modern/apps/api/Simoona.Modern.Api.sln --no-build` -> PASS
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'` -> PASS (no matches)

## Review branch changes
- `modern/docs/api-contracts.md`
- `modern/docs/reviews/readonly-db-first-endpoint-review.md`

## Notes
- Existing tracked change in working tree before review: `pnpm-lock.yaml` (left untouched).

## Re-review update
- Re-reviewed commit: `acd336802ddcc42bb25ac024721bbfd6f3dc385a`
- Result: both original findings are closed.

### Closure details
- P1 closed:
  - `Program.cs` now configures auth (`AddAuthentication().AddJwtBearer()`, `AddAuthorization()`, `UseAuthentication()`, `UseAuthorization()`).
  - `UserInfoEndpoints.cs` now enforces route authorization via `.RequireAuthorization()` and documents `401`.
  - `HttpCurrentUserResolver.cs` now allows `X-User-Id` fallback only in `Development` or `Testing`.
- P2 closed:
  - `UserInfoContractTests.cs` now covers missing user context (`400`), user not found (`404`), and cross-org access (`404`).
  - test auth harness added in `TestAuthHandler.cs` and wired in `ModernApiTestFactory.cs`.
