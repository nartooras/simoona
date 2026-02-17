# Frontend Migration Wave 1

## Scope and references

This wave aligns with:
- `modern/docs/architecture.md`
- `modern/docs/auth-migration.md`
- `modern/docs/api-contracts.md`
- `modern/docs/adr/0001-modernization-structure.md`
- `modern/docs/adr/0002-read-only-first-data-migration.md`
- `modern/docs/adr/0003-auth-migration-strategy.md`

Wave 1 focuses on two high-usage, read-focused legacy screens and keeps write flows in legacy runtime for now.

## Selected screens and rationale

### 1) Current User Context (`/Account/UserInfo`)

- Why selected:
  - P1 baseline contract in `modern/docs/api-contracts.md`.
  - Required for shell/bootstrap and user-context rendering.
  - Read-only and already available in modern API.
- Legacy route/screen mapping:
  - Legacy API: `GET /Account/UserInfo`
  - Legacy AngularJS usage: auth/bootstrap user context consumption.
- Target React route:
  - `/user-info`
- Data dependency:
  - Modern API: `GET /api/v1/account/user-info`
  - Required headers/auth context: `Authorization`, `X-Org-Id`

### 2) User General Settings (read path of `/User/GeneralSettings`)

- Why selected:
  - P1 endpoint in contract baseline.
  - High-usage self-service screen (language/time zone preferences).
  - Read-first path is safe for early migration.
- Legacy route/screen mapping:
  - Legacy AngularJS route: `/:organizationName/Settings/General`
  - Legacy API: `GET /User/GeneralSettings`
- Target React route:
  - `/settings/general`
- Data dependency:
  - Planned modern API: `GET /api/v1/user/general-settings`
  - Current wave uses a stub adapter for API-gap handling.

## Migration risk and assumptions

- Auth/tenant assumptions:
  - Modern webapp sends `Authorization` and `X-Org-Id` headers using shared request conventions.
  - Behavior follows `modern/docs/auth-migration.md` and ADR-0003 transitional strategy.
- Data availability assumptions:
  - `/api/v1/account/user-info` remains available and authenticated.
  - `/api/v1/user/general-settings` is not available yet in modern API; route is integrated with a clearly marked stub fallback.
- Key risks:
  - Users may hit partial migration state on `/settings/general` until modern API endpoint is implemented.
  - Legacy settings write flow (`PUT /User/GeneralSettings`) remains legacy-only in this wave.
  - Permission parity for settings (`BasicPermissions.ApplicationUser`) cannot be fully verified until modern endpoint exists.

## Migrated now vs still legacy

| Area | Legacy route/API | React route | Wave 1 status |
|---|---|---|---|
| Current user context | `GET /Account/UserInfo` | `/user-info` | Migrated (modern API integrated) |
| General settings (read) | `/:organizationName/Settings/General` + `GET /User/GeneralSettings` | `/settings/general` | UI migrated; modern API gap handled by stub |
| General settings (write) | `PUT /User/GeneralSettings` | N/A | Still legacy |
| Remaining profile/settings screens | `/:organizationName/Settings/*`, `/:organizationName/Profile/*` and related APIs | N/A | Still legacy |
