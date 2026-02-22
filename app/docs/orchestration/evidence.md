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

### Command evidence (pass/fail)

- `pnpm --dir app install`: `FAIL` (`ENOTFOUND registry.npmjs.org` in sandbox).
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
- `pnpm --dir app/tests/parity runtime:api:auth`: `PASS` (requires unrestricted execution in this environment due sandbox `EPERM` on `127.0.0.1:4313`).
- `git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'`: `PASS` (no matches; command exit `1` by design).

### Remaining evidence needed before release

1. SQL-backed auth/session parity closure (`R2-AUTH-REAL-001B`).
2. Full web module decomposition evidence (`R3-WEB-REFACTOR-001B`).
3. Integration failure-path parity evidence (`R4-INTEGRATION-PARITY-001`).
4. Reviewer `APPROVED` and QA `GREEN` artifacts per completed wave.
