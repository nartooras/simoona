# Next Agent Handoff Plan

Date: `2026-02-20`
Branch: `modernization`
Mode: `build-first`

## Objective

Execute release-readiness work (`R5`) while keeping Cloudflare publish/deploy execution deferred until explicit user approval.

## Hard Rules

1. Work only on branch `modernization`.
2. Do not change `/src` or `/build`.
3. Do not execute Cloudflare publish/deploy commands yet.
4. Keep all work scoped to `/app`.

## Immediate Execution Queue

1. `R5-001` (`$qa` + `$platform-devops`)
- In scope:
  - Build release readiness checklist with explicit go/no-go criteria.
  - Link offline parity evidence and rollback references.
- Acceptance:
  - Checklist is complete and references current orchestration evidence.

2. `R5-002` (`$qa`)
- In scope:
  - Prepare and execute final verification command pack.
- Acceptance:
  - Full verification report exists with pass/fail table and residual risks.

3. `R5-003` prep (`$simoona-modernization-orchestrator`)
- In scope:
  - Prepare publish-ready execution sequence without running publish.
- Acceptance:
  - Publish execution plan is ready pending explicit user approval.

## Success Criteria For This Stage

1. `R4` remains closed with artifact-only deployment readiness evidence.
2. `R5` deliverables are prepared for explicit publish approval decision.
3. No publish commands are executed.

## Explicitly Deferred

1. Cloudflare publishing/deployment execution.
2. Production DNS or traffic switching.
3. Release cutover tasks.
