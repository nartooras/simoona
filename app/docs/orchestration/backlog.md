# Backlog

Use this backlog as the task source of truth for the orchestrator.

## Priority Queue

1. `P0` Build initial API endpoint parity matrix
- Owner role: `$parity-analyst`
- Phase: `Phase 0`
- Dependencies: none
- Acceptance:
  - `api-endpoint-matrix.csv` created under `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity`
  - key legacy endpoints mapped with `status=unmapped|mapped`

2. `P0` Build initial UI route parity matrix
- Owner role: `$parity-analyst`
- Phase: `Phase 0`
- Dependencies: none
- Acceptance:
  - `ui-route-matrix.csv` created under `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity`
  - key legacy routes mapped with `status=unmapped|mapped`

3. `P0` Create feature checklist baseline
- Owner role: `$parity-analyst`
- Phase: `Phase 0`
- Dependencies: none
- Acceptance:
  - `feature-checklist.md` created under `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity`
  - core/admin/premium/integration sections included

4. `P1` Bootstrap platform skeleton under `/app`
- Owner role: `$platform-devops`
- Phase: `Phase 1`
- Dependencies: parity baseline tasks started
- Acceptance:
  - base repo structure for web/api/packages/tests/infra
  - initial CI command contract documented

5. `P1` Define first migration dry-run plan
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
