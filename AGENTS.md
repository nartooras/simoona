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
  - tool caches (for example `.vite/`, `.wrangler/`, `test-results/`)
- Avoid destructive Git operations (`reset --hard`, force-cleaning, history rewrite) unless explicitly asked.

## 2) Branching and Thread Workflow

- Do all modernization work on branch: `modernization`.
- Do not create or switch to thread-specific branches (including `codex/*`) unless explicitly requested by the user.
- Keep each commit focused on one objective (platform, web parity, api parity, migration, QA, docs sync, etc.).
- Do not mix unrelated refactors in the same commit.
- Before handoff, ensure changes are committed and pushed to `modernization`.

## 3) Project Structure Intent

- Modern apps go under `app/web` and `app/api`.
- Shared modern libraries/packages go under `app/packages/*`.
- Modern tests go under `app/tests/*`.
- Orchestration source of truth:
  - `app/docs/orchestration/status.md`
  - `app/docs/orchestration/backlog.md`
  - `app/docs/orchestration/risks.md`
  - `app/docs/orchestration/decisions.md`
  - `app/docs/orchestration/evidence.md`
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

## 4) Skills Utilization Protocol (Mandatory)

- If a relevant skill exists or a user names a skill, the agent must load and follow that `SKILL.md` before planning or implementation.
- Minimum modernization flow:
  1. implementation via `$full-stack-developer` (or relevant specialist skill)
  2. review via `$reviewer`
  3. QA via `$qa`
- Implementation completion requires:
  - reviewer decision `APPROVED`
  - QA decision `GREEN`
- If a required skill is missing or unreadable, report it explicitly and continue with a documented fallback approach.

## 5) Required Validation Before Handoff

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

## 6) Handoff Format (Mandatory)

Each thread must report:

1. Summary of what was implemented.
2. Exact list of changed files.
3. Commands run with pass/fail results.
4. Skills used and key decisions made.
5. Evidence links (or explicit reason if none).
6. Known risks/follow-ups.
7. Final commit hash.

## 7) Implementation Guidelines

- Prefer small, reviewable changes.
- Keep docs in sync (`app/docs/orchestration/*`, parity docs, and relevant package/app readmes).
- Use `features` terminology for modernization domains and avoid legacy gated-domain naming, unless referring to literal legacy project names.
- Preserve compatibility with macOS dev setup.
- If a command fails due to environment constraints, report the failure clearly and continue with what can be verified.

## 8) Release Control Policy

- Production release is frozen by default until parity gates are green and explicitly approved.
- Do not mark modernization complete until legacy feature and behavior parity is accepted.
- Publish/deploy steps must include rollback rehearsal evidence in orchestration docs.
