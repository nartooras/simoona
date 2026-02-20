# ADR 0001: Phase 1 Foundation Baseline

- Date: `2026-02-20`
- Status: `Accepted`

## Context

Modernization work requires a reproducible foundation under `/app` before feature migration starts. The foundation must run on macOS M3, preserve legacy isolation (`/src`, `/build` unchanged), and establish command contracts for CI gates.

## Decision

Use a lightweight pnpm workspace skeleton under `/app` with placeholder gate commands and a Docker Compose baseline:

- workspace root: `/app/package.json`, `/app/pnpm-workspace.yaml`
- app skeleton: `/app/web`, `/app/api`, `/app/packages/*`, `/app/tests/*`
- quality gate contract: `bootstrap`, `lint`, `typecheck`, `test`, `smoke`, `build`
- CI baseline runner: `/app/infra/ci/run-foundation-ci.sh`
- Docker baseline: `/app/infra/docker/docker-compose.yml`

## Consequences

- Foundation commands are deterministic and fast for an empty skeleton.
- CI wiring can reuse stable command names as implementation grows.
- Placeholder checks must be replaced with real lint/typecheck/test/build jobs during Phase 2+.
