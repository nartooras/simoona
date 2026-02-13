# Modernization Workspace Foundation

This repository now includes a root `pnpm` workspace for incremental modernization work that coexists with the legacy applications.

## Scope

- Modern workspace code lives under `modern/packages/*`.
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

## New React Webapp Package

Package path: `modern/packages/webapp`

Commands:

- `pnpm --filter @simoona/webapp dev --host`: run the Vite dev server.
- `pnpm --filter @simoona/webapp lint`: lint the package.
- `pnpm --filter @simoona/webapp typecheck`: run package type checks.
- `pnpm --filter @simoona/webapp test`: run Vitest + React Testing Library tests.
- `pnpm --filter @simoona/webapp build`: build production assets with Vite.

## CI Skeleton

Workflow file: `.github/workflows/modernization-ci.yml`

Jobs:

- `lint`: install dependencies, run `pnpm lint`
- `test`: install dependencies, run `pnpm test`
- `build`: install dependencies, run `pnpm typecheck` and `pnpm build`

This keeps modernization checks isolated while allowing legacy systems to continue their current pipelines.
