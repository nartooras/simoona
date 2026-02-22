# QA Report

## 1) Decision

- Status: `GREEN`
- Scope: `R4-INTEGRATION-PARITY-001A` integration failure-path runtime baseline
- Phase: `R4`

## 2) Commands Executed

- `pnpm --dir app/api lint`
  - Result: `pass`
- `pnpm --dir app/tests/parity contract:core`
  - Result: `pass`
- `pnpm --dir app/tests/parity runtime:api:auth`
  - Result: `pass` (required unrestricted mode; sandbox bind gives `EPERM`)
- `pnpm --dir app/tests/parity runtime:api:matrix`
  - Result: `pass` (required unrestricted mode; sandbox bind gives `EPERM`)
- `pnpm --dir app/tests/parity runtime:api:integration`
  - Result: `pass` (required unrestricted mode; sandbox bind gives `EPERM`)
- `pnpm --dir app verify`
  - Result: `pass`
- `pnpm --dir app install`
  - Result: `pass`
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'`
  - Result: `pass` (no matches; `rg` exit code `1` expected for no matches)

## 3) Findings

- `P3`: Node emits experimental `node:sqlite` warning during runtime tests; behavior is unaffected and assertions remain deterministic.

## 4) Parity Impact

- Runtime integration failures are now behavior-asserted for OAuth, SMTP, storage/media upload, external jobs callbacks, and localization.
- Source compatibility handlers now mirror runtime failure categories and localization update behavior.
- Previous API runtime matrix/auth gates remain green after integration hardening.

## 5) Required Fixes

- none blocking for this slice

## 6) Retest Plan

- `pnpm --dir app/tests/parity runtime:api:integration`
