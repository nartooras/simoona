# Integration Smoke Harness Runbook

Date: `2026-02-20`
Phase: `Phase 5 - Integration Parity`
Owner role: `$platform-devops-agent`

## Objective

Provide deterministic, secret-safe integration readiness and failure-path smoke checks for gate-critical providers (`oauth`, `smtp`, `storage`, `external-jobs`) and staging prerequisites.

## Commands

Run from repository root.

Baseline smoke (uses local staging reference env file):

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:staging
```

Strict gate mode (fails if readiness or required failure-path checks are not green):

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict:staging
```

Contract-default commands (load contract reference env file, overridden by process env values when provided):

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict
```

## Contract Artifacts

- Contract: `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-smoke-contract.json`
- Verifier: `/Users/arturasnikoncukas/code/repo/simoona/app/infra/scripts/verify-integration-smoke.mjs`
- Staging credential references: `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-staging-credential-references.env`
- Ownership/source-of-truth evidence: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/integration-credential-references.md`

## Environment Contract (Secret-Safe)

All `*_REF` values must be secret-manager references. Raw secrets are prohibited.

- OAuth/external auth:
  - `INTEGRATION_AUTH_CLIENT_ID`
  - `INTEGRATION_AUTH_CLIENT_SECRET_REF`
  - `INTEGRATION_AUTH_AUTHORITY_URL`
  - `INTEGRATION_AUTH_REDIRECT_URI`
- SMTP:
  - `INTEGRATION_SMTP_HOST`
  - `INTEGRATION_SMTP_PORT`
  - `INTEGRATION_SMTP_USER`
  - `INTEGRATION_SMTP_PASSWORD_REF`
  - `INTEGRATION_SMTP_FROM`
- Storage/media:
  - `INTEGRATION_STORAGE_PROVIDER`
  - `INTEGRATION_STORAGE_BUCKET`
  - `INTEGRATION_STORAGE_BASE_URL`
  - `INTEGRATION_STORAGE_ACCESS_KEY_REF`
  - `INTEGRATION_STORAGE_SECRET_KEY_REF`
- External jobs/callbacks:
  - `INTEGRATION_EXTERNAL_JOBS_BASE_URL`
  - `INTEGRATION_EXTERNAL_JOBS_TOKEN_REF`

## External Jobs Callback Ownership

- Callback base URL owner: `$platform-devops-agent`
- Callback token owner: `$platform-devops-agent`
- Source-of-truth:
  - Base URL: staging runtime env contract (`INTEGRATION_EXTERNAL_JOBS_BASE_URL`)
  - Token reference: `1password://simoona/staging/integrations/external-jobs/token`

## Failure-Path Coverage

Smoke verifier runs deterministic read-only failure simulations per provider:

- timeout simulation
- auth-failure simulation

The smoke report prints separate sections for:

- `readiness` (env/file/ownership checks)
- `failure-path` (simulated runtime failure handling checks)

## Incident and Rollback-Safe Remediation

### OAuth external auth

Remediation key: `oauth-timeout`
- Validate auth provider health/status page and DNS routing.
- Temporarily degrade to retry/backoff mode while preserving token endpoint compatibility.
- Keep legacy auth fallback procedure available until incident closes.

Remediation key: `oauth-auth-failure`
- Rotate OAuth client secret reference in secret manager.
- Validate redirect URI/client ID alignment before re-enabling strict gate.
- Roll back to last known-good secret reference if new reference fails.

### SMTP email

Remediation key: `smtp-timeout`
- Validate SMTP host reachability and port policy.
- Switch to secondary relay profile if primary timeout persists.
- Keep notification queue idempotent and retry-safe while relay is degraded.

Remediation key: `smtp-auth-failure`
- Rotate SMTP credential reference and validate sender identity.
- Re-run smoke in strict mode before enabling production mail jobs.
- Roll back to previous credential reference if authentication remains broken.

### Storage media

Remediation key: `storage-timeout`
- Validate storage endpoint health and network policies.
- Enable read-only degraded mode for file/media operations when needed.
- Retry with bounded backoff; rollback to previous endpoint reference if latency spike persists.

Remediation key: `storage-auth-failure`
- Rotate access/secret key references and validate bucket policy bindings.
- Re-run strict smoke before restoring write operations.
- Roll back to previously validated key references on repeated auth failure.

### External jobs callbacks

Remediation key: `external-jobs-timeout`
- Validate callback base URL routing and upstream worker health.
- Pause non-critical callback-triggered jobs until route recovers.
- Use rollback-safe retry schedule to avoid duplicate side effects.

Remediation key: `external-jobs-auth-failure`
- Rotate callback token reference and verify consumer token validation config.
- Re-run strict smoke and targeted callback probe before resuming jobs.
- Roll back to last known-good callback token reference if failures persist.

## Secret Handling Rules

- Do not commit raw secret values or local `.env` credentials.
- Commit only env variable names and secret reference strings.
- Resolve secret reference values at runtime from approved secret manager tooling.

## Read-Only Semantics

- Smoke checks perform read-only validation of contracts, references, and deterministic failure simulations.
- No mutation calls are executed against third-party providers.
