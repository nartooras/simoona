# QA Report

## 1) Decision

- Status: `GREEN`
- Scope: `R3-WEB-REFACTOR-001B` web runtime decomposition slice
- Phase: `R3`

## 2) Commands Executed

- `pnpm --dir app install`
  - Result: `fail` (`ENOTFOUND registry.npmjs.org` in sandbox)
- `pnpm --dir app/web lint`
  - Result: `pass`
- `pnpm --dir app lint`
  - Result: `pass`
- `pnpm --dir app typecheck`
  - Result: `pass`
- `pnpm --dir app test`
  - Result: `pass`
- `pnpm --dir app smoke`
  - Result: `pass` (fallback route checks due sandbox `EPERM` bind on `127.0.0.1:5173`)
- `pnpm --dir app build`
  - Result: `pass`
- `pnpm --dir app verify`
  - Result: `pass`
- `pnpm --dir app/api build`
  - Result: `pass`
- `pnpm --dir app/api lint`
  - Result: `pass`
- `pnpm --dir app/api typecheck`
  - Result: `pass`
- `pnpm --dir app/api test`
  - Result: `pass`
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'`
  - Result: `pass` (no tracked generated artifacts)

## 3) Findings

- `P2`: dependency install remains blocked in sandbox by DNS/network policy
  - Repro: run `pnpm --dir app install`
  - Expected vs actual: expected dependency fetch; actual `ENOTFOUND registry.npmjs.org`.

- `P2`: local runtime bind is blocked in sandbox for smoke server
  - Repro: run `pnpm --dir app smoke` in constrained mode.
  - Expected vs actual: expected local bind/startup on `127.0.0.1:5173`; actual `EPERM`, fallback path used.

## 4) Parity Impact

- `main.tsx` has been reduced to runtime orchestration responsibilities.
- Route rendering and route interactions were moved into dedicated runtime modules.
- Runtime shell parity checks and route-pack verification stayed green after decomposition.

## 5) Required Fixes

- none blocking for this slice

## 6) Retest Plan

- `pnpm --dir app/web lint`
- `pnpm --dir app verify`
- `pnpm --dir app/api test`
