# Modernization Workspace Foundation

This repository now includes a root `pnpm` workspace and a modern .NET API skeleton for incremental modernization work that coexists with the legacy applications.

## Scope

- Modern workspace code lives under `modern/packages/*`.
- Modern API skeleton lives under `modern/apps/api/*`.
- Legacy `src/webapp` keeps its current npm/bower-based flow.
- Legacy `src/api` keeps its current .NET flow.

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

Default routes in this modernization skeleton:

- `GET /health`
- `GET /api/v1/ping`
- `GET /api/v1/tenant-context` (reads `X-Tenant-Id` and `X-Org-Id` headers)

OpenAPI/Swagger UI is enabled in Development environment.

## CI Skeleton

Workflow file: `.github/workflows/modernization-ci.yml`

Jobs:

- `lint`: install dependencies, run `pnpm lint`
- `test`: install dependencies, run `pnpm test`
- `build`: install dependencies, run `pnpm typecheck` and `pnpm build`

This keeps modernization checks isolated while allowing legacy systems to continue their current pipelines.
