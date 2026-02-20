# Integration Inventory and Credential Matrix (Phase 5)

Date: `2026-02-20`
Phase: `Phase 5 - Integration Parity`
Owner role: `$parity-analyst-agent`

## Scope and Inputs

- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-route-matrix.csv`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/feature-checklist.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/staging-clone-access.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/integration-credential-references.md`
- legacy references from `/Users/arturasnikoncukas/code/repo/simoona/src/**` and `/Users/arturasnikoncukas/code/repo/simoona/build/**` (read-only)

## Critical Integration Inventory

| Integration | Legacy references (evidence) | Modern target area | Priority | Owner role | Current parity status |
| --- | --- | --- | --- | --- | --- |
| OAuth and external auth providers | `AccountController/GetExternalLogin`, `GetExternalLogins`, `RegisterExternal`; legacy OWIN `/token` semantics | `app/api` auth compatibility and integration adapter boundary | `P0` | `$api-compat-agent` + `$platform-devops-agent` | `mapped` (credential readiness + failure-path smoke verified) |
| SMTP and email template delivery | legacy API mail settings and background notification flows | `app/api` integration adapter + platform secret contract | `P0` | `$platform-devops-agent` + `$api-compat-agent` | `mapped` (credential readiness + failure-path smoke verified) |
| Storage/file/media URL behavior | legacy picture/file/media URL and upload/download behavior | `app/api` media/storage compatibility boundary | `P1` | `$api-compat-agent` + `$platform-devops-agent` | `mapped` (credential readiness + failure-path smoke verified) |
| External jobs/callback endpoints | `ExternalJobsController/*` (`SendDailyMails`, `SendBirthdaysNotifications`, `AnonymizeUsers`, `ProcessExpiredBlacklistUsers`) | `app/api` external-jobs compatibility module + ops triggers | `P0` | `$platform-devops-agent` + `$api-compat-agent` | `mapped` (callback ownership/source-of-truth locked, readiness + failure-path smoke verified) |

## Staging Credential Availability Matrix

No raw secrets are stored in this repository. Status uses: `ready|missing|blocked`.

| Integration | Required credential contract (secret-safe names) | Staging status | Mitigation owner | Notes |
| --- | --- | --- | --- | --- |
| OAuth/external auth | `INTEGRATION_AUTH_CLIENT_ID`, `INTEGRATION_AUTH_CLIENT_SECRET_REF`, `INTEGRATION_AUTH_AUTHORITY_URL`, `INTEGRATION_AUTH_REDIRECT_URI` | `ready` | `$platform-devops-agent` | Secret reference + ownership stored in contract and evidence doc |
| SMTP | `INTEGRATION_SMTP_HOST`, `INTEGRATION_SMTP_PORT`, `INTEGRATION_SMTP_USER`, `INTEGRATION_SMTP_PASSWORD_REF`, `INTEGRATION_SMTP_FROM` | `ready` | `$platform-devops-agent` | Secret reference + ownership stored in contract and evidence doc |
| Storage/media | `INTEGRATION_STORAGE_PROVIDER`, `INTEGRATION_STORAGE_BUCKET`, `INTEGRATION_STORAGE_BASE_URL`, `INTEGRATION_STORAGE_ACCESS_KEY_REF`, `INTEGRATION_STORAGE_SECRET_KEY_REF` | `ready` | `$platform-devops-agent` | Secret reference + ownership stored in contract and evidence doc |
| External jobs/callbacks | `INTEGRATION_EXTERNAL_JOBS_BASE_URL`, `INTEGRATION_EXTERNAL_JOBS_TOKEN_REF` | `ready` | `$platform-devops-agent` + `$qa-parity-agent` | Callback URL/token owner and source-of-truth are explicit in contract and evidence doc |
| Staging SQL clone (migration support prerequisite) | host `127.0.0.1`, port `14333`, db `SimoonaStagingClone`, login `simoona_ro` | `ready` | `$data-migration-engineer` | Verified read-only at `2026-02-20T14:16:41.127Z` |

## Phase 5 Execution Outcome

- `T-0071` credential reference provisioning: `COMPLETED`
- `T-0072` provider failure-path smoke checks: `COMPLETED`
- `T-0073` Gate 5 readiness checkpoint re-run: `COMPLETED`

## Coverage Delta (Integration Slice)

- Integration checklist items with explicit owner and status: `6/6` (`100%` tracking coverage for this slice).
- Critical integration inventory entries with owner + priority + target area: `4/4` (`100%`).
- Credential matrix entries with status + mitigation owner: `5/5` (`100%`).
- Readiness outcome: `READY` (gate-critical provider references and failure-path checks are green in strict staging smoke).
