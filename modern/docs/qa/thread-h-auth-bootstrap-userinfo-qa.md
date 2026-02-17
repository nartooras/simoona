# QA Report: thread-h-auth-bootstrap-userinfo

## Scope
- Validated branch: `codex/thread-h-auth-bootstrap-userinfo`
- Reviewer decision gate required: `CONTINUE_TO_QA`
- Reviewer decision observed: `CONTINUE_TO_QA` (from `modern/docs/reviews/thread-h-auth-bootstrap-userinfo-review.md`)

## 1) Test Matrix
| Area | Status | Evidence |
|---|---|---|
| Workspace install | Tested | `pnpm install` PASS |
| Architecture boundary check | Tested | `pnpm run arch:check` PASS |
| Lint | Tested | `pnpm lint` PASS |
| Typecheck | Tested | `pnpm typecheck` PASS |
| JS/TS tests | Tested | `pnpm test` PASS |
| JS/TS build | Tested | `pnpm build` PASS |
| .NET build | Tested | `dotnet build modern/apps/api/Simoona.Modern.Api.sln` PASS |
| .NET tests | Tested | `dotnet test modern/apps/api/Simoona.Modern.Api.sln --no-build` PASS |
| Runtime smoke: webapp | Tested | Dev server startup + `HTTP 200` |
| Runtime smoke: API | Tested | Startup + endpoint probes validated with required JWT env config |
| Artifact hygiene | Tested | No tracked generated artifacts |
| Staging/prod smoke | Not tested | Out of scope for local QA run |

## 2) CI Parity Check
- `pnpm install` -> PASS
- `pnpm run arch:check` -> PASS
- `pnpm lint` -> PASS
- `pnpm typecheck` -> PASS
- `pnpm test` -> PASS
- `pnpm build` -> PASS
- `dotnet build modern/apps/api/Simoona.Modern.Api.sln` -> PASS
- `dotnet test modern/apps/api/Simoona.Modern.Api.sln --no-build` -> PASS
- `git status --short` -> PASS (clean before QA doc write)
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'` -> PASS (no matches; `rg` exits 1 when no matches)

## 3) Runtime Smoke Evidence
- Webapp smoke:
  - `VITE v7.3.1 ready in 183 ms`
  - `Local: http://localhost:5173/`
  - Probe: `HTTP/1.1 200 OK`
- API smoke:
  - Default `dotnet run` without JWT config failed fast with: `Missing required configuration 'Auth:Jwt:Issuer'`.
  - With documented local env values (`Auth__Jwt__Issuer`, `Auth__Jwt__Audience`, `Auth__Jwt__SigningKey`) API started:
    - `Now listening on: http://localhost:5187`
    - Root probe: `HTTP/1.1 404 Not Found`
    - Protected endpoint probe (`/api/v1/account/user-info` with only `X-Org-Id`): `401`

## 4) Architecture Compliance
Validated against:
- `modern/docs/architecture.md`
- `modern/docs/adr/0001-modernization-structure.md`
- `modern/docs/adr/0002-read-only-first-data-migration.md`

Result:
- `pnpm run arch:check` PASS.
- No detected `modern/** -> src/**` violations.
- Auth/bootstrap changes remain within `modern/**` boundaries and align with security/auth trajectory in architecture baseline.

## 5) Risks / Gaps
- Local API startup now depends on explicit JWT env configuration; missing vars cause immediate startup failure.
- Runtime smoke required escalated execution due sandbox port-binding restrictions.
- No staging/production validation performed in this QA pass.

## 6) Final Decision
GO
