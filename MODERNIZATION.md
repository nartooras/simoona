# Modernization Workspace Foundation

This repository now includes a root `pnpm` workspace and a modern .NET API skeleton for incremental modernization work that coexists with the legacy applications.

## Scope

- Modern workspace apps live under `modern/apps/*`.
- Modern shared packages live under `modern/packages/*`.
- Modern API skeleton lives under `modern/apps/api/*`.
- Legacy `src/webapp` keeps its current npm/bower-based flow.
- Legacy `src/api` keeps its current .NET flow.
- Coexistence rule: modernization work must not modify legacy AngularJS runtime behavior in `src/webapp`.

## Prerequisites

- Node.js 22+
- pnpm 10+

## Install

```bash
pnpm install
```

## Root Commands

- `pnpm lint`: run lint checks for modern workspace packages.
- `pnpm format`: format modernization workspace files with Prettier.
- `pnpm format:check`: verify modernization workspace formatting without modifying files.
- `pnpm typecheck`: run TypeScript no-emit checks for modern workspace packages.
- `pnpm test`: run workspace tests.
- `pnpm smoke`: run release-readiness smoke checks (modern webapp route smoke + modern API smoke probes).
- `pnpm smoke:ci`: run smoke checks in CI-friendly reporter mode.
- `pnpm demo:check`: run hard-gate demo readiness checks (env consistency, critical route wiring, API health/auth baselines). Use `pnpm demo:check -- --ci` for CI-safe gate path.
- `pnpm demo:start`: start modern API + webapp in deterministic demo mode after preflight and API auth baseline validation.
- `pnpm demo:stop`: deterministically stop local demo API/webapp processes started by `demo:start`.
- `pnpm build`: run workspace builds.
- `pnpm modern:api:build`: run `dotnet build` for modern API solution only.
- `pnpm modern:api:test`: run `dotnet test` for modern API tests only.

## Demo Readiness

Stakeholder demo pack and operational baseline:

- `modern/docs/demo-runbook.md` (10-15 minute operator walkthrough + expected outcomes)
- `modern/docs/demo-acceptance-checklist.md` (`met` / `partial` / `deferred` decision checklist)
- `modern/docs/demo-known-gaps-matrix.md` (prioritized known gaps vs legacy)
- `modern/docs/prototype-shell-parity.md` (route availability/source-of-truth parity framing)
- `modern/docs/release-readiness-checklist.md` (release/smoke gating baseline)

### Current Demo Baseline

- Parity-acceptable now:
  - Wave 6 shell/wall parity geometry remains stable, and Wave 7 unifies theme tokens + shared UI primitives across shell/pages/widgets to remove cross-route visual drift.
  - Walls IA now matches legacy navigation semantics: mandatory `Official wall` (`/`), dedicated `All walls` (`/walls`), and subscribed wall feed routes (`/walls/<id>`).
  - Major route destinations are non-empty and render consistent route contract + availability metadata (`real` / `mock` / `disabled`).
  - Demo orchestration checks provide explicit diagnostics for occupied ports, API reachability failures, read-DB availability failures, and missing env/token setup.
- Known remaining gaps:
  - mock-backed routes remain deterministic fixtures until read contract migration waves are complete.
  - write-heavy workflows stay intentionally disabled or local-only simulation in prototype mode (wall interactions remain non-persistent).
- Exact demo flow references:
  - `modern/docs/demo-runbook.md` (section `3) 10-15 Minute Walkthrough Script`)
  - `modern/docs/demo-acceptance-checklist.md`
  - `modern/docs/demo-known-gaps-matrix.md`
  - `modern/docs/prototype-shell-parity.md`

Canonical command flow for local demos:

```bash
pnpm demo:check
pnpm demo:start
pnpm demo:stop
```

CI-safe readiness gate:

```bash
pnpm demo:check -- --ci
```

## Modern API Commands

Use these from repository root to work with the modern API only:

```bash
dotnet build modern/apps/api/Simoona.Modern.Api.sln
dotnet test modern/apps/api/Simoona.Modern.Api.sln
dotnet run --project modern/apps/api/src/Simoona.Modern.Api/Simoona.Modern.Api.csproj
```

Default Development launch profile binds to `http://localhost:5187`.

Default routes in this modernization skeleton:

- `GET /health`
- `GET /api/v1/ping`
- `GET /api/v1/tenant-context` (reads `X-Tenant-Id` and `X-Org-Id` headers)

OpenAPI/Swagger UI is enabled in Development environment.

## Read-only DB Integration Milestone

Modern API now includes a read-only EF Core integration against the legacy SQL Server schema for real migrated endpoints.

- Read DB context: `ModernReadDbContext` (`AspNetUsers` projection only for this milestone).
- Safety guard: `ReadOnlySaveGuardInterceptor` throws for any `SaveChanges` invocation to enforce no writes.
- Implemented endpoint: `GET /api/v1/account/user-info`.
  - Reads user by `userId` + `organizationId` from DB.
  - Requires authenticated caller.
  - Requires organization header: `X-Org-Id` (or `Organization`) and user context from JWT claims.
  - Temporary `X-User-Id` header fallback is enabled for Development/Testing only.

## General Settings Read Endpoint (API-backed)

Modern API now also exposes the General Settings read contract with read-only legacy data access:

- Implemented endpoint: `GET /api/v1/user/general-settings`.
  - Reads current user `CultureCode` and `TimeZone` from `AspNetUsers`.
  - Returns language options (`en-US`, `lt-LT`) and system time zones in legacy-compatible shape.
  - Uses the same authenticated user + org scope enforcement flow as `GET /api/v1/account/user-info`.
  - Returns `404 Not Found` when the user does not exist in the requested organization.

### Local Run/Config Notes

Set required API config via environment variables:

```bash
export ConnectionStrings__LegacyReadOnly="Server=localhost;Database=Simoona;Integrated Security=true;TrustServerCertificate=true;Application Intent=ReadOnly"
export Auth__Jwt__Issuer="https://local.simoona.test"
export Auth__Jwt__Audience="modern-api"
export Auth__Jwt__SigningKey="dev-local-signing-key-change-me-000001"
export Auth__Jwt__Authority=""
export Auth__DevToken__Enabled="true"
dotnet run --project modern/apps/api/src/Simoona.Modern.Api/Simoona.Modern.Api.csproj
```

Behavior notes:

- `Application Intent=ReadOnly` is included by default in modern API appsettings.
- This milestone does not include write endpoints and blocks writes at EF interception level.
- JWT bootstrap validates issuer, audience, signature, and lifetime. In non-dev environments, authority mode is required.

### Local Auth Bootstrap Runbook

1. Start modern API with the env vars shown above.
2. Generate a dev JWT (Development/Testing only, and only when `Auth__DevToken__Enabled=true`):

```bash
curl -s -X POST http://localhost:5187/api/v1/dev-auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-1","organizationId":"7","tenantId":"tenant-a","expiresMinutes":60}'
```

3. Use `accessToken` from response when calling user info:

```bash
curl -i http://localhost:5187/api/v1/account/user-info \
  -H "X-Org-Id: 7" \
  -H "Authorization: Bearer <accessToken>"
```

Expected endpoint behavior:

- Missing token: `401 Unauthorized`
- Invalid token: `401 Unauthorized`
- Token `org_id` claim and `X-Org-Id` mismatch: `403 Forbidden`
- Valid token + matching `X-Org-Id` + user exists: `200 OK`
- Missing/invalid org header: `400 Bad Request`
- Valid auth but no matching user in org: `404 Not Found`

## API Contract Baseline

A first-pass legacy-to-modern API contract baseline for prioritized migration endpoints lives at:

- `modern/docs/api-contracts.md`
- `modern/docs/release-readiness-checklist.md`

## Architecture Baseline and ADRs

Modernization architecture source of truth:

- `modern/docs/architecture.md`

Architecture decisions (ADRs):

- `modern/docs/adr/`

Use these as default references before implementing modernization changes.

## Auth Migration Direction

Auth migration source of truth:

- `modern/docs/auth-migration.md`
- `modern/docs/adr/0003-auth-migration-strategy.md`

Any modernization thread that changes authenticated endpoints, tenant/org resolution, claims handling, token/session lifecycle, or authorization policies must consult and reference both documents before implementation and review.

## Architecture Guardrail

Boundary check for forbidden modern-to-legacy imports/references:

```bash
pnpm run arch:check
```

This check is also included in root `pnpm lint`.
Coverage includes `import/export ... from`, `import("...")`, and `require("...")` forms for `src/**`, `@/src/**`, `../src/**`, and absolute `.../src/**` paths, with tests in `modern/scripts/check-modern-boundaries.test.mjs`.

## Data Migration Dry-Run v1

Read-only migration rehearsal tooling now lives under:

- `modern/tools/migration/`

Scope covered by v1:

- users/profile basics
- organization references
- employee directory fields
- general settings essentials

Primary command:

```bash
pnpm migration:dryrun:v1 --input modern/tools/migration/fixtures/legacy-export-sample.json --output-dir /tmp/simoona-migration-dryrun-v1 --mode dry-run
```

Safety guardrails:

- default mode is `dry-run`
- `--mode write` is explicitly blocked and not implemented
- scripts print warning banners before execution

Environment variables (optional):

- `MIGRATION_INPUT_PATH`
- `MIGRATION_OUTPUT_DIR`
- `MIGRATION_MODE`
- `MIGRATION_SOURCE`

Expected output artifacts (example output dir):

- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.extracted.json`
- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.transformed.json`
- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.report.json`
- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.report.md`

Machine-readable report fields include extracted/transformed counts, validation errors/warnings, and unmapped fields.

Detailed runbook:

- `modern/docs/migration/dryrun-v1.md`
- `modern/docs/migration/dryrun-v1-report-template.md`

## New React Webapp App

App path: `modern/apps/webapp`

Commands:

- `pnpm --filter @simoona/webapp dev --host`: run the Vite dev server.
- `pnpm --filter @simoona/webapp lint`: lint the package.
- `pnpm --filter @simoona/webapp typecheck`: run package type checks.
- `pnpm --filter @simoona/webapp test`: run Vitest + React Testing Library tests.
- `pnpm --filter @simoona/webapp build`: build production assets with Vite.

Environment:

- `VITE_DEMO_MODE` (required for demo orchestration): when `true`, adapter selection is deterministic by route/slice:
  - real-backed: `/health`, `/user-info`, `/settings/general`, `/employees`, `/profiles/me`
  - mock-backed: `/`, `/walls`, `/walls/engineering-wall`, `/walls/culture-wall`, `/walls/newcomers-wall`, `/activities/feed`, `/recognition`, `/events`, `/vacations`, `/kudos`, `/books`, `/teams`, `/projects`, `/office-map`, `/organization/structure`, `/committees`
  - disabled-backed: `/service-requests`, `/externals/integrations`
- `VITE_API_BASE_URL` (optional): base URL used by the modern webapp API client.
  - default: `/api`
  - user info endpoint call resolves to `${VITE_API_BASE_URL}/v1/account/user-info` (or `/api/v1/account/user-info` by default).
- `VITE_API_ORGANIZATION_ID` (required for current user-info integration): numeric organization id sent as `X-Org-Id` header.
  - example: `VITE_API_ORGANIZATION_ID=7`
- `VITE_API_BEARER_TOKEN` (optional): token sent as `Authorization: Bearer <token>` for user-info calls.

Deterministic demo orchestration artifacts:

- `modern/docs/demo-runbook.md`
- `modern/docs/demo-acceptance-checklist.md`
- `modern/docs/demo-known-gaps-matrix.md`

### Wave 1A Shell Geometry + Header/Nav Parity

Wave 1A locks deterministic desktop shell geometry for core wall parity in `modern/apps/webapp` using CSS geometry tokens.

| Geometry target | Value |
|---|---|
| Header height | `44px` |
| Sidebar width | `236px` |
| Content max width (center stream) | `748px` |
| Right rail width | `272px` |
| Core spacing (main gutter) | `18px` |
| Sidebar nav row height | `31px` |

Scope covered:

- top header parity pass (brand alignment, search placement, quick actions/user affordance rhythm)
- sidebar/nav parity pass (group headings, active-row treatment, denser grouped navigation spacing)
- deterministic structure baseline tests for home shell and app layout
- Wave 1B visual baseline scaffold at `modern/apps/webapp/src/smoke/ShellVisualBaseline.scaffold.ts`

Deferred to Wave 1B:

- automated screenshot pixel-diff assertions using the scaffold spec
- feed/widget card micro-geometry parity (inner paddings, offsets, and exact iconography)
- legacy icon sprite parity and advanced interaction chrome details

## Frontend Migration Wave 1

Wave 1 migration details:

- `modern/docs/frontend-migration-wave1.md`

Current migrated scope vs legacy:

| Area | Legacy route/API | React route | Status |
|---|---|---|---|
| Current user context | `GET /Account/UserInfo` | `/user-info` | Migrated on modern API |
| General settings (read) | `/:organizationName/Settings/General` + `GET /User/GeneralSettings` | `/settings/general` | Migrated on modern API |
| General settings (write) | `PUT /User/GeneralSettings` | N/A | Still legacy |

## Frontend Migration Wave 2

Wave 2 migration details:

- `modern/docs/frontend-migration-wave2.md`

Current migrated scope vs legacy:

| Bucket | Items | Endpoint status |
|---|---|---|
| Migrated now (Wave 2) | Employee Directory (`/employees`) | Real modern API endpoint `GET /api/v1/employees` |
| Migrated now (Wave 2) | My Profile (`/profiles/me`) | Real modern API endpoint `GET /api/v1/profiles/me` |
| Migrated in Wave 1 | User Info (`/user-info`), General Settings read (`/settings/general`) | Real modern API endpoints |
| Still legacy | General settings write, profile edit flows, non-migrated settings/profile/wall areas | Not yet migrated |

Wave 2 frontend temporary adapters have been retired from the migrated Employee Directory and My Profile screens; these routes now rely on modern API responses directly.

## Frontend Visual Parity Foundation

Visual parity baseline and implementation notes:

- `modern/docs/frontend-visual-parity.md`

Current parity snapshot:

| Area | Status |
|---|---|
| Page shell (header/sidebar/content) | matched |
| Navigation active/hover behavior | matched |
| Typography baseline | matched |
| Color system | matched |
| Spacing rhythm | partially matched |
| Table/list/card patterns | partially matched |
| Legacy iconography/module-specific chrome | not matched yet |

## Prototype Shell Parity Pass (Thread P)

Prototype shell parity details and availability map:

- `modern/docs/prototype-shell-parity.md`

Highlights from this pass:

- Modern shell navigation now follows legacy-style IA grouping (`Activities`, `Company`, `Externals`, `System`).
- Key placeholder/demo routes are visible in navigation for prototype completeness.
- Route availability labeling is explicit via `real`, `mock`, and `disabled` notices.
- Placeholder prototype routes are populated with realistic static content and non-production markers.

## Prototype Route Coverage Pack (Thread R)

Thread R extends prototype route coverage for high-visibility legacy destinations while keeping interactions safe and deterministic.

Highlights from this pass:

- Added nav/router coverage for Events, Vacations, Kudos, Books, Service Requests, Projects, Office Map, Organizational Structure, and Committees.
- Standardized all placeholder pages with explicit sections for:
  - available now
  - unavailable in prototype
  - planned next wave
- Added simulated disabled controls with explicit prototype/read-only messaging for write-heavy actions.
- Synchronized route availability + data-source behavior (`real`/`mock`/`disabled`) with demo mode determinism.
- Extended webapp route smoke/tests to cover new navigation links and route reachability.

## Prototype Polish Pack (Thread T)

Thread T finalizes prototype presentation quality for stakeholder demos while keeping behavior and architecture boundaries unchanged.

Highlights from this pass:

- Harmonized shell and route-level visual rhythm:
  - tightened notice/header/card/table spacing and heading hierarchy
  - unified navigation badge and active-state styling
- Standardized route state UX:
  - `PrototypeNotice` now has consistent severity framing for `real`, `mock`, and `disabled`
  - placeholder pages consistently declare data source and read-only expectations
- Applied pragmatic accessibility quick wins:
  - explicit navigation landmark labeling
  - improved section heading linkage via `aria-labelledby`
  - status/alert semantics for loading, warning, and error surfaces
  - disabled control descriptions tied with `aria-describedby`
- Added guard assertion to ensure navigation links and `AppRouter` route definitions stay in sync (no dead/hidden prototype routes).

## Wall Layout Parity (Thread U)

Thread U upgrades the home wall route to high-fidelity shell parity against the legacy wall screenshot while keeping prototype safety intact.

What now matches:

- Three-column composition in practice:
  - global left navigation rail with grouped sections and active-item highlight
  - center wall feed with stacked post cards
  - right compact widgets rail
- Legacy-like visual rhythm:
  - light-gray app canvas, white/near-white cards, thin subtle borders
  - compact spacing and typography hierarchy tuned for dense wall scanning
  - blue accent usage for section labels, links, and key emphasis
- Header chrome parity improvements:
  - blue global top bar with search affordance and quick user actions
- Responsive fallback:
  - side columns collapse/stack on smaller widths while preserving key feed content

Remaining differences:

- Exact legacy icon spriteography is still represented by local placeholders.
- Some micro-spacing/line-height values remain approximations rather than exact pixel parity.
- Interactive legacy wall behaviors (real reactions/comments/live counters) remain simulated or disabled in prototype mode.

## Wall Navigation Prototype (Legacy IA Alignment)

The modern shell now mirrors legacy wall IA by default: `Official wall` is mandatory (`/`), `All walls` is route-distinct (`/walls`), and subscribed walls open dedicated feed contexts (`/walls/<id>`).

Implemented prototype behavior:

- deterministic subscribed wall feeds across distinct contexts (`Engineering`, `People`, `Newcomers`)
- dedicated `All walls` directory showing official/subscribed/unsubscribed contexts
- read-side controls for deterministic sorting (`latest`, `top`) and topic filtering
- shared feed/comment card rendering reused across wall feed routes to keep anatomy/token parity consistent
- contextual right-rail widgets that switch with selected wall context
- explicit wall-specific states:
  - empty feed state (`Newcomers Wall`)
  - unavailable wall data state (`Incident Wall`)

Known limitations:

- wall IA routes are classified as `mock` / `mock-backed` in navigation metadata
- feed and widget content remain fixture-backed in demo mode
- like/reply/comment interactions are still local simulation only (no persistent writes)
- restricted incident-wall data stays unavailable until legacy access-policy migration is defined

## Events + Kudos Vertical Slice Prototype Bundle (Thread AL)

Thread AL upgrades `/events` and `/kudos` from generic placeholders to dedicated, demo-usable read-first route slices.

Implemented now:

- `/events`:
  - legacy-like grouped route layout (`Upcoming` + `Past`) with realistic date/time/location/status card hierarchy
  - deterministic read-side controls (`window`, `office`, `type`, `sort`) and local-only detail expansion
  - contextual side widgets with explicit success/empty/unavailable handling
- `/kudos`:
  - dense kudos feed hierarchy (sender -> receiver -> date -> message)
  - deterministic read-side filters (`period`, `type`, `team`) with explicit success/empty/unavailable handling
  - leaderboard/distribution side panel and clearly disabled `Give Kudos` CTA
- shared data strategy:
  - explicit typed `real | mock` adapter boundaries for both domains
  - deterministic fixtures in demo mode with no legacy runtime coupling and no persistent writes

Deferred scope (explicitly not implemented):

- Events: create/edit, RSVP persistence, reporting/export writes
- Kudos: submission/persistence flows and reward/category management writes

### Demo-ready quality checklist

| Area | Status | Notes |
|---|---|---|
| Visual consistency | ready | Typography, spacing, notice styling, and card/table rhythm aligned across migrated and placeholder routes. |
| Route coverage | ready | Navigation and route definitions are asserted as equivalent in tests. |
| Known limitations | constrained | `mock` routes remain fixture-backed; `disabled` routes remain intentionally non-interactive. |
| Presentability: Activities | ready with constraints | `/activities/feed`, `/recognition`, `/events`, `/vacations`, `/kudos`, `/books` are demo-presentable; `/service-requests` remains intentionally disabled. |
| Presentability: Company | ready | `/user-info`, `/settings/general`, `/employees`, `/profiles/me` are API-backed; `/teams`, `/projects`, `/office-map`, `/organization/structure`, `/committees` are stable mock previews. |
| Presentability: Externals | constrained | `/externals/integrations` is shown for IA parity only and clearly marked unavailable. |
| Presentability: System | ready | `/health` shows healthy baseline for demo orchestration checks. |

## CI Skeleton

Workflow file: `.github/workflows/modernization-ci.yml`

Jobs:

- `lint`: install dependencies, run `pnpm lint`
- `test`: install dependencies, run `pnpm test`
- `build`: install dependencies, run `pnpm typecheck` and `pnpm build`
- `dotnet-build`: build modern API solution with `dotnet build`
- `dotnet-test`: test modern API solution with `dotnet test --no-build`
- `smoke`: opt-in manual `workflow_dispatch` job (`run_smoke=true`) that runs `pnpm smoke:ci`

This keeps modernization checks isolated while allowing legacy systems to continue their current pipelines.
