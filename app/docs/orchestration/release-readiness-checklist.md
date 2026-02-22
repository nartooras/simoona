# Release Readiness Checklist (R5)

Date: `2026-02-22`
Branch: `modernization`
Status: `NO_GO_RELEASE_FROZEN`

## Purpose

Define objective go/no-go criteria for production unfreeze.

## Hard Requirements

- [ ] API parity matrix behavior is runtime-verified for all legacy endpoints.
- [ ] UI parity matrix behavior is runtime-verified for all legacy routes.
- [ ] All feature domains are parity-complete (including domains previously treated as gated scope).
- [ ] Integration parity is runtime-verified (OAuth, SMTP, storage, callbacks, background jobs, localization).
- [ ] Reviewer decision is `APPROVED` for all final-wave implementations.
- [ ] QA decision is `GREEN` for all final-wave implementations.
- [ ] No open P0/P1 parity issues remain.
- [ ] Rollback rehearsal evidence is complete and current.

## Validation Pack

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
git ls-files | rg '(^|/)node_modules/|(^|/)dist/|(^|/)bin/|(^|/)obj/'
git status --short
```

## Deployment Control

- Production publish is blocked by default.
- Override requires explicit GO decision and release owner approval.
- Every publish candidate must include rollback timing and verification evidence.

## Decision Rule

- `GO`: all checklist items complete and evidence linked in `app/docs/orchestration/evidence.md`.
- `NO_GO`: any item incomplete or any new P0/P1 risk appears.

## Current Decision

- Decision: `NO_GO` (release frozen; parity recovery in progress).
