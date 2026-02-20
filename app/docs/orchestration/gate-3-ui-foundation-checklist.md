# Gate 3 UI Parity Foundation Checklist

Date: `2026-02-20`
Phase: `Phase 3 - UI Parity Foundation and Design Modernization`

## Checklist

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
