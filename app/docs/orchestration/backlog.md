# Backlog

Use this backlog as the task source of truth for the orchestrator.

## Priority Queue

1. `T-0010` `P0` Build core auth/token compatibility scaffold (`READY`)
- Owner role: `$api-compat-agent`
- Phase: `Phase 2`
- Dependencies: `Gate 1` complete
- Acceptance:
  - initial auth/token module scaffold exists under `/app/api`
  - account auth rows in API parity matrix have planned `modern_module` and `modern_handler`
  - foundation command contract remains green

2. `T-0005` `P1` Define first migration dry-run plan (`BLOCKED`)
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

## Intake Template

For new tasks add:

- Priority (`P0|P1|P2|P3`)
- Task name
- Owner role
- Phase
- Dependencies
- Acceptance criteria
- Validation commands
