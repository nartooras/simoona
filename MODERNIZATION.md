# Modernization Workspace Foundation

This repository now includes a root `pnpm` workspace and a modern .NET API skeleton for incremental modernization work that coexists with the legacy applications.

## Scope

- Modern workspace apps live under `modern/apps/*`.
- Modern shared packages live under `modern/packages/*`.
- Modern API skeleton lives under `modern/apps/api/*`.
- Legacy `src/webapp` keeps its current npm/bower-based flow.
- Legacy `src/api` keeps its current .NET flow.
- Coexistence rule: modernization work must not modify legacy AngularJS runtime behavior in `src/webapp`.

## Prerequisites

- Node.js 22+
- pnpm 10+

## Install

```bash
pnpm install
```

## Root Commands

- `pnpm lint`: run lint checks for modern workspace packages.
- `pnpm format`: format modernization workspace files with Prettier.
- `pnpm format:check`: verify modernization workspace formatting without modifying files.
- `pnpm typecheck`: run TypeScript no-emit checks for modern workspace packages.
- `pnpm test`: run workspace tests.
- `pnpm smoke`: run release-readiness smoke checks (modern webapp route smoke + modern API smoke probes).
- `pnpm smoke:ci`: run smoke checks in CI-friendly reporter mode.
- `pnpm build`: run workspace builds.
- `pnpm modern:api:build`: run `dotnet build` for modern API solution only.
- `pnpm modern:api:test`: run `dotnet test` for modern API tests only.

## Modern API Commands

Use these from repository root to work with the modern API only:

```bash
dotnet build modern/apps/api/Simoona.Modern.Api.sln
dotnet test modern/apps/api/Simoona.Modern.Api.sln
dotnet run --project modern/apps/api/src/Simoona.Modern.Api/Simoona.Modern.Api.csproj
```

Default Development launch profile binds to `http://localhost:5187`.

Default routes in this modernization skeleton:

- `GET /health`
- `GET /api/v1/ping`
- `GET /api/v1/tenant-context` (reads `X-Tenant-Id` and `X-Org-Id` headers)

OpenAPI/Swagger UI is enabled in Development environment.

## Read-only DB Integration Milestone

Modern API now includes a read-only EF Core integration against the legacy SQL Server schema for real migrated endpoints.

- Read DB context: `ModernReadDbContext` (`AspNetUsers` projection only for this milestone).
- Safety guard: `ReadOnlySaveGuardInterceptor` throws for any `SaveChanges` invocation to enforce no writes.
- Implemented endpoint: `GET /api/v1/account/user-info`.
  - Reads user by `userId` + `organizationId` from DB.
  - Requires authenticated caller.
  - Requires organization header: `X-Org-Id` (or `Organization`) and user context from JWT claims.
  - Temporary `X-User-Id` header fallback is enabled for Development/Testing only.

## General Settings Read Endpoint (API-backed)

Modern API now also exposes the General Settings read contract with read-only legacy data access:

- Implemented endpoint: `GET /api/v1/user/general-settings`.
  - Reads current user `CultureCode` and `TimeZone` from `AspNetUsers`.
  - Returns language options (`en-US`, `lt-LT`) and system time zones in legacy-compatible shape.
  - Uses the same authenticated user + org scope enforcement flow as `GET /api/v1/account/user-info`.
  - Returns `404 Not Found` when the user does not exist in the requested organization.

### Local Run/Config Notes

Set required API config via environment variables:

```bash
export ConnectionStrings__LegacyReadOnly="Server=localhost;Database=Simoona;Integrated Security=true;TrustServerCertificate=true;Application Intent=ReadOnly"
export Auth__Jwt__Issuer="https://local.simoona.test"
export Auth__Jwt__Audience="modern-api"
export Auth__Jwt__SigningKey="dev-local-signing-key-change-me-000001"
export Auth__Jwt__Authority=""
export Auth__DevToken__Enabled="true"
dotnet run --project modern/apps/api/src/Simoona.Modern.Api/Simoona.Modern.Api.csproj
```

Behavior notes:

- `Application Intent=ReadOnly` is included by default in modern API appsettings.
- This milestone does not include write endpoints and blocks writes at EF interception level.
- JWT bootstrap validates issuer, audience, signature, and lifetime. In non-dev environments, authority mode is required.

### Local Auth Bootstrap Runbook

1. Start modern API with the env vars shown above.
2. Generate a dev JWT (Development/Testing only, and only when `Auth__DevToken__Enabled=true`):

```bash
curl -s -X POST http://localhost:5187/api/v1/dev-auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-1","organizationId":"7","tenantId":"tenant-a","expiresMinutes":60}'
```

3. Use `accessToken` from response when calling user info:

```bash
curl -i http://localhost:5187/api/v1/account/user-info \
  -H "X-Org-Id: 7" \
  -H "Authorization: Bearer <accessToken>"
```

Expected endpoint behavior:

- Missing token: `401 Unauthorized`
- Invalid token: `401 Unauthorized`
- Token `org_id` claim and `X-Org-Id` mismatch: `403 Forbidden`
- Valid token + matching `X-Org-Id` + user exists: `200 OK`
- Missing/invalid org header: `400 Bad Request`
- Valid auth but no matching user in org: `404 Not Found`

## API Contract Baseline

A first-pass legacy-to-modern API contract baseline for prioritized migration endpoints lives at:

- `modern/docs/api-contracts.md`
- `modern/docs/release-readiness-checklist.md`

## Architecture Baseline and ADRs

Modernization architecture source of truth:

- `modern/docs/architecture.md`

Architecture decisions (ADRs):

- `modern/docs/adr/`

Use these as default references before implementing modernization changes.

## Auth Migration Direction

Auth migration source of truth:

- `modern/docs/auth-migration.md`
- `modern/docs/adr/0003-auth-migration-strategy.md`

Any modernization thread that changes authenticated endpoints, tenant/org resolution, claims handling, token/session lifecycle, or authorization policies must consult and reference both documents before implementation and review.

## Architecture Guardrail

Boundary check for forbidden modern-to-legacy imports/references:

```bash
pnpm run arch:check
```

This check is also included in root `pnpm lint`.
Coverage includes `import/export ... from`, `import("...")`, and `require("...")` forms for `src/**`, `@/src/**`, `../src/**`, and absolute `.../src/**` paths, with tests in `modern/scripts/check-modern-boundaries.test.mjs`.

## Data Migration Dry-Run v1

Read-only migration rehearsal tooling now lives under:

- `modern/tools/migration/`

Scope covered by v1:

- users/profile basics
- organization references
- employee directory fields
- general settings essentials

Primary command:

```bash
pnpm migration:dryrun:v1 --input modern/tools/migration/fixtures/legacy-export-sample.json --output-dir /tmp/simoona-migration-dryrun-v1 --mode dry-run
```

Safety guardrails:

- default mode is `dry-run`
- `--mode write` is explicitly blocked and not implemented
- scripts print warning banners before execution

Environment variables (optional):

- `MIGRATION_INPUT_PATH`
- `MIGRATION_OUTPUT_DIR`
- `MIGRATION_MODE`
- `MIGRATION_SOURCE`

Expected output artifacts (example output dir):

- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.extracted.json`
- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.transformed.json`
- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.report.json`
- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.report.md`

Machine-readable report fields include extracted/transformed counts, validation errors/warnings, and unmapped fields.

Detailed runbook:

- `modern/docs/migration/dryrun-v1.md`
- `modern/docs/migration/dryrun-v1-report-template.md`

## New React Webapp App

App path: `modern/apps/webapp`

Commands:

- `pnpm --filter @simoona/webapp dev --host`: run the Vite dev server.
- `pnpm --filter @simoona/webapp lint`: lint the package.
- `pnpm --filter @simoona/webapp typecheck`: run package type checks.
- `pnpm --filter @simoona/webapp test`: run Vitest + React Testing Library tests.
- `pnpm --filter @simoona/webapp build`: build production assets with Vite.

Environment:

- `VITE_API_BASE_URL` (optional): base URL used by the modern webapp API client.
  - default: `/api`
  - user info endpoint call resolves to `${VITE_API_BASE_URL}/v1/account/user-info` (or `/api/v1/account/user-info` by default).
- `VITE_API_ORGANIZATION_ID` (required for current user-info integration): numeric organization id sent as `X-Org-Id` header.
  - example: `VITE_API_ORGANIZATION_ID=7`
- `VITE_API_BEARER_TOKEN` (optional): token sent as `Authorization: Bearer <token>` for user-info calls.

## Frontend Migration Wave 1

Wave 1 migration details:

- `modern/docs/frontend-migration-wave1.md`

Current migrated scope vs legacy:

| Area | Legacy route/API | React route | Status |
|---|---|---|---|
| Current user context | `GET /Account/UserInfo` | `/user-info` | Migrated on modern API |
| General settings (read) | `/:organizationName/Settings/General` + `GET /User/GeneralSettings` | `/settings/general` | Migrated on modern API |
| General settings (write) | `PUT /User/GeneralSettings` | N/A | Still legacy |

## Frontend Migration Wave 2

Wave 2 migration details:

- `modern/docs/frontend-migration-wave2.md`

Current migrated scope vs legacy:

| Bucket | Items | Endpoint status |
|---|---|---|
| Migrated now (Wave 2) | Employee Directory (`/employees`) | Real modern API endpoint `GET /api/v1/employees` |
| Migrated now (Wave 2) | My Profile (`/profiles/me`) | Real modern API endpoint `GET /api/v1/profiles/me` |
| Migrated in Wave 1 | User Info (`/user-info`), General Settings read (`/settings/general`) | Real modern API endpoints |
| Still legacy | General settings write, profile edit flows, non-migrated settings/profile/wall areas | Not yet migrated |

Wave 2 frontend temporary adapters have been retired from the migrated Employee Directory and My Profile screens; these routes now rely on modern API responses directly.

## Frontend Visual Parity Foundation

Visual parity baseline and implementation notes:

- `modern/docs/frontend-visual-parity.md`

Current parity snapshot:

| Area | Status |
|---|---|
| Page shell (header/sidebar/content) | matched |
| Navigation active/hover behavior | matched |
| Typography baseline | matched |
| Color system | matched |
| Spacing rhythm | partially matched |
| Table/list/card patterns | partially matched |
| Legacy iconography/module-specific chrome | not matched yet |

## Prototype Shell Parity Pass (Thread P)

Prototype shell parity details and availability map:

- `modern/docs/prototype-shell-parity.md`

Highlights from this pass:

- Modern shell navigation now follows legacy-style IA grouping (`Activities`, `Company`, `Externals`, `System`).
- Key placeholder/demo routes are visible in navigation for prototype completeness.
- Route availability labeling is explicit via `real`, `mock`, and `disabled` notices.
- Placeholder prototype routes are populated with realistic static content and non-production markers.

## CI Skeleton

Workflow file: `.github/workflows/modernization-ci.yml`

Jobs:

- `lint`: install dependencies, run `pnpm lint`
- `test`: install dependencies, run `pnpm test`
- `build`: install dependencies, run `pnpm typecheck` and `pnpm build`
- `dotnet-build`: build modern API solution with `dotnet build`
- `dotnet-test`: test modern API solution with `dotnet test --no-build`
- `smoke`: opt-in manual `workflow_dispatch` job (`run_smoke=true`) that runs `pnpm smoke:ci`

This keeps modernization checks isolated while allowing legacy systems to continue their current pipelines.
