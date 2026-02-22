# API Baseline

Compatibility baseline for the modern NestJS API application.

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
- `core/integration/integration-compatibility.module`
  - external jobs compatibility controllers (`ExternalJobs/*`)
  - storage/media upload compatibility controller (`Picture/Upload`)
  - deterministic integration failure policy (`x-simoona-integration-failure`, `simulateFailure`)

## Runtime Check Contract

This package provides a runnable local runtime check boundary.

### Command contract

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api syntax:check`
  - validates syntax for API source and scripts before other gates
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api start`
  - starts a local runtime server on `127.0.0.1:4300` by default
  - health endpoints:
    - `GET /healthz`
    - `GET /readyz`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api build`
  - validates required source and contract files
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/api test`
  - executes baseline runtime checks and exits

### Environment contract

- `API_RUNTIME_PORT` (optional)
  - default: `4300`
  - purpose: override local runtime listen port

No secrets are required for this runtime check flow.

## Integration Failure-Path Contract

- Header toggle: `x-simoona-integration-failure`
- Query toggle: `simulateFailure`
- Supported values:
  - `oauth-timeout`
  - `oauth-auth-failure`
  - `smtp-timeout`
  - `smtp-auth-failure`
  - `storage-timeout`
  - `storage-auth-failure`
  - `external-jobs-timeout`
  - `external-jobs-auth-failure`
  - `localization-timeout`
