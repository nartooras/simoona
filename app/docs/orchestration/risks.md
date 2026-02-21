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

3. `RISK-R3-VISUAL-REFERENCE-COVERAGE`
- Severity: `Medium`
- Description: Runtime parity screenshots now cover all route families, but direct legacy production screenshot coverage is still limited for some historical pages.
- Impact: Some visual confidence still relies on legacy source interpretation rather than side-by-side production captures.
- Mitigation: Continue collecting legacy reference captures where available and attach to parity docs before final publish.
- Owner: `$parity-analyst` + `$qa`
- Status: `Open`

4. `RISK-RUNTIME-PORT-SANDBOX`
- Severity: `High`
- Description: Local runtime bind/connect is blocked inside sandbox (`EPERM` on `127.0.0.1:*`), so runtime verification requires unrestricted execution.
- Impact: Hard-gate runtime evidence commands cannot run in default sandbox mode.
- Mitigation: Run runtime parity evidence commands in unrestricted mode and keep fallback contracts for constrained environments.
- Owner: `$platform-devops` + `$qa`
- Status: `Open`

5. `RISK-R4-CLOUDFLARE-AUTH-SESSION`
- Severity: `Medium`
- Description: Current environment is not authenticated in Wrangler (`npx wrangler whoami` returns `Not logged in`).
- Impact: Publish commands cannot execute until login/token is configured.
- Mitigation: Authenticate with `wrangler login` (interactive) or provide `CLOUDFLARE_API_TOKEN` in publish environment before running `deploy:cloudflare:publish*`.
- Owner: `$platform-devops`
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

4. `RISK-R2-OFFLINE-VERIFICATION-CONFIDENCE`
- Resolution date: `2026-02-21`
- Outcome: API/UI offline-only verification has been replaced by runtime-backed matrix assertions and visual evidence (`R2 190/190`, `R3 115/115` verified).

5. `RISK-CORR-FALSE_READY_STATE`
- Resolution date: `2026-02-21`
- Outcome: `R2` and `R3` were re-opened and re-closed using hard runtime parity evidence, removing false-ready gate status.

6. `RISK-R3-PLAYWRIGHT-INSTALL-DNS`
- Resolution date: `2026-02-21`
- Outcome: Approved unrestricted install path stabilized local Playwright runner for browser interaction assertions.

7. `RISK-R3-PARTIAL-UI-PARITY`
- Resolution date: `2026-02-21`
- Outcome: UI parity matrix is re-closed at `115/115 verified` with route-family runtime evidence and screenshots.
