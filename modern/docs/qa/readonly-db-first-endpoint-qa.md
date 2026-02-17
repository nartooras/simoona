# QA Report: readonly-db-first-endpoint

## Scope
- QA branch: `codex/qa-readonly-db-first-endpoint`
- Feature branch validated: `codex/review-readonly-db-first-endpoint`
- Validation date: 2026-02-17 (local)
- Environment: macOS (arm64)

## Toolchain / Runtime Assumptions
- Node.js: `v22.14.0` (meets `Node.js 22+` from `MODERNIZATION.md`)
- pnpm: `10.12.1` (matches root `packageManager: pnpm@10.12.1`)
- .NET SDK: `9.0.305`
- CI-target .NET: `8.0.x` (`.github/workflows/modernization-ci.yml`)
- API project target: `net8.0` (validated by successful build/test)

## Test Matrix
| Area | Check | Status | Evidence |
|---|---|---|---|
| Workspace deps | `pnpm install` | PASS | Lockfile up to date; install completed |
| JS lint | `pnpm lint` | PASS | ESLint finished for modern packages |
| JS typecheck | `pnpm typecheck` | PASS | TypeScript checks completed |
| JS tests | `pnpm test` | PASS | Vitest + Node tests passed |
| JS build | `pnpm build` | PASS | Vite build succeeded |
| API build | `dotnet build modern/apps/api/Simoona.Modern.Api.sln` | PASS | Build succeeded, 0 warnings/errors |
| API tests | `dotnet test modern/apps/api/Simoona.Modern.Api.sln --no-build` | PASS | 10/10 tests passed |
| Artifact hygiene | `git ls-files \| rg '(^\|/)node_modules/\|(^\|/)dist/\|(^\|/)bin/\|(^\|/)obj/'` | PASS | No matches |
| Webapp runtime smoke | `pnpm --filter @simoona/webapp dev --host` | PASS | Local server started; `GET /` returned `HTTP/1.1 200 OK` |
| API runtime smoke | `dotnet run --project ...` (default) | FAIL | Fails with `Dynamic port binding is not supported when binding to localhost` due `applicationUrl: http://localhost:0` launch profile |
| API runtime smoke (workaround) | `ASPNETCORE_URLS=http://127.0.0.1:5085 dotnet run --no-launch-profile --project ...` | PASS | `/health` 200, `/api/v1/ping` 200, `/api/v1/tenant-context` returns header-derived context, `/api/v1/account/user-info` returns 401 without auth |

## Functional Smoke Evidence
- Webapp:
  - Dev server booted (`VITE v7.3.1 ready`).
  - Probe result: `GET http://127.0.0.1:4173/` -> `200 OK`.
- API (with explicit URL + no launch profile):
  - `GET /health` -> `200` with `{"status":"healthy"}`.
  - `GET /api/v1/ping` -> `200` with `{"message":"pong"}`.
  - `GET /api/v1/tenant-context` (no headers) -> `{"tenantId":null,"organizationId":null}`.
  - `GET /api/v1/tenant-context` (`X-Tenant-Id: qa-tenant`, `X-Org-Id: 42`) -> `{"tenantId":"qa-tenant","organizationId":"42"}`.
  - `GET /api/v1/account/user-info` without bearer token -> `401 Unauthorized`.

## CI Parity Check
CI workflow (`.github/workflows/modernization-ci.yml`) enforces:
- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
- `dotnet build modern/apps/api/Simoona.Modern.Api.sln`
- `dotnet test modern/apps/api/Simoona.Modern.Api.sln --no-build`

Local QA run matched all enforced quality gates (install command run without `--frozen-lockfile`, but lockfile was unchanged and all downstream gates passed).

## Risks / Gaps
1. Local API run command documented in `MODERNIZATION.md` (`dotnet run --project ...`) is currently unreliable with existing launch profile (`http://localhost:0`) and fails on this macOS environment.
2. Runtime smoke did not validate a successful authenticated `GET /api/v1/account/user-info` 200-path because no test JWT/token issuer was configured for manual local run.

## Release Recommendation
**NO-GO** until local API startup command/path is corrected (either launch profile update or docs updated to include `--no-launch-profile` plus explicit URL binding). All CI parity gates pass, but local runtime startup mismatch is a release-readiness blocker for reproducible macOS validation.
