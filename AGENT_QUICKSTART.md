# Simoona Agent Quickstart

Fast orientation guide for AI agents and contributors.

## 1) Repository Context

- Product: **Simoona** (open-source intranet platform).
- Legacy architecture:
  - `src/webapp`: AngularJS frontend.
  - `src/api`: ASP.NET Web API + OWIN backend on .NET Framework.
- Modernization workspace:
  - `app/web`: modern web runtime.
  - `app/api`: modern API runtime.
  - `app/packages/*`: shared contracts and UI primitives.
  - `app/tests/*`: parity and runtime verification suites.

## 2) Branch and Safety Rules

- Active modernization branch: `modernization`.
- Do not use `codex/*` branches unless explicitly requested.
- Do not modify `src/**` or `build/**` during modernization threads unless explicitly requested.
- Keep generated artifacts out of commits (`node_modules`, `dist`, `bin`, `obj`, caches).

## 3) Source-of-Truth Paths

- Modernization plan: `app/docs/ai-agents-modernization-plan.md`
- Orchestration control files:
  - `app/docs/orchestration/status.md`
  - `app/docs/orchestration/backlog.md`
  - `app/docs/orchestration/risks.md`
  - `app/docs/orchestration/decisions.md`
  - `app/docs/orchestration/evidence.md`
- Parity artifacts:
  - `app/docs/parity/api-endpoint-matrix.csv`
  - `app/docs/parity/ui-route-matrix.csv`
  - `app/docs/parity/feature-checklist.md`
  - `app/docs/parity/parity-gap-report.md`

## 4) Skills and Gate Policy

- If a relevant skill exists, load and follow its `SKILL.md` first.
- Minimum execution sequence for implementation threads:
  1. implementation (`$full-stack-developer` or relevant specialist)
  2. review (`$reviewer`) with `APPROVED`
  3. QA (`$qa`) with `GREEN`
- No phase can be marked complete from docs/contracts only.

## 5) Legacy References (Read-Only)

Key legacy references for parity behavior:

- Frontend modules: `src/webapp/src/client/app/*`
- API controllers: `src/api/Shrooms.Presentation.Api/Controllers/*`
- API domain/data layers: `src/api/Shrooms.Domain*`, `src/api/Shrooms.DataLayer*`

Literal legacy project names are preserved when referenced, for example:
- `Shrooms.Tests` (legacy project name)
- `Shrooms.Premium.Tests` (legacy project name)

## 6) Execution Baseline

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

## 7) First 15 Minutes Checklist

1. Read `AGENTS.md` and `app/docs/ai-agents-modernization-plan.md`.
2. Confirm branch is `modernization`.
3. Read current `status.md`, `backlog.md`, and `risks.md`.
4. Inspect legacy behavior in `src/**` for assigned scope.
5. Implement only in `app/**`.
6. Capture review and QA evidence before handoff.
