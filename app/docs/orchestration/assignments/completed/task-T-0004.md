# Task Assignment `T-0004`

- Date assigned: `2026-02-20`
- Owner role: `$platform-devops`
- Phase: `Phase 1 - Platform Foundation in /app`
- Priority: `P1`
- Status: `COMPLETED`

## Objective

Bootstrap the Phase 1 platform skeleton under `/app` with reproducible local and CI foundations.

## Scope In

- `/Users/arturasnikoncukas/code/repo/simoona/app/web`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/config`
- `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e`
- `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity`
- `/Users/arturasnikoncukas/code/repo/simoona/app/infra/docker`

## Scope Out

- Any file changes under `/Users/arturasnikoncukas/code/repo/simoona/src/**`
- Any file changes under `/Users/arturasnikoncukas/code/repo/simoona/build/**`
- Feature implementation for legacy parity flows

## Constraints

- Keep all changes under `/Users/arturasnikoncukas/code/repo/simoona/app`.
- Preserve macOS M3 local run compatibility.
- Do not commit secrets.

## Acceptance Criteria

1. Phase 1 skeleton directories exist and are tracked under `/app`.
2. Initial command contract for `lint`, `typecheck`, `test`, `build` is documented.
3. Docker Compose baseline path and service intent are documented.
4. Validation evidence is added to orchestration status/evidence files.

## Validation Commands

```bash
test -d /Users/arturasnikoncukas/code/repo/simoona/app/web
test -d /Users/arturasnikoncukas/code/repo/simoona/app/api
test -d /Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts
test -d /Users/arturasnikoncukas/code/repo/simoona/app/infra/docker
```

## Completion Notes

- Completed on: `2026-02-20`
- Key artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/pnpm-workspace.yaml`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/foundation/command-contract.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/foundation/local-bootstrap.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/docker/docker-compose.yml`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/ci/run-foundation-ci.sh`
- Validation summary:
  - `pnpm --dir app bootstrap`: pass
  - `bash app/infra/ci/run-foundation-ci.sh`: pass
  - `pnpm --dir app build`: pass
  - `docker-compose -f app/infra/docker/docker-compose.yml config`: pass
