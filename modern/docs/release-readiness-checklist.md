# Release Readiness Checklist

Use this checklist before enabling broader traffic to the migrated modern surface (webapp routes + modern API endpoints).

## Pre-deploy Checks

- Confirm migration scope is unchanged from the approved cutover target:
  - `/user-info`
  - `/settings/general`
  - `/employees`
  - `/profiles/me`
  - `GET /health`
  - `GET /api/v1/account/user-info`
  - `GET /api/v1/user/general-settings`
  - `GET /api/v1/employees`
  - `GET /api/v1/profiles/me`
- Confirm environment config is present for auth bootstrap and API access:
  - `Auth__Jwt__Issuer`
  - `Auth__Jwt__Audience`
  - `Auth__Jwt__SigningKey` (or authority mode per environment)
  - `ConnectionStrings__LegacyReadOnly`
- Confirm boundary guardrails remain clean (`pnpm run arch:check`).
- Confirm no generated artifacts are tracked in Git.

## Smoke Test Command Sequence

Run from repository root:

```bash
pnpm install
pnpm run arch:check
pnpm smoke
```

`pnpm smoke` runs:

1. Modern webapp smoke route checks (app shell + migrated routes).
2. Modern API smoke probes:
   - `/health`
   - unauthorized baseline for migrated authenticated endpoints (`401`)
   - authenticated happy-path probes using development token bootstrap.

For CI/manual workflow runs:

```bash
pnpm smoke:ci
```

## Pass/Fail Gate Criteria

Promote only if all criteria below are true:

- `pnpm smoke` exits with code `0`.
- No smoke assertion failures on route reachability or API status expectations.
- No auth bootstrap failures while minting test token in Testing/Development environments.
- Required baseline pipeline checks are green (`lint`, `typecheck`, `test`, `build`, and modern API build/test).

Any failed smoke assertion is a release gate failure.

## Rollback Triggers

Trigger rollback or cutover pause if any of the following appear after enabling traffic:

- Sustained `401`/`403` spikes on migrated endpoints caused by auth/bootstrap mismatch.
- Sustained `5xx` increase on `/api/v1/account/user-info`, `/api/v1/user/general-settings`, `/api/v1/employees`, or `/api/v1/profiles/me`.
- Modern webapp route regressions where migrated routes fail to render primary page shell/title.
- Read-only DB path errors indicating connectivity or schema mismatch.

## Known Risks and Mitigations

- Risk: token/organization mismatch during cutover.
  - Mitigation: keep unauthorized/forbidden smoke baselines and validate org header wiring in environment config.
- Risk: legacy DB schema drift impacting read models.
  - Mitigation: run smoke after deployment to each environment and track endpoint error rates.
- Risk: partial route rollout without matching API readiness.
  - Mitigation: treat web route smoke and API smoke as a single gate; do not promote on partial pass.
