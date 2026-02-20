# Local Bootstrap (macOS M3)

## One-command bootstrap

Run from repository root:

```bash
pnpm --dir app bootstrap
```

## Verification sequence

Run from repository root:

```bash
pnpm --dir app verify
```

The `verify` command runs:

1. `lint`
2. `typecheck`
3. `test`
4. `smoke`
5. `build`

## Docker baseline

Docker Compose baseline file:

- `/Users/arturasnikoncukas/code/repo/simoona/app/infra/docker/docker-compose.yml`

See `/Users/arturasnikoncukas/code/repo/simoona/app/infra/docker/README.md` for service intent and startup command.
