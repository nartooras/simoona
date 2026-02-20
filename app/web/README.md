# Web App Shell Compatibility Baseline

Phase 2 foundational shell scaffold for the modern React/Vite web application.

## Implemented shell boundaries

- `src/shell/auth-boundary.ts`
  - compatibility auth entry gate placeholder for login/session redirect flow
- `src/shell/tenant-route-container.ts`
  - tenant-aware route state placeholder for org context routing
- `src/shell/top-level-layout.ts`
  - shell layout contract placeholder for parity navigation frame
  - references shared UI primitives from `/app/packages/ui/src`

## Validation

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web shell:check`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/packages/ui primitives:check`

## Live Runtime (Phase 3/4 Re-open)

This package now exposes a runnable local web runtime that renders shell state using the
existing boundary modules.

Runtime commands:

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web dev`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web preview`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web build`

Default runtime URL:

- `http://127.0.0.1:5173`

Wave A shell-critical routes:

- `/`
- `/profile`
- `/Wall/Feed`
- `/Settings/Notifications`
