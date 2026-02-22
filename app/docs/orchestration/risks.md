# Risks

## Active

1. `RISK-R4-INTEGRATION-PARITY`
- Severity: `High`
- Description: integrations are largely mapped/contracted but not fully behavior-verified.
- Impact: go-live failures in OAuth, SMTP, storage, callbacks, and job flows.
- Mitigation: integration parity wave with strict failure-path assertions.
- Owner: `$platform-devops` + `$qa`
- Status: `Open`

2. `RISK-R5-FALSE-READY-STATE`
- Severity: `High`
- Description: previous readiness claims may overstate real parity.
- Impact: premature release risk.
- Mitigation: enforce reviewer/QA gate policy and runtime evidence-only parity closure.
- Owner: `$simoona-modernization-orchestrator` + `$reviewer` + `$qa`
- Status: `Open`

3. `RISK-R3-MONOLITHIC-WEB`
- Severity: `Medium`
- Description: `main.tsx` has been decomposed, but extracted runtime modules remain large and complex.
- Impact: ongoing regression risk and slower review velocity.
- Mitigation: continue domain-level extraction for wall, employee, profile/settings, admin, and auth utility runtime paths.
- Owner: `$full-stack-developer`
- Status: `Open`

4. `RISK-R3-RUNTIME-DRIFT`
- Severity: `Medium`
- Description: runtime drift risk decreased after shared runtime model and decomposition, but full domain isolation is incomplete.
- Impact: local/runtime evidence may diverge from deployed behavior in later waves.
- Mitigation: keep shared runtime models centralized and complete domain-level module extraction.
- Owner: `$full-stack-developer`
- Status: `Open`

5. `RISK-RUNTIME-PORT-SANDBOX`
- Severity: `Medium`
- Description: local runtime bind/connect can fail in sandbox mode.
- Impact: browser runtime checks may require unrestricted execution.
- Mitigation: execute runtime evidence in unrestricted mode and preserve constrained-mode fallback checks.
- Owner: `$platform-devops`
- Status: `Open`

6. `RISK-DEPENDENCY-NETWORK-SANDBOX`
- Severity: `Medium`
- Description: dependency installation can fail in sandbox due DNS/network restrictions.
- Impact: full reinstall validation is blocked even when code-level validation succeeds.
- Mitigation: run install/reinstall verification in unrestricted environment and keep offline-safe checks in CI/sandbox runs.
- Owner: `$platform-devops`
- Status: `Open`

7. `RISK-NODE-SQLITE-EXPERIMENTAL`
- Severity: `Low`
- Description: auth runtime now uses `node:sqlite`, which emits an experimental feature warning on Node 22.
- Impact: warning noise and potential future runtime API changes.
- Mitigation: pin Node runtime version for parity harness and evaluate migration to stable DB client when modernization runtime hardens.
- Owner: `$platform-devops`
- Status: `Open`

## Resolved

1. `RISK-BRANCH-POLICY-CONFLICT`
- Resolution date: `2026-02-22`
- Outcome: branch guidance aligned to `modernization` in root governance docs.

2. `RISK-SKILL-OPTIONAL-EXECUTION`
- Resolution date: `2026-02-22`
- Outcome: `AGENTS.md` now mandates skill utilization protocol and fallback behavior when skills are unavailable.

3. `RISK-DOC-TRUTH-CONFLICT`
- Resolution date: `2026-02-22`
- Outcome: orchestration control files and final verification report now share one consistent `NO_GO_RELEASE_FROZEN` truth model.

4. `RISK-R2-AUTH-STUB`
- Resolution date: `2026-02-22`
- Outcome: auth compatibility handlers now enforce runtime auth context with token/session lifecycle behavior and protected-route checks.

5. `RISK-R2-SQL-AUTH-DATASOURCE`
- Resolution date: `2026-02-22`
- Outcome: auth/session state moved from in-memory maps to SQL-backed compatibility tables for both API source and runtime parity server.

6. `RISK-R2-LEGACY-HEADER-FALLBACK`
- Resolution date: `2026-02-22`
- Outcome: unresolved `x-legacy-user-id` values no longer synthesize authenticated users; requests are now rejected as unauthorized.
