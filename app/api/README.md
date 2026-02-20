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
