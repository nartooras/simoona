# Risks

## Active

1. `RISK-R4-CONTAINERS-BETA`
- Severity: `Medium`
- Description: Cloudflare Containers runtime remains beta and requires explicit rollback discipline.
- Impact: Deployment stability and change safety can degrade without hardened rollback controls.
- Mitigation: Define versioned deploy rollback playbook in `R4` and require rehearsal before production go-live.
- Owner: `$platform-devops`
- Status: `Open`

2. `RISK-R4-PUBLISH-DEFERRED`
- Severity: `Low`
- Description: Publishing execution is intentionally deferred until explicit user approval.
- Impact: Late discovery of deployment-specific integration issues is possible.
- Mitigation: Prepare deployment artifacts now and run full staging publish rehearsal before production publish.
- Owner: `$platform-devops`
- Status: `Open`

3. `RISK-R2-OFFLINE-VERIFICATION-CONFIDENCE`
- Severity: `Medium`
- Description: Legacy runtime cannot be executed, so API/UI verification relies on offline evidence instead of live runtime comparison.
- Impact: Some behavioral differences may be detected later than with dual-runtime replay.
- Mitigation: Enforce offline verification triad for each `verified` item (legacy source reference + parity fixture/baseline + passing modern contract/e2e assertion), and require QA sign-off.
- Owner: `$qa` + `$parity-analyst`
- Status: `Open`

## Resolved

1. `RISK-R0-STALE-ORCHESTRATION`
- Resolution date: `2026-02-20`
- Outcome: Obsolete orchestration and wave-specific artifacts removed; control files reset to `R0-R5`.

2. `RISK-R2-API-COVERAGE`
- Resolution date: `2026-02-20`
- Outcome: API parity matrix promoted to `verified` coverage (`190/190`) under offline verification policy.

3. `RISK-R3-UI-COVERAGE`
- Resolution date: `2026-02-20`
- Outcome: UI route matrix promoted to `verified` coverage (`115/115`) under offline verification policy with executable UI contract assertions.
