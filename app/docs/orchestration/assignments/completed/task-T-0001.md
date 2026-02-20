# Task Assignment `T-0001`

- Date assigned: `2026-02-20`
- Owner role: `$parity-analyst`
- Phase: `Phase 0 - Parity Baseline and Inventory`
- Priority: `P0`
- Status: `COMPLETED`

## Objective

Build the initial API endpoint parity matrix from legacy backend controllers so parity gaps are visible before implementation waves begin.

## Scope In

- `/Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/Controllers/**`
- `/Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/App_Start/**` (if needed for route metadata)
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`

## Scope Out

- Any code changes under `/Users/arturasnikoncukas/code/repo/simoona/src/**`
- Any code changes under `/Users/arturasnikoncukas/code/repo/simoona/build/**`
- UI route mapping (`T-0002`) and feature checklist (`T-0003`)

## Constraints

- Do not modify `/Users/arturasnikoncukas/code/repo/simoona/src` or `/Users/arturasnikoncukas/code/repo/simoona/build`.
- Keep all output under `/Users/arturasnikoncukas/code/repo/simoona/app`.
- Use `status` values only: `unmapped`, `mapped`.

## Acceptance Criteria

1. File exists at `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`.
2. CSV header is exactly:
   `legacy_controller,legacy_action,http_method,legacy_route,auth_scope,response_shape,modern_module,modern_handler,status,notes`
3. Matrix contains one row per legacy API endpoint discoverable from `/Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/Controllers`.
4. Every row has non-empty `legacy_controller`, `http_method`, and `legacy_route` fields.
5. A coverage summary is reported: total endpoint rows, mapped rows, unmapped rows.

## Validation Commands

```bash
test -s /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv
head -n 1 /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv
tail -n +2 /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv | wc -l
rg --files /Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/Controllers
rg -n "\[Route|\[Http(Get|Post|Put|Delete|Patch)" /Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/Controllers
```

## Dispatch Prompt (From Template)

```text
Role: parity-analyst-agent
Skill: use $parity-analyst
Objective: Build initial API endpoint parity matrix from legacy controllers and publish under /app/docs/parity.
Phase: Phase 0
Scope in: src/api/Shrooms.Presentation.Api/Controllers/**, src/api/Shrooms.Presentation.Api/App_Start/**, app/docs/parity/api-endpoint-matrix.csv
Scope out: Any changes under /src or /build, UI route matrix, feature checklist.
Constraints:
- Keep parity artifacts current under /app/docs/parity.
- Report gaps explicitly with severity and owner.
- Do not modify /src or /build.
Acceptance:
- Updated parity matrix with endpoint coverage and status values (mapped|unmapped).
- Coverage summary includes endpoint totals and gap totals.
Validation commands:
- test -s /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv
- head -n 1 /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv
- tail -n +2 /Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv | wc -l
- rg -n "\[Route|\[Http(Get|Post|Put|Delete|Patch)" /Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/Controllers
Output format:
1) Coverage summary
2) Updated artifacts
3) Gap list by severity
4) Recommended next tasks
5) Risks/blockers
```

## Completion Notes

- Completed on: `2026-02-20`
- Artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
- Coverage summary:
  - endpoint rows: `189`
  - mapped rows: `0`
  - unmapped rows: `189`
