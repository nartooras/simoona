# Risks

## Active

1. `RISK-R2-SQL-AUTH-DATASOURCE`
- Severity: `High`
- Description: current runtime auth/session enforcement is backed by seeded in-memory users/sessions, not SQL schema-backed identity state.
- Impact: behavior is improved but still diverges from required production parity source-of-truth.
- Mitigation: wire auth/session resolution to SQL-backed identity/session storage and remove seeded credential dependence.
- Owner: `$full-stack-developer`
- Status: `Open`

2. `RISK-R2-LEGACY-HEADER-FALLBACK`
- Severity: `High`
- Description: unresolved `x-legacy-user-id` values still produce synthetic authenticated identities in compatibility fallback.
- Impact: unknown identities may obtain authenticated access in fallback paths.
- Mitigation: default unresolved identity behavior to unauthorized once SQL-backed identity resolution is live.
- Owner: `$full-stack-developer`
- Status: `Open`

3. `RISK-R3-MONOLITHIC-WEB`
- Severity: `High`
- Description: `app/web/src/main.tsx` remains monolithic and hard to verify safely.
- Impact: regression risk and slow feature delivery.
- Mitigation: decompose into feature modules and shared rendering/interaction units.
- Owner: `$full-stack-developer`
- Status: `Open`

4. `RISK-R3-RUNTIME-DRIFT`
- Severity: `High`
- Description: runtime drift has been reduced by shared runtime module extraction, but major UI rendering logic is still centralized in `main.tsx`.
- Impact: local/runtime evidence may not reflect deployed behavior.
- Mitigation: continue extracting feature modules from `main.tsx` and keep shared runtime models in reusable source modules.
- Owner: `$full-stack-developer`
- Status: `Open`

5. `RISK-R4-INTEGRATION-PARITY`
- Severity: `High`
- Description: integrations are largely mapped/contracted but not fully behavior-verified.
- Impact: go-live failures in OAuth, SMTP, storage, callbacks, and job flows.
- Mitigation: integration parity wave with strict failure-path assertions.
- Owner: `$platform-devops` + `$qa`
- Status: `Open`

6. `RISK-R5-FALSE-READY-STATE`
- Severity: `High`
- Description: previous readiness claims may overstate real parity.
- Impact: premature release risk.
- Mitigation: enforce reviewer/QA gate policy and runtime evidence-only parity closure.
- Owner: `$simoona-modernization-orchestrator` + `$reviewer` + `$qa`
- Status: `Open`

7. `RISK-RUNTIME-PORT-SANDBOX`
- Severity: `Medium`
- Description: local runtime bind/connect can fail in sandbox mode.
- Impact: browser runtime checks may require unrestricted execution.
- Mitigation: execute runtime evidence in unrestricted mode and preserve constrained-mode fallback checks.
- Owner: `$platform-devops`
- Status: `Open`

8. `RISK-DEPENDENCY-NETWORK-SANDBOX`
- Severity: `Medium`
- Description: dependency installation can fail in sandbox due DNS/network restrictions.
- Impact: full reinstall validation is blocked even when code-level validation succeeds.
- Mitigation: run install/reinstall verification in unrestricted environment and keep offline-safe checks in CI/sandbox runs.
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
