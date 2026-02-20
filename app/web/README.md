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
