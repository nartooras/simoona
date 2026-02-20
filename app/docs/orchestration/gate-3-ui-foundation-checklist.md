# Gate 3 UI Parity Foundation Checklist

Date: `2026-02-20`
Phase: `Phase 3 - UI Parity Foundation and Design Modernization`
Re-opened: `2026-02-20` (live web runtime requirement was missing from prior closure)
Re-closed: `2026-02-20` (live web runtime evidence captured)

## Checklist

- [x] Live web runtime exists and is runnable on local macOS
  - Current: `MET`
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/index.html`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/vite.config.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/main.tsx`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/package.json` (`dev|build|preview` present)
    - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web dev` -> PASS (server on `127.0.0.1:5173`)
    - `curl` route checks -> HTTP `200` for `/` and `/profile`
- [x] Shared UI primitives reproduce legacy behavior
  - Current: shared UI primitives package baseline implemented and consumed by shell
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/src/index.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/src/primitives/legacy-shell-nav-item.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/top-level-layout.ts`
- [x] Shell/navigation route behavior matches legacy
  - Current: shell route parity pack and route verification checks are in place
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-shell-foundation-links.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-shell-route-pack.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/verify-shell-route-pack.mjs`
- [x] Animation layer is subtle and respects reduced-motion
  - Current: shared motion tokens include default subtle durations and reduced-motion fallback
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/src/motion/legacy-motion-tokens.ts`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-motion-baseline.md`
- [x] Visual regression baseline approved
  - Current: baseline manifest + workflow + verification command are present and passing
  - Evidence:
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/visual/baseline-manifest.json`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/docs/visual-regression-workflow.md`
    - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/scripts/verify-visual-baseline.mjs`

## Current recommendation

- Gate status recommendation: `COMPLETE`

## Required closure evidence (new mandatory)

- runtime start command and output:
  - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web dev`
- runtime reachability proof:
  - HTTP 200 evidence for `/` from running web server
- runtime route rendering proof:
  - browser/runtime evidence for shell-critical routes (`/`, `/profile`)

## Closure decision

- QA decision: `GREEN`
- Notes:
  - Re-open criteria satisfied with runnable local web runtime and reachable shell-critical routes.
