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

Modern API now includes a read-only EF Core integration against the legacy SQL Server schema for the first real migrated endpoint.

- Read DB context: `ModernReadDbContext` (`AspNetUsers` projection only for this milestone).
- Safety guard: `ReadOnlySaveGuardInterceptor` throws for any `SaveChanges` invocation to enforce no writes.
- Implemented endpoint: `GET /api/v1/account/user-info`.
  - Reads user by `userId` + `organizationId` from DB.
  - Requires authenticated caller.
  - Requires organization header: `X-Org-Id` (or `Organization`) and user context from auth claims.
  - Temporary `X-User-Id` header fallback is enabled for Development/Testing only.

### Local Run/Config Notes

Set the read-only connection string via appsettings or environment variable:

```bash
export ConnectionStrings__LegacyReadOnly="Server=localhost;Database=Simoona;Integrated Security=true;TrustServerCertificate=true;Application Intent=ReadOnly"
dotnet run --project modern/apps/api/src/Simoona.Modern.Api/Simoona.Modern.Api.csproj
```

Behavior notes:

- `Application Intent=ReadOnly` is included by default in modern API appsettings.
- This milestone does not include write endpoints and blocks writes at EF interception level.

## API Contract Baseline

A first-pass legacy-to-modern API contract baseline for prioritized migration endpoints lives at:

- `modern/docs/api-contracts.md`

## Architecture Baseline and ADRs

Modernization architecture source of truth:

- `modern/docs/architecture.md`

Architecture decisions (ADRs):

- `modern/docs/adr/`

Use these as default references before implementing modernization changes.

## Architecture Guardrail

Boundary check for forbidden modern-to-legacy imports/references:

```bash
pnpm run arch:check
```

This check is also included in root `pnpm lint`.
Coverage includes `import/export ... from`, `import("...")`, and `require("...")` forms for `src/**`, `@/src/**`, `../src/**`, and absolute `.../src/**` paths, with tests in `modern/scripts/check-modern-boundaries.test.mjs`.

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

## CI Skeleton

Workflow file: `.github/workflows/modernization-ci.yml`

Jobs:

- `lint`: install dependencies, run `pnpm lint`
- `test`: install dependencies, run `pnpm test`
- `build`: install dependencies, run `pnpm typecheck` and `pnpm build`

This keeps modernization checks isolated while allowing legacy systems to continue their current pipelines.
