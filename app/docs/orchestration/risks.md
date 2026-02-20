# Risks

## Active

1. `RISK-R1-API-COVERAGE`
- Severity: `High`
- Description: API parity matrix currently has broad `unmapped`/`unimplemented` coverage.
- Impact: Release cannot proceed without complete endpoint parity.
- Mitigation: Run `R1-001` matrix re-baselining, then execute domain-by-domain `R2` waves with strict verification.
- Owner: `$parity-analyst` + `$full-stack-developer`
- Status: `Open`

2. `RISK-R1-UI-COVERAGE`
- Severity: `High`
- Description: UI route matrix currently has broad `unmapped`/`unimplemented` coverage.
- Impact: UI parity and user-flow compatibility are not release-ready.
- Mitigation: Run `R1-001` route-domain mapping, then execute `R3` route waves with visual and behavior checks.
- Owner: `$parity-analyst` + `$full-stack-developer`
- Status: `Open`

3. `RISK-R4-CONTAINERS-BETA`
- Severity: `Medium`
- Description: Cloudflare Containers runtime remains beta and requires explicit rollback discipline.
- Impact: Deployment stability and change safety can degrade without hardened rollback controls.
- Mitigation: Define versioned deploy rollback playbook in `R4` and require rehearsal before production go-live.
- Owner: `$platform-devops`
- Status: `Open`

4. `RISK-R4-PUBLISH-DEFERRED`
- Severity: `Low`
- Description: Publishing execution is intentionally deferred while implementation parity is being completed.
- Impact: Late discovery of deployment-specific integration issues is possible.
- Mitigation: Prepare deployment artifacts during `R1-R3`, then run full staging publish rehearsal before production.
- Owner: `$platform-devops`
- Status: `Open`

## Resolved

1. `RISK-R0-STALE-ORCHESTRATION`
- Resolution date: `2026-02-20`
- Outcome: Obsolete orchestration and wave-specific artifacts removed; control files reset to `R0-R5`.
