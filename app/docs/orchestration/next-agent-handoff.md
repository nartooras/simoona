# Next Agent Handoff Plan

Date: `2026-02-22`
Branch: `modernization`
Mode: `full-parity-recovery`

## Objective

Continue from completed governance/doc sync, baseline hardening, and `R2-AUTH-REAL-001A` toward SQL-backed auth parity and web/runtime parity waves.

## Hard Rules

1. Work only on branch `modernization`.
2. Do not change `src/**` or `build/**` unless explicitly requested.
3. Do not close parity from contracts/matrices alone; runtime behavior evidence is mandatory.
4. Require reviewer `APPROVED` and QA `GREEN` before completion claims.
5. Keep production publish frozen unless explicit GO decision is recorded.

## Immediate Execution Queue

1. `R2-AUTH-REAL-001B`
- Owner: `$full-stack-developer`
- Acceptance:
  - SQL-backed identity/session source for protected auth flows.
  - unresolved user headers do not silently authenticate.

2. `R3-WEB-REFACTOR-001B`
- Owner: `$full-stack-developer`
- Acceptance:
  - further decomposition of `app/web/src/main.tsx` into feature modules.

3. `R4-INTEGRATION-PARITY-001`
- Owner: `$platform-devops` + `$full-stack-developer`
- Acceptance:
  - integration failure-path parity evidence (OAuth/SMTP/storage/jobs/callbacks/localization).

4. `R6-REVIEW-QA-ENFORCEMENT-001`
- Owner: `$reviewer` then `$qa`
- Acceptance:
  - review report (`APPROVED`) and QA report (`GREEN`) for each completed slice.

## Deferred Until Prerequisites Are Met

1. Production release unfreeze.
2. Final go-live declaration.
3. Any parity closure claim without reviewer/QA evidence.
