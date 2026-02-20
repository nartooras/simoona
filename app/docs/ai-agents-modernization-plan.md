# Simoona Modernization Plan (Full Legacy Parity, `/app` Big-Bang Cutover)

## Summary
Modernize Simoona into a new solution at `/Users/arturasnikoncukas/code/repo/simoona/app` while leaving `/Users/arturasnikoncukas/code/repo/simoona/src` and `/Users/arturasnikoncukas/code/repo/simoona/build` unchanged as reference.

Locked decisions from this planning session:
- Frontend: `React + Vite + TypeScript`.
- Backend: `Node.js + NestJS + TypeScript`.
- Compatibility target: `strict HTTP API + UI behavior parity` with legacy.
- Scope: `all functionality` (core + premium + optional modules), nothing omitted.
- Data: keep legacy `SQL Server` schema behavior-compatible; use managed remote SQL locally.
- Local run: `Docker Compose first` on MacBook Air M3.
- Integrations: `critical real only` (real auth/email/storage where required).
- Cutover: deploy separately, migrate DB/files in weekend window.
- Team baseline for estimates: `2-3 parallel AI agents` + `1 part-time human reviewer`.
- Deploy target: Docker on VM.

## Target Architecture and Folder Structure
Create this structure under `/Users/arturasnikoncukas/code/repo/simoona/app`:
- `/Users/arturasnikoncukas/code/repo/simoona/app/web`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/config`
- `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e`
- `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity`
- `/Users/arturasnikoncukas/code/repo/simoona/app/infra/docker`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity`

Technology choices:
- Web: React, TypeScript strict mode, Vite, React Router, TanStack Query, i18next, React Hook Form + Zod, Framer Motion.
- API: NestJS modular monolith, TypeORM with SQL Server driver, BullMQ/Redis for jobs/queues.
- Contracts: OpenAPI-first from legacy behavior snapshots + generated typed clients.
- Styling: CSS variables + SCSS modules; legacy visual parity first, subtle animation layer second.
- Runtime: Docker Compose for local; Docker images for VM deploy.

## Public APIs, Interfaces, and Type Contracts
Required compatibility rules:
- Keep legacy REST route paths/methods/status codes/payload shapes/error shapes.
- Keep auth HTTP behavior compatible (`/token`, account endpoints, refresh flow semantics).
- Keep frontend URLs and route behavior equivalent to legacy states.
- Keep localization behavior (`lt_LT`, `en_US`) and translation keys functionally equivalent.
- Keep file/media URL behavior and upload/download semantics compatible.

Allowed additions:
- Internal-only observability endpoints (`/healthz`, `/readyz`, `/metrics`) outside legacy contract surface.
- Internal package APIs in `/app/packages/*` for shared types/components.

## Phase Plan

## Phase 0: Parity Baseline and Inventory (3-4 weeks)
- Build complete parity matrix from legacy source plus golden runtime captures.
- Produce:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-route-matrix.csv`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/feature-checklist.md`
- Capture golden request/response fixtures for all API endpoints and key UI flows.
- Define acceptance gates per feature (API, UI, data, background jobs, integrations).

Exit criteria:
- 100% legacy controllers/routes mapped to new target modules.
- 100% frontend routes/features mapped to new route/component targets.
- Golden baseline fixtures versioned and runnable in CI.

## Phase 1: Platform Foundation in `/app` (3-4 weeks)
- Initialize monorepo tooling, linting, typecheck, test runners, commit hooks.
- Build Docker Compose topology: web, api, redis, local helpers; managed remote SQL connection profile.
- Create shared config package with environment profiles (`dev`, `staging`, `prod`).
- Add CI pipeline: lint, typecheck, unit, parity tests, e2e smoke.
- Add architecture decision records in `/Users/arturasnikoncukas/code/repo/simoona/app/docs/adr`.

Exit criteria:
- One-command local bootstrap documented and reproducible on M3.
- CI green on empty skeleton with quality gates enforced.

## Phase 2: Core Compatibility Layer (6-8 weeks)
- Implement NestJS core modules: tenant resolution, auth, permissions, user context, error mapping.
- Implement compatibility middleware for legacy response/error/date/pagination conventions.
- Implement foundational web shell: auth boundary, tenant-aware routing, top-level layout.
- Build contract-test harness that runs modern API against golden fixtures.

Exit criteria:
- Core auth + tenant + permission flows pass parity tests.
- Web shell reproduces legacy entry/login/org switch behaviors.

## Phase 3: UI Parity Foundation and Design Modernization (5-6 weeks)
- Recreate legacy UI component primitives in `/app/packages/ui` with same behavior.
- Extract and normalize legacy visual tokens, spacing, typography, color.
- Add subtle animation system:
  - page transitions 120-180ms
  - micro-interactions 100-160ms
  - reduced-motion support mandatory
- Build visual regression pipeline at desktop/tablet/mobile breakpoints.

Exit criteria:
- Pixel/behavior parity on shell and shared components.
- Animation layer active without changing information architecture or user flows.

## Phase 4: Feature Porting Waves (16-24 weeks, sequential waves with limited overlap)
Wave A (Social Core):
- Wall, posts, comments, notifications, realtime UX behavior.

Wave B (People and Organization):
- Users, employee list, profile, org structure, roles, job types, skills.

Wave C (Office and Resources):
- Office/floor/room/room type, projects, certificates, pictures, books.

Wave D (Engagement):
- Events/calendar/join/reporting, kudos, lotteries, vacations, committee.

Wave E (Admin and Customization):
- Settings, localization, external links, filter presets, support, service request, classifiers.

Wave F (Premium and Extended):
- Premium endpoints, background workers, recurring jobs, monitor/external job flows.

Per-wave exit criteria:
- API contract parity: 100% pass for wave endpoints.
- UI parity: route-level e2e pass + visual diff approved.
- No unresolved P0/P1 defects before next wave.

## Phase 5: Integration Parity (5-6 weeks)
- Real provider implementations for critical integrations:
  - OAuth social providers in scope
  - SMTP/email delivery
  - storage provider behavior
- Keep fallback stubs only for non-critical local flows.
- Verify integration behavior with staging credentials.

Exit criteria:
- Critical integrations pass parity scenarios end-to-end.

## Phase 6: Data and File Migration Tooling (5-6 weeks)
- Build idempotent migration toolchain:
  - DB snapshot import/transform/validate
  - file/media copy + integrity checks
- Use staging SQL clone for repeated rehearsals.
- Produce operational runbooks:
  - pre-cutover checklist
  - cutover execution script
  - rollback script

Exit criteria:
- At least 2 full dry-runs complete successfully.
- Migration duration fits weekend window target.

## Phase 7: Hardening, UAT, and Release Readiness (5-6 weeks)
- Full regression across all parity matrix items.
- Performance and load baselines vs legacy critical flows.
- Security checks: auth boundaries, permission enforcement, secret handling.
- Final UAT with business owners using full checklist.

Exit criteria:
- 0 open P0/P1 defects.
- Go-live sign-off across engineering + product + operations.

## Phase 8: Weekend Cutover and Hypercare (1-2 weeks incl. weekend)
- Deploy new stack separately.
- Weekend plan:
  - Freeze legacy writes
  - Final DB/files migration
  - Validation suite run
  - DNS/traffic switch
- Hypercare week with rollback window and intensified monitoring.

Exit criteria:
- Stable operation under production load.
- Legacy app retired to read-only backup state.

## Team Model and Estimates (AI-Agent Adapted)
Recommended parallel roles:
- Agent 1: API/domain migration (NestJS + SQL compatibility).
- Agent 2: Web/UI parity migration (React + animations + e2e).
- Agent 3 (if available): parity harness, migration tooling, CI/release automation.
- Human reviewer: part-time quality gate + merge control + release approval.

Calendar estimate:
- With 2 agents: **48-56 weeks**.
- With 3 agents: **36-44 weeks**.

These ranges already assume AI-assisted coding with human review bottlenecks and strict parity gates.

## Test Cases and Scenarios (Mandatory)
- API contract parity tests for all mapped endpoints from legacy matrix.
- Auth scenarios:
  - login/logout/token refresh
  - tenant/org switching
  - permission-denied/error shape parity
- UI e2e scenarios for every legacy route group and role-based path.
- Visual regression snapshots for all major screens in both locales.
- Data migration tests:
  - counts/checksum/reference integrity
  - idempotent rerun behavior
  - rollback rehearsal
- Background job and notification scenarios (including premium paths).
- Integration tests with real critical providers.
- Performance smoke and soak tests for high-traffic flows.

## Assumptions and Defaults
- Legacy code in `/Users/arturasnikoncukas/code/repo/simoona/src` and `/Users/arturasnikoncukas/code/repo/simoona/build` remains untouched and reference-only.
- Golden baseline artifacts are available/maintained throughout implementation.
- Managed remote SQL and staging clone access remain stable.
- Docker-on-VM is the deployment baseline (not Kubernetes).
- Big-bang release remains fixed; phased work is internal delivery sequencing only.
- “Same functionality” is enforced by parity matrix completion plus automated test gates, not by selective feature deferral.
