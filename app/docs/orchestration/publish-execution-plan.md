# Publish Execution Plan (Prepared, Not Executed)

Date: `2026-02-21`
Branch: `modernization`
Status: `READY_PENDING_USER_APPROVAL`

## Preconditions

1. Explicit user approval to run publish commands.
2. Clean git state on `modernization`.
3. Re-run `pnpm --dir app verify` and confirm green before publish.
4. Confirm Cloudflare credentials availability in execution environment.

## Planned Sequence (Do Not Execute Yet)

1. Revalidate deployment artifacts:
   - `pnpm --dir app deploy:cloudflare:check`
2. Verify workspace health:
   - `pnpm --dir app verify`
3. Verify API-specific health:
   - `pnpm --dir app/api test`
4. Execute Cloudflare Pages publish (deferred, run only after explicit approval).
5. Execute Cloudflare Containers publish (deferred, run only after explicit approval).
6. Run post-publish smoke and parity checks.
7. Record release evidence and rollback status.

## Pre-Publish Command Pack

```bash
pnpm --dir app deploy:cloudflare:check
pnpm --dir app verify
pnpm --dir app/api test
```

Expected: all commands `PASS` immediately before any publish step.

## Rollback-Oriented Controls

1. Keep previous deploy target references accessible for immediate re-point.
2. Keep rollback runbook references in orchestration evidence.
3. Block traffic switching until post-publish smoke is green.
4. If post-publish checks fail, roll back to previous known-good deployment target.

## Out of Scope (Current Mode)

- Running any publish command.
- DNS cutover or production traffic switching.
- Permanent environment secret changes.
