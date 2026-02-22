# Publish Execution Plan (Production Freeze Active)

Date: `2026-02-22`
Branch: `modernization`
Status: `PRODUCTION_FROZEN`

## Preconditions (Mandatory)

1. Explicit user approval for publish execution.
2. `R5` checklist fully green.
3. Reviewer `APPROVED` + QA `GREEN` for final parity wave.
4. Rollback rehearsal evidence updated.
5. Clean `modernization` branch state.

## Plan Commands

```bash
pnpm --dir app deploy:cloudflare:check
pnpm --dir app verify
pnpm --dir app/api test
pnpm --dir app deploy:cloudflare:plan:staging
pnpm --dir app deploy:cloudflare:plan:production
```

## Execute Commands (Approval + GO Required)

```bash
pnpm --dir app deploy:cloudflare:publish:staging
pnpm --dir app deploy:cloudflare:publish:production
```

Production execute is blocked by default unless explicit override is provided by release owner policy.
Guarded override command pattern:

```bash
ALLOW_PROD_PUBLISH=1 pnpm --dir app deploy:cloudflare:publish:production
```

## Rollback Controls

1. Keep previous deployment references available.
2. Validate health endpoints immediately after publish.
3. Run parity smoke pack against deployed URLs.
4. If any P0/P1 regression appears, rollback immediately and record evidence.
