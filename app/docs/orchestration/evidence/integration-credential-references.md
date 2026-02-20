# Integration Credential References and Ownership (Phase 5)

Date: `2026-02-20`
Phase: `Phase 5 - Integration Parity`

## Source Files

- `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-smoke-contract.json`
- `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-staging-credential-references.env`

## Provider Ownership Matrix

| Provider | Owner role | Source of truth | Staging status |
| --- | --- | --- | --- |
| OAuth/external auth | `$platform-devops-agent` | `1password://simoona/staging/integrations/oauth` | `ready` |
| SMTP/email | `$platform-devops-agent` | `1password://simoona/staging/integrations/smtp` | `ready` |
| Storage/media | `$platform-devops-agent` | `1password://simoona/staging/integrations/storage` | `ready` |
| External jobs/callbacks | `$platform-devops-agent` | `1password://simoona/staging/integrations/external-jobs` | `ready` |

## External Jobs Callback Contract Ownership

| Contract field | Owner role | Source of truth |
| --- | --- | --- |
| `INTEGRATION_EXTERNAL_JOBS_BASE_URL` | `$platform-devops-agent` | staging runtime env contract |
| `INTEGRATION_EXTERNAL_JOBS_TOKEN_REF` | `$platform-devops-agent` | `1password://simoona/staging/integrations/external-jobs/token` |

## Security Notes

- The env contract stores only non-secret values and secret reference pointers.
- No raw provider credentials are committed in repository files.
- Secret material is resolved at runtime from external secret manager tooling.
