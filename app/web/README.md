# Web App Shell Compatibility Baseline

Shell compatibility baseline for the modern React/Vite web application.

## Implemented shell boundaries

- `src/shell/auth-boundary.ts`
  - compatibility auth entry gate for login/session redirect flow
- `src/shell/tenant-route-container.ts`
  - tenant-aware route state for org context routing
- `src/shell/top-level-layout.ts`
  - shell layout contract for parity navigation frame
  - references shared UI primitives from `/app/packages/ui/src`

## Validation

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web shell:check`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web syntax:check`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web lint`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web typecheck`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web test`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web build`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/packages/ui primitives:check`

## Shared Runtime Module

- `src/runtime/runtime-shared.js`
  - shared seed data + route/path helpers consumed by both:
    - browser runtime (`src/main.tsx`)
    - local runtime server (`scripts/live-web-runtime.mjs`)

## Live Runtime

This package now exposes a runnable local web runtime that renders shell state using the
existing boundary modules.

Runtime commands:

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web dev`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web preview`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web build`

Default runtime URL:

- `http://127.0.0.1:5173`

Shell-critical routes:

- `/`
- `/profile`
- `/Wall/Feed`
- `/Settings/Notifications`
