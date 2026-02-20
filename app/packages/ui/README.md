# UI Primitives Compatibility Baseline

Phase 3 shared primitives baseline for legacy behavior parity.

## Implemented primitives

- `src/primitives/legacy-shell-button.ts`
  - shared shell button contract marker: `legacyShellButton`
- `src/primitives/legacy-shell-nav-item.ts`
  - shared shell navigation item contract marker: `legacyShellNavItem`
- `src/motion/legacy-motion-tokens.ts`
  - subtle motion and reduced-motion tokens marker: `legacyReducedMotionMode`

## Validation

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/packages/ui primitives:check`
