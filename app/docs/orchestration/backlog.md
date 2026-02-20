# Backlog

Use this backlog as the task source of truth for the orchestrator.

## Priority Queue

1. `T-0029` `P0` Build shared UI primitives parity baseline (`READY`)
- Owner role: `$web-parity-agent`
- Phase: `Phase 3`
- Dependencies: `Gate 2` complete
- Acceptance:
  - initial shared primitives baseline exists under `/app/packages/ui` with legacy behavior markers
  - web shell references at least one shared primitive baseline
  - shell and parity verification commands remain green

2. `T-0030` `P1` Establish Phase 3 visual regression baseline scaffold (`BLOCKED`)
- Owner role: `$qa-parity-agent`
- Phase: `Phase 3`
- Dependencies: `T-0029` complete
- Acceptance:
  - visual baseline scaffold is defined for desktop/tablet/mobile shell states
  - capture workflow and artifact storage path are documented
  - initial placeholder baseline command executes without failure

3. `T-0005` `P1` Define first migration dry-run plan (`BLOCKED`)
- Owner role: `$data-migration-engineer`
- Phase: `Phase 6 prep`
- Dependencies: staging clone availability confirmed
- Acceptance:
  - dry-run checklist and integrity template usage confirmed
  - first rehearsal scope proposed

## Completed Archive

1. `T-0001` `P0` Build initial API endpoint parity matrix (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0001.md`

2. `T-0002` `P0` Build initial UI route parity matrix (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-route-matrix.csv`

3. `T-0003` `P0` Create feature checklist baseline (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/feature-checklist.md`

4. `T-0006` `P0` Capture critical-flow golden API/UI fixtures baseline (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0006.md`

5. `T-0004` `P1` Bootstrap platform skeleton under `/app` (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/pnpm-workspace.yaml`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/docker/docker-compose.yml`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/ci/run-foundation-ci.sh`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0004.md`

6. `T-0007` `P1` Add CI baseline runner script (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/infra/ci/run-foundation-ci.sh`

7. `T-0008` `P1` Record Phase 1 foundation ADR (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/adr/0001-phase1-foundation-baseline.md`

8. `T-0009` `P1` Produce Gate 1 checklist artifact (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-1-foundation-checklist.md`

9. `T-0010` `P0` Build core auth/token compatibility scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/auth-compatibility.module.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/controllers/account-compatibility.controller.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/auth.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv` (`AccountController` mappings)
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0010.md`

10. `T-0011` `P0` Add tenant context compatibility middleware scaffold (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/tenant/tenant-context.middleware.ts`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0011.md`

11. `T-0012` `P0` Add legacy permission compatibility guard scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/permissions/legacy-permission.guard.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/permissions/permission-compatibility.module.ts`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0012.md`

12. `T-0013` `P0` Add legacy error mapping compatibility scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/errors/legacy-error.mapper.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/errors/legacy-error.filter.ts`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0013.md`

13. `T-0014` `P1` Bootstrap auth contract-harness fixture map (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/auth/auth-fixture-map.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-auth-fixture-map.mjs`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0014.md`

14. `T-0015` `P0` Add first runnable auth contract assertions (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/auth/auth-contract-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-auth-fixture-map.mjs`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0015.md`

15. `T-0016` `P0` Map token/user-login compatibility handlers in parity matrix (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0016.md`

16. `T-0017` `P1` Draft Gate 2 incremental checklist (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-2-core-compatibility-checklist.md`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0017.md`

17. `T-0018` `P1` Publish Phase 2 core compatibility plan (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/phase-2-core-compatibility-plan.md`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0018.md`

18. `T-0019` `P1` Expand auth fixture baseline for token issue flow (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/auth/auth-contract-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/auth/token-issue-success.json`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0019.md`

19. `T-0020` `P0` Add first runnable tenant/permission compatibility assertions (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/tenant-permission-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/tenant-permission-fixture-map.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-tenant-permission-contract.mjs`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0020.md`

20. `T-0021` `P0` Add first runnable error-shape compatibility assertions (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/error-shape-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/error-shape-fixture-map.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-error-shape-contract.mjs`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0021.md`

21. `T-0022` `P0` Add aggregate core compatibility contract command (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-auth-fixture-map.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-tenant-permission-contract.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-error-shape-contract.mjs`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0022.md`

22. `T-0023` `P1` Update Gate 2 checklist with runnable core compatibility evidence (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-2-core-compatibility-checklist.md`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0023.md`

23. `T-0024` `P1` Record Phase 2 checkpoint and queue next unblocked task (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/decisions.md`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0024.md`

24. `T-0025` `P0` Add legacy response/date/pagination compatibility middleware scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/conventions/legacy-pagination.middleware.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/conventions/legacy-date-serialization.interceptor.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/conventions/legacy-response-envelope.interceptor.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-compatibility-conventions-contract.mjs`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0025.md`

25. `T-0026` `P0` Bootstrap web shell auth boundary and tenant-aware routing skeleton (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/auth-boundary.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/tenant-route-container.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/top-level-layout.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/verify-web-shell-foundation.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-shell-foundation-links.md`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0026.md`

26. `T-0027` `P1` Close Gate 2 checklist with final compatibility evidence (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-2-core-compatibility-checklist.md`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0027.md`

27. `T-0028` `P1` Transition orchestration from Phase 2 to Phase 3 (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-3-ui-foundation-checklist.md`
- Assignment archive: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/assignments/completed/task-T-0028.md`

## Intake Template

For new tasks add:

- Priority (`P0|P1|P2|P3`)
- Task name
- Owner role
- Phase
- Dependencies
- Acceptance criteria
- Validation commands
