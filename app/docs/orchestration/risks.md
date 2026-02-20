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
  - Wave A scope pack plus contract/e2e target manifests and checks are now in place (`T-0034`..`T-0037`)
  - Wave A wall/post/comment/notification API scaffolds and parity marker checks are in place (`T-0039`..`T-0042`)
  - Wave A wall mutation/membership and post interaction mappings are now scaffolded and parity-verified (`T-0044`..`T-0047`)
  - Wave A realtime compatibility markers and payload fixture parity checks are in place (`T-0049`, `T-0050`)
  - Wave A planned-response contract baseline and executable verifier command are in place (`T-0053`, `T-0054`)
  - Wave A wall-read adapter boundary and notification-settings DTO normalization scaffolds are in place (`T-0057`, `T-0058`)
  - Wave A contract bundle checkpoint has current passing baseline evidence (`T-0059`)
  - escalate critical unmapped flows immediately
- Next review date: `2026-02-27`

2. `R-003` CI/runtime drift between local and target deployment
- Severity: `Medium`
- Area: `Platform/DevOps`
- Owner role: `$platform-devops`
- Status: `Open`
- Mitigation:
  - baseline CI command runner and Docker Compose topology implemented in Phase 1
  - enforce reproducible environment contracts
  - validate Docker-on-VM deployment regularly
- Next review date: `2026-02-27`

3. `R-008` Weekend cutover orchestration may surface late execution-order defects
- Severity: `Medium`
- Area: `Cutover + Hypercare`
- Owner role: `$platform-devops-agent` + `$qa-parity-agent`
- Status: `Open`
- Mitigation:
  - initialize Gate 8 weekend cutover command matrix before rehearsal execution (`T-0083`)
  - run freeze/migration/validation rehearsal with explicit timing and rollback checkpoints (`T-0084`)
  - run hypercare readiness drill with on-call escalation and rollback-window validation (`T-0085`)
- Next review date: `2026-02-27`

## Closed Risks

1. `R-004` Gate 4 closure pending changed-screen visual approval workflow and final QA closure checkpoint
- Severity: `High`
- Area: `Phase 4 gate readiness`
- Owner role: `$platform-devops` + `$web-parity-agent`
- Status: `Closed`
- Closure date: `2026-02-20`
- Closure evidence:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-visual-approval-pack.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-feature-waves-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`

2. `R-006` Gate 3/4 closure invalid due to missing live web runtime evidence
- Severity: `High`
- Area: `UI runtime parity`
- Owner role: `$full-stack-developer` + `$qa-parity-agent`
- Status: `Closed`
- Closure date: `2026-02-20`
- Closure evidence:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/live-web-runtime.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/scripts/verify-wave-a-runtime-smoke.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-3-ui-foundation-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-feature-waves-checklist.md`

3. `R-005` Critical integration credentials/readiness may block Gate 5 execution
- Severity: `High`
- Area: `Phase 5 integration parity`
- Owner role: `$platform-devops` + `$parity-analyst-agent`
- Status: `Closed`
- Closure date: `2026-02-20`
- Closure evidence:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-staging-credential-references.env`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/integration-credential-references.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-5-integration-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/integration-inventory-matrix.md`

4. `R-002` Migration runtime may exceed weekend window
- Severity: `High`
- Area: `Data migration/cutover`
- Owner role: `$data-migration-engineer`
- Status: `Closed`
- Closure date: `2026-02-20`
- Closure evidence:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-001-integrity-report.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-002-integrity-report.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/rollback-rehearsal-001.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-6-migration-checklist.md`

5. `R-007` Gate 7 hardening/UAT evidence may surface late P1 defects
- Severity: `Medium`
- Area: `Hardening + UAT`
- Owner role: `$qa-parity-agent` + `$platform-devops-agent`
- Status: `Closed`
- Closure date: `2026-02-20`
- Closure evidence:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-7-hardening-uat-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-security-hardening-pack.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-performance-baseline.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/gate-7-uat-signoff-rehearsal.md`
