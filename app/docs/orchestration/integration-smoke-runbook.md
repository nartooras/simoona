# Integration Smoke Harness Runbook

Date: `2026-02-20`
Phase: `Phase 5 - Integration Parity`
Owner role: `$platform-devops-agent`

## Objective

Provide a deterministic, secret-safe integration smoke baseline for critical providers (`oauth`, `smtp`, `storage`, `external-jobs`) and staging prerequisites.

## Commands

Run from repository root:

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations
```

Strict gate mode (`fails` if gate-critical providers are not ready):

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app smoke:integrations:strict
```

## Contract Artifacts

- Contract: `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-smoke-contract.json`
- Verifier: `/Users/arturasnikoncukas/code/repo/simoona/app/infra/scripts/verify-integration-smoke.mjs`

## Environment Contract (secret-safe)

The following names are required by the smoke contract. Use external secret stores for `*_REF` variables.

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

## Secret Handling Rules

- Do not commit secret values or `.env` files with real credentials.
- Commit only contract variable names and secret reference keys.
- Resolve secret reference values at runtime from approved secret manager/tooling.

## Read-only Check Semantics

- Smoke command performs read-only validation of env contract presence/shape and prerequisite evidence files.
- No mutation calls are executed against external providers.
- `smoke:integrations` always reports blockers without failing baseline command.
- `smoke:integrations:strict` is used for gate enforcement.
