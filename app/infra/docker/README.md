# Docker Compose Baseline

Compose file:

- `/Users/arturasnikoncukas/code/repo/simoona/app/infra/docker/docker-compose.yml`

## Service intent

- `web`: placeholder runtime container for future React/Vite app.
- `api`: placeholder runtime container for future NestJS API.
- `redis`: shared cache/queue dependency baseline.

## Startup command

Run from repository root:

```bash
docker compose -f app/infra/docker/docker-compose.yml up -d
```

For config validation only:

```bash
docker compose -f app/infra/docker/docker-compose.yml config
```
