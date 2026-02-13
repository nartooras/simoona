# AGENTS.md

Repository instructions for AI agent threads working on modernization.

## 1) Scope and Safety

- Primary modernization area: `modern/**`.
- Legacy runtime paths are protected unless explicitly requested:
  - `src/webapp/**`
  - `src/api/**`
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
- Keep each branch focused on one objective (foundation, webapp shell, api skeleton, etc.).
- Do not mix unrelated refactors in the same branch.
- Before handoff, ensure branch is committed and pushed.

## 3) Project Structure Intent

- Modern apps go under `modern/apps/*`.
- Shared modern libraries/packages go under `modern/packages/*`.
- Modern tests go under `modern/tests/*`.
- Keep modernization changes isolated and incremental.

## 4) Required Validation Before Handoff

Run from repository root unless not applicable:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
dotnet build modern/apps/api/Simoona.Modern.Api.sln
dotnet test modern/apps/api/Simoona.Modern.Api.sln --no-build
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
- Keep docs in sync (`MODERNIZATION.md` when relevant).
- Preserve compatibility with macOS dev setup.
- If a command fails due to environment constraints, report the failure clearly and continue with what can be verified.
