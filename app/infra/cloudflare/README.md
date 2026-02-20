# Cloudflare Deployment Artifacts (No Publish)

This directory contains Cloudflare deployment-ready artifacts for phase `R4`.

Scope for this phase:

- prepare Cloudflare Pages and Containers config
- document env var contracts and rollback-ready execution path
- validate artifact completeness without running any publish command

Explicitly out of scope:

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

## Publish (Deferred)

Publishing is intentionally deferred by orchestration policy and must be triggered only after explicit user approval.
