# Risks

Track active modernization risks, owners, and mitigations.

## Active Risks

1. `R-001` Incomplete parity coverage in early phases
- Severity: `High`
- Area: `API/UI parity`
- Owner role: `$parity-analyst`
- Status: `Open`
- Mitigation:
  - maintain parity matrices weekly
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
  - enforce reproducible environment contracts
  - validate Docker-on-VM deployment regularly
- Next review date: `2026-02-27`

## Closed Risks

- None yet.
