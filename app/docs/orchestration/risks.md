# Risks

Track active modernization risks, owners, and mitigations.

## Active Risks

1. `R-001` Incomplete parity coverage in early phases
- Severity: `Medium`
- Area: `API/UI parity`
- Owner role: `$parity-analyst`
- Status: `Open`
- Mitigation:
  - initial API (`189` rows) and UI (`115` rows) matrices created on `2026-02-20`
  - critical-flow golden fixture index completed (`T-0006`)
  - prioritize mapping and gap burn-down from `status=unmapped` inventory
  - auth/token compatibility scaffolding and initial Account endpoint mappings completed (`T-0010`)
  - fixture-driven auth contract assertions and token row mapping completed (`T-0015`, `T-0016`, `T-0019`)
  - tenant/permission and error-shape fixture assertions now runnable and passing (`T-0020`, `T-0021`)
  - aggregate core compatibility contract command added for repeatable verification (`T-0022`)
  - conventions contract and shell baseline checks complete (`T-0025`, `T-0026`)
  - Phase 3 shell route parity pack, shared primitives, and visual baseline scaffold complete (`T-0029`..`T-0032`)
  - escalate critical unmapped flows immediately
- Next review date: `2026-02-27`

2. `R-002` Migration runtime may exceed weekend window
- Severity: `High`
- Area: `Data migration/cutover`
- Owner role: `$data-migration-engineer`
- Status: `Open`
- Mitigation:
  - run staged dry-runs early
  - measure end-to-end timing and optimize bottlenecks
- Next review date: `2026-02-27`

3. `R-003` CI/runtime drift between local and target deployment
- Severity: `Medium`
- Area: `Platform/DevOps`
- Owner role: `$platform-devops`
- Status: `Open`
- Mitigation:
  - baseline CI command runner and Docker Compose topology implemented in Phase 1
  - enforce reproducible environment contracts
  - validate Docker-on-VM deployment regularly
- Next review date: `2026-02-27`

## Closed Risks

- None yet.
