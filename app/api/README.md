# API Skeleton

Phase 2 compatibility scaffold for the modern NestJS API application.

## Implemented compatibility boundaries

- `core/auth/auth-compatibility.module`
  - account compatibility controller
  - token compatibility controller
- `core/tenant/tenant-context.middleware`
- `core/permissions/legacy-permission.guard`
- `core/errors/legacy-error.filter` and `legacy-error.mapper`
- `core/conventions/legacy-pagination.middleware`
- `core/conventions/legacy-date-serialization.interceptor`
- `core/conventions/legacy-response-envelope.interceptor`
- `core/social/social-compatibility.module`
  - wall read/feed/mutation/membership compatibility controllers
  - post/comment compatibility controllers (including post interaction routes)
  - notification and user-notification compatibility controllers

## Wave A Runtime Harness

This package now provides a runnable local runtime boundary for Wave A parity verification.

### Command contract

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api start`
  - starts a local runtime boundary server on `127.0.0.1:4300` by default
  - health endpoints:
    - `GET /healthz`
    - `GET /readyz`
    - `GET /wave-a/runtime-boundary`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api build`
  - validates required Wave A harness files and contract artifacts
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api test`
  - boots runtime boundary and executes the full Wave A parity bundle:
    - parity: `scope|api|planned|adapters|realtime|core`
    - e2e targets + changed-screen visual approvals + visual baseline
    - web shell checks
    - root `/app` verify contract

### Environment contract

- `API_HARNESS_PORT` (optional)
  - default: `4300`
  - purpose: override local harness listen port

No secrets are required for this harness flow.
