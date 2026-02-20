# CI Pipeline Contract

This contract defines the minimum CI steps for the `/app` workspace baseline.

## Required steps

Run from repository root:

```bash
bash app/infra/ci/run-foundation-ci.sh
pnpm --dir app build
pnpm --dir app deploy:cloudflare:check
```

Integration baseline includes a smoke contract check:

```bash
pnpm --dir app smoke:integrations
```

Cloudflare deployment phase adds artifact-only contract checks (no publish commands):

```bash
pnpm --dir app deploy:cloudflare:check
```

## Expected result

- All commands pass on macOS M3 local environment.
- Same command sequence is used by CI wiring for the modern app workspace.
- Cloudflare deployment artifacts remain validated while publish stays deferred.

## Transition rule

As API/web coverage expands, replace baseline checks with full parity lint/typecheck/test/build while preserving command names.
