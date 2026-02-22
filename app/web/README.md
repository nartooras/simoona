# Web App Runtime (React + Vite)

Modern web runtime for the Simoona modernization workspace.

## What this package now is

- Real React application mounted with `createRoot`.
- Vite-based dev/build/preview toolchain.
- Runtime parity payload injection for legacy route testing (`simoona-runtime-data`).
- Health probes exposed in dev/preview (`/healthz`, `/readyz`).

## Key structure

- `src/main.tsx`: React bootstrap entry.
- `src/app/App.tsx`: shell + feature view components.
- `src/app/runtime-data.ts`: route-to-runtime payload resolver shared by app + Vite middleware.
- `src/shell/*`: shell compatibility boundary/state modules.
- `scripts/live-web-runtime.mjs`: Vite wrapper for `dev`/`preview`/`build`.

## Commands

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web dev`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web preview`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web build`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web lint`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web typecheck`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web test`

## Runtime checks expected by parity harness

- HTML routes include `<script id="simoona-runtime-data" type="application/json">...`.
- Runtime HTML keeps `<script type="module" src="/src/main.tsx"></script>`.
- `/healthz` and `/readyz` return `200`.
