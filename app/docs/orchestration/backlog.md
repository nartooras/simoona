# Backlog

Use this backlog as the task source of truth for the orchestrator.

## Priority Queue

1. `T-0001` `P0` Build initial API endpoint parity matrix (`COMPLETED`)
- Owner role: `$parity-analyst`
- Phase: `Phase 0`
- Dependencies: none
- Acceptance:
  - file exists at `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
  - header is exactly `legacy_controller,legacy_action,http_method,legacy_route,auth_scope,response_shape,modern_module,modern_handler,status,notes`
  - route inventory covers all legacy API endpoints discoverable from `/Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/Controllers`
  - `status` values are only `unmapped` or `mapped`
  - output includes coverage summary: endpoint row count, mapped count, unmapped count
- Validation commands:
  - `test -s /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
  - `head -n 1 /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
  - `tail -n +2 /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv | wc -l`
  - `rg --files /Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/Controllers`

2. `T-0002` `P0` Build initial UI route parity matrix (`COMPLETED`)
- Owner role: `$parity-analyst`
- Phase: `Phase 0`
- Dependencies: none
- Acceptance:
  - `ui-route-matrix.csv` created under `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity`
  - key legacy routes mapped with `status=unmapped|mapped`

3. `T-0003` `P0` Create feature checklist baseline (`COMPLETED`)
- Owner role: `$parity-analyst`
- Phase: `Phase 0`
- Dependencies: none
- Acceptance:
  - `feature-checklist.md` created under `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity`
  - core/admin/premium/integration sections included

4. `T-0006` `P0` Capture critical-flow golden API/UI fixtures baseline (`COMPLETED`)
- Owner role: `$parity-analyst`
- Phase: `Phase 0`
- Dependencies: `T-0001`, `T-0002`, `T-0003`
- Acceptance:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md` created
  - at least one critical fixture entry exists for each area: `auth`, `wall`, `profile`, `admin`, `premium`
  - fixture index includes artifact path and capture method per entry
  - evidence entry added linking the fixture index
- Validation commands:
  - `test -s /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md`
  - `rg -n \"^## (auth|wall|profile|admin|premium)$\" /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md`

5. `T-0004` `P1` Bootstrap platform skeleton under `/app` (`READY`)
- Owner role: `$platform-devops`
- Phase: `Phase 1`
- Dependencies: `Gate 0` complete
- Acceptance:
  - base repo structure for web/api/packages/tests/infra
  - initial CI command contract documented

6. `T-0005` `P1` Define first migration dry-run plan (`READY`)
- Owner role: `$data-migration-engineer`
- Phase: `Phase 6 prep`
- Dependencies: staging clone availability confirmed
- Acceptance:
  - dry-run checklist and integrity template usage confirmed
  - first rehearsal scope proposed

## Intake Template

For new tasks add:

- Priority (`P0|P1|P2|P3`)
- Task name
- Owner role
- Phase
- Dependencies
- Acceptance criteria
- Validation commands
