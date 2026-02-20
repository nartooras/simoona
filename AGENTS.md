# AGENTS.md

Repository instructions for AI agent threads working on modernization.

## 1) Scope and Safety

- Primary modernization area: `app/**`.
- Legacy runtime paths are protected unless explicitly requested:
  - `src/webapp/**`
  - `src/api/**`
  - `build/**`
- Do not introduce behavior changes in legacy apps while modernizing.
- Never commit generated artifacts:
  - `node_modules/`
  - `dist/`
  - `bin/`
  - `obj/`
  - tool caches (for example `.vite/`)
- Avoid destructive Git operations (`reset --hard`, force-cleaning, history rewrite) unless explicitly asked.

## 2) Branching and Thread Workflow

- Create a dedicated branch per thread using prefix: `codex/`.
- Keep each branch focused on one objective (platform, web parity, api parity, migration, QA, etc.).
- Do not mix unrelated refactors in the same branch.
- Before handoff, ensure branch is committed and pushed.

## 3) Project Structure Intent

- Modern apps go under `app/web` and `app/api`.
- Shared modern libraries/packages go under `app/packages/*`.
- Modern tests go under `app/tests/*`.
- Orchestration source of truth:
  - `app/docs/orchestration/status.md`
  - `app/docs/orchestration/backlog.md`
  - `app/docs/orchestration/risks.md`
- Architecture and plan sources:
  - `app/docs/ai-agents-modernization-plan.md`
  - `app/docs/adr/*`
- Keep modernization changes isolated and incremental.
- Dependency boundaries:
  - apps can depend on packages
  - packages cannot depend on apps
  - tests can depend on apps/packages
  - no legacy `src/**` imports/references from `app/**`
- Auth-related endpoint work should reference:
  - `app/docs/auth-migration.md` (if present)
  - `app/docs/adr/*` auth strategy ADRs

## 4) Required Validation Before Handoff

Run from repository root unless not applicable:

```bash
pnpm --dir app install
pnpm --dir app lint
pnpm --dir app typecheck
pnpm --dir app test
pnpm --dir app smoke
pnpm --dir app build
pnpm --dir app verify
pnpm --dir app/api build
pnpm --dir app/api lint
pnpm --dir app/api typecheck
pnpm --dir app/api test
git status --short
```

Artifact hygiene checks:

```bash
git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'
```

Expected: no tracked generated artifacts.

## 5) Handoff Format (Mandatory)

Each thread must report:

1. Summary of what was implemented.
2. Exact list of changed files.
3. Commands run with pass/fail results.
4. Known risks/follow-ups.
5. Final commit hash.

## 6) Implementation Guidelines

- Prefer small, reviewable changes.
- Keep docs in sync (`app/docs/orchestration/*`, `MODERNIZATION.md` when relevant).
- Preserve compatibility with macOS dev setup.
- If a command fails due to environment constraints, report the failure clearly and continue with what can be verified.
