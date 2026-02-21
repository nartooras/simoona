# Cloudflare Deployment Artifacts (No Publish)

This directory contains Cloudflare deployment-ready artifacts for phase `R4`.

Scope for this phase:

- prepare Cloudflare Pages and Containers config
- document env var contracts and rollback-ready execution path
- validate artifact completeness without running any publish command

Explicitly out of scope in this hold mode:

- `wrangler deploy`
- `wrangler pages deploy`
- DNS/traffic switching

## Structure

- `pages/wrangler.toml`: Pages project artifact contract.
- `containers/wrangler.toml`: Containers project artifact contract.
- `containers/worker.ts`: container entry worker placeholder.
- `containers/Dockerfile.api`: API runtime image contract.
- `.dev.vars.example`: local environment variable contract template.

## Validation

Run from repository root:

```bash
pnpm --dir app deploy:cloudflare:check
```

## Publish Plan Commands (Prepared, Not Executed)

Run from repository root:

```bash
pnpm --dir app deploy:cloudflare:plan
pnpm --dir app deploy:cloudflare:plan:staging
pnpm --dir app deploy:cloudflare:plan:production
```

These commands print the exact publish commands that would run (`wrangler pages deploy` and `wrangler deploy`) but execute nothing.

## Publish Commands (Approval Required)

Run only after explicit user approval and authenticated Wrangler session:

```bash
pnpm --dir app deploy:cloudflare:publish
pnpm --dir app deploy:cloudflare:publish:staging
pnpm --dir app deploy:cloudflare:publish:production
```

Auth precheck:

```bash
npx wrangler whoami
```

## Publish (Deferred)

Publishing is intentionally deferred by orchestration policy and must be triggered only after explicit user approval.
