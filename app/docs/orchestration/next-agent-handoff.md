# Next Agent Handoff Plan

Date: `2026-02-22`
Branch: `modernization`
Mode: `full-parity-recovery`

## Objective

Continue from completed governance/doc sync, completed Workstream 3 baseline, and completed `R2` auth parity toward remaining feature and integration parity waves.

## Hard Rules

1. Work only on branch `modernization`.
2. Do not change `src/**` or `build/**` unless explicitly requested.
3. Do not close parity from contracts/matrices alone; runtime behavior evidence is mandatory.
4. Require reviewer `APPROVED` and QA `GREEN` before completion claims.
5. Keep production publish frozen unless explicit GO decision is recorded.

## Immediate Execution Queue

1. `R4-INTEGRATION-PARITY-001`
- Owner: `$platform-devops` + `$full-stack-developer`
- Acceptance:
  - integration failure-path parity evidence (OAuth/SMTP/storage/jobs/callbacks/localization).

2. `R3-FEATURE-WAVE-D`
- Owner: `$full-stack-developer`
- Acceptance:
  - runtime parity coverage for features domains previously treated as gated scope.

3. `R6-REVIEW-QA-ENFORCEMENT-001`
- Owner: `$reviewer` then `$qa`
- Acceptance:
  - review report (`APPROVED`) and QA report (`GREEN`) for each completed slice.

## Deferred Until Prerequisites Are Met

1. Production release unfreeze.
2. Final go-live declaration.
3. Any parity closure claim without reviewer/QA evidence.
