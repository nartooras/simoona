# Next Agent Handoff Plan

Date: `2026-02-20`
Branch: `modernization`
Mode: `build-first`

## Objective

Keep modernization readiness moving under `/app` while deployment publish remains explicitly deferred.

## Hard Rules

1. Work only on branch `modernization`.
2. Do not change `/src` or `/build`.
3. Do not execute Cloudflare publish/deploy commands yet.
4. Keep all work scoped to `/app`.

## Immediate Execution Queue

1. `R4-001` (`$cloudflare-deploy` + `$platform-devops`)
- In scope:
  - Prepare Cloudflare Pages and Containers deployment manifests/scripts.
  - Add rollback-oriented deployment runbook scaffolding.
- Acceptance:
  - Deployment artifacts are present and lintable.
  - No publish command is executed.

2. `R5-001` (`$qa` + `$platform-devops`)
- In scope:
  - Update release readiness checklist to include offline parity verification references and required QA sampling.
- Acceptance:
  - Checklist points to current parity evidence and risk mitigations.

3. `R5-002` prep (`$qa`)
- In scope:
  - Prepare final verification command pack for pre-publish gate.
- Acceptance:
  - Command pack is explicit and reproducible on macOS setup.

## Success Criteria For This Stage

1. `R2` and `R3` remain closed with complete parity coverage.
2. Deployment artifacts are ready but unpublished.
3. Release readiness evidence is prepared for explicit deployment go-ahead.

## Explicitly Deferred

1. Cloudflare publishing/deployment execution.
2. Production DNS or traffic switching.
3. Release cutover tasks.
