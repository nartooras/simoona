# Evidence

## 2026-02-22 Recovery Implementation Evidence (Baseline)

### Scope delivered in baseline change-set

1. Governance/doc synchronization baseline finalized (58/58 manifest published).
2. Gate hardening slice delivered for web/api (`lint`, `typecheck`, `test`, `build` include real syntax checks).
3. Runtime drift reduction slice delivered via shared runtime module reuse.
4. Production freeze enforcement retained with explicit override guard.

### Key baseline artifacts

- `/Users/arturasnikoncukas/code/repo/simoona/AGENTS.md`
- `/Users/arturasnikoncukas/code/repo/simoona/AGENT_QUICKSTART.md`
- `/Users/arturasnikoncukas/code/repo/simoona/README.md`
- `/Users/arturasnikoncukas/code/repo/simoona/LocalSetup.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/doc-sync-manifest.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/runtime-shared.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/main.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/live-web-runtime.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/verify-web-syntax.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api/scripts/verify-api-syntax.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/package.json`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api/package.json`
- `/Users/arturasnikoncukas/code/repo/simoona/app/infra/scripts/cloudflare-publish.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/reviews/2026-02-22-recovery-plan-implementation-review.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/qa/2026-02-22-recovery-plan-implementation-qa.md`

## 2026-02-22 `R2-AUTH-REAL-001A` Evidence

### Scope delivered in this checkpoint

1. Auth compatibility service now enforces runtime authentication context for user-info/logout/user compatibility operations.
2. Token issuing now validates credentials and supports refresh-token rotation with explicit error handling.
3. Legacy permission guard now enforces authentication and required permissions with explicit `401/403` behavior.
4. Runtime API parity server now includes token issuance, authenticated user-info, and token revocation/logout paths.
5. Dedicated runtime auth lifecycle test (`runtime:api:auth`) added.

### Key artifacts updated

- `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/services/auth-session-store.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/services/auth-compatibility.service.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/controllers/account-compatibility.controller.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/controllers/user-compatibility.controller.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/permissions/legacy-permission.guard.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api/scripts/api-runtime-check.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/auth.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/auth-claims.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/permissions.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/error-envelope.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-runtime-auth-lifecycle.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/package.json`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/reviews/2026-02-22-r2-auth-real-001-review.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/qa/2026-02-22-r2-auth-real-001-qa.md`

## 2026-02-22 `R2-AUTH-REAL-001B` Evidence

### Scope delivered in this checkpoint

1. Auth/session state moved to SQL-backed compatibility tables (`node:sqlite`) in `auth-session-store.ts`.
2. Runtime parity server auth/session store moved from in-memory maps to SQL-backed compatibility tables.
3. Unresolved `x-legacy-user-id` values no longer synthesize authenticated identities.
4. Runtime parity scripts aligned to authenticated known identities and token route payload semantics.

### Key artifacts updated

- `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/services/auth-session-store.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/api/scripts/api-runtime-check.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-runtime-api-wall-feed.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-runtime-api-matrix.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-runtime-auth-lifecycle.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/reviews/2026-02-22-r2-auth-real-001b-review.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/qa/2026-02-22-r2-auth-real-001b-qa.md`

## 2026-02-22 `R3-WEB-REFACTOR-001B` Evidence

### Scope delivered in this checkpoint

1. `app/web/src/main.tsx` was reduced to runtime orchestration logic.
2. Extracted runtime rendering into `app/web/src/runtime/runtime-views.js`.
3. Extracted runtime interaction handlers into `app/web/src/runtime/runtime-interactions.js`.
4. Extracted runtime CSS bundle into `app/web/src/runtime/legacy-runtime-styles.js`.
5. Reviewer/QA hard gate artifacts were published for this slice.

### Key artifacts updated

- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/main.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/runtime-views.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/runtime-interactions.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/legacy-runtime-styles.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/reviews/2026-02-22-r3-web-refactor-001b-review.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/qa/2026-02-22-r3-web-refactor-001b-qa.md`

## 2026-02-22 `R3-WEB-REFACTOR-001C` Evidence

### Scope delivered in this checkpoint

1. Render and interaction logic was split into domain modules under `app/web/src/features/**`.
2. Runtime orchestrator files were reduced in size:
   - `main.tsx`: `55` lines
   - `runtime-views.js`: `114` lines
   - `runtime-interactions.js`: `19` lines
3. Shared runtime payload normalization moved to `app/web/src/app/runtime-payload.js`.
4. `live-web-runtime.mjs` now consumes shared payload defaults/normalization for wall feed, employee list, and fallback route payload behavior.
5. Reviewer/QA hard gate artifacts were published for this slice.

### Key artifacts updated

- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/main.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/runtime-views.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/runtime-interactions.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/app/runtime-payload.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/wall-feed/render.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/wall-feed/interactions.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/employee-list/render.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/employee-list/interactions.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/profile/render.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/profile/interactions.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/settings/render.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/settings/interactions.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/admin/render.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/admin/interactions.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/client-feature/render.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/client-feature/interactions.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/auth-utility/render.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/auth-utility/interactions.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/fallback/render.js`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/live-web-runtime.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/reviews/2026-02-22-r3-web-refactor-001c-review.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/qa/2026-02-22-r3-web-refactor-001c-qa.md`

### `R3-WEB-REFACTOR-001C` command evidence (pass/fail)

- `pnpm --dir app install`: `FAIL` (`ENOTFOUND registry.npmjs.org` in sandbox).
- `pnpm --dir app/web lint`: `PASS`.
- `pnpm --dir app/web build`: `PASS`.
- `pnpm --dir app lint`: `PASS`.
- `pnpm --dir app typecheck`: `PASS`.
- `pnpm --dir app test`: `PASS`.
- `pnpm --dir app smoke`: `PASS` (runtime smoke fallback path used due sandbox `EPERM` on `127.0.0.1:5173`).
- `pnpm --dir app build`: `PASS`.
- `pnpm --dir app verify`: `PASS`.
- `pnpm --dir app/api build`: `PASS`.
- `pnpm --dir app/api lint`: `PASS`.
- `pnpm --dir app/api typecheck`: `PASS`.
- `pnpm --dir app/api test`: `PASS`.
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'`: `PASS` (no matches; command exit `1` by design).

## 2026-02-22 `R3-WEB-REACT-001` Evidence

### Scope delivered in this checkpoint

1. Replaced imperative DOM runtime mount with real React bootstrap in `app/web/src/main.tsx` using `createRoot`.
2. Introduced component-based runtime UI composition in `app/web/src/app/App.tsx` for wall feed, employee list, profile, settings, auth utility, client features, and admin screens.
3. Added shared route payload resolver in `app/web/src/app/runtime-data.ts` used by both browser runtime and Vite middleware server path.
4. Replaced custom static runtime server behavior with Vite plugin middleware in `app/web/vite.config.ts` for:
   - route payload injection (`simoona-runtime-data`)
   - `/healthz` and `/readyz` responses
   - legacy unknown-route `404` parity behavior
5. Updated `live-web-runtime.mjs` to a thin Vite wrapper with signal-safe child shutdown to reduce process drift.
6. Added TypeScript/Vite web tooling baseline (`app/web/tsconfig.json`, `app/web/src/vite-env.d.ts`, React/Vite dependencies).

### Key artifacts updated

- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/main.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/app/App.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/app/runtime-data.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/vite.config.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/live-web-runtime.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/verify-web-syntax.mjs`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/package.json`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/tsconfig.json`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/vite-env.d.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/README.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/reviews/2026-02-22-r3-web-react-001-review.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/qa/2026-02-22-r3-web-react-001-qa.md`

### `R3-WEB-REACT-001` command evidence (pass/fail)

- `pnpm --dir app install`: `PASS` (unrestricted mode; workspace deps installed)
- `pnpm --dir app lint`: `PASS`
- `pnpm --dir app typecheck`: `PASS`
- `pnpm --dir app test`: `PASS`
- `pnpm --dir app smoke`: `PASS` (constrained fallback + unrestricted runtime path both validated)
- `pnpm --dir app build`: `PASS`
- `pnpm --dir app verify`: `PASS` (unrestricted mode)
- `pnpm --dir app/api build`: `PASS`
- `pnpm --dir app/api lint`: `PASS`
- `pnpm --dir app/api typecheck`: `PASS`
- `pnpm --dir app/api test`: `PASS`
- `pnpm --dir app/tests/e2e runtime:wall-feed`: `PASS`
- `pnpm --dir app/tests/e2e runtime:employee-list`: `PASS`
- `pnpm --dir app/tests/e2e runtime:profile-settings`: `PASS`
- `pnpm --dir app/tests/e2e runtime:auth-utility`: `PASS`
- `pnpm --dir app/tests/e2e runtime:client-features`: `PASS`
- `pnpm --dir app/tests/e2e runtime:admin`: `PASS`
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'`: `PASS` (no matches; command exit `1` by design)

## 2026-02-22 `R3-WEB-STRUCTURE-002` Evidence

### Scope delivered in this checkpoint

1. Reduced `app/web/src/app/App.tsx` to orchestration-only runtime route selection and shell composition.
2. Extracted feature view logic into dedicated modules:
   - `app/web/src/features/core/CoreFeatureViews.tsx`
   - `app/web/src/features/extended/ExtendedFeatureViews.tsx`
   - `app/web/src/features/fallback/FallbackView.tsx`
3. Extracted shared frontend utilities:
   - `app/web/src/app/hooks/useInteractiveTable.ts`
   - `app/web/src/app/lib/normalize-text.ts`
   - `app/web/src/app/layout/AppShell.tsx`
4. Split runtime data monolith into modular runtime data files:
   - `app/web/src/runtime/data/contracts.ts`
   - `app/web/src/runtime/data/fixtures.ts`
   - `app/web/src/runtime/data/resolver.ts`
   - kept compatibility facade in `app/web/src/app/runtime-data.ts`.
5. Removed dead compatibility runtime rendering chain and orphaned legacy feature render/interactions files.
6. Migrated active web runtime source to TypeScript-only modules and set `allowJs: false` in `app/web/tsconfig.json`.
7. Moved large inline style payload from runtime string module to CSS import path (`app/web/src/shared/styles/legacy-runtime.css`).

### Key artifacts updated

- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/app/App.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/app/layout/AppShell.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/app/hooks/useInteractiveTable.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/app/lib/normalize-text.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/core/CoreFeatureViews.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/extended/ExtendedFeatureViews.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/features/fallback/FallbackView.tsx`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/data/contracts.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/data/fixtures.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/data/resolver.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/app/runtime-data.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/runtime/runtime-shared.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/app/runtime-payload.ts`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shared/styles/legacy-runtime.css`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/tsconfig.json`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/README.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/reviews/2026-02-22-r3-web-structure-002-review.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/qa/2026-02-22-r3-web-structure-002-qa.md`

### `R3-WEB-STRUCTURE-002` command evidence (pass/fail)

- `pnpm --dir app/web lint`: `PASS`
- `pnpm --dir app verify`: `PASS`
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'`: `PASS` (no matches; command exit `1` by design)

### Remaining evidence needed before release

1. Feature-domain runtime parity evidence wave (`R3-FEATURE-WAVE-D`).
2. Integration failure-path parity evidence (`R4-INTEGRATION-PARITY-001`).
3. Final-wave reviewer `APPROVED` and QA `GREEN` artifacts for all remaining parity slices.
