# Frontend Migration Wave 2

## Scope and references

This wave aligns with:
- `modern/docs/architecture.md`
- `modern/docs/auth-migration.md`
- `modern/docs/api-contracts.md`
- `modern/docs/frontend-migration-wave1.md`
- `modern/docs/adr/0001-modernization-structure.md`
- `modern/docs/adr/0002-read-only-first-data-migration.md`
- `modern/docs/adr/0003-auth-migration-strategy.md`

Wave 2 migrates two additional high-impact read-first legacy screens to React routes in `modern/apps/webapp`, while isolating backend contract gaps with temporary adapters.

## Selected screens and mapping

### 1) Employee Directory

- Legacy route/screen mapping:
  - AngularJS state: `Root.WithOrg.Client.Employee.List`
  - Legacy route: `/:organizationName/Employee/List`
  - Legacy API: `GET /Employees`
- Target React route:
  - `/employees`
- Required API contract/endpoint:
  - Target modern contract: `GET /api/v1/employees`
  - Current state: **missing in modern API**
- Implementation status in modern webapp:
  - Implemented page and typed API client.
  - Uses temporary isolated adapter on `404` to provide migration-safe read fallback.
- Risk/complexity notes:
  - Pagination and filtering parity are partial in this wave.
  - Permission parity (`BasicPermissions.EmployeeList`) depends on backend policy migration.
  - Endpoint currently marked as temporary fallback in UI.

### 2) My Profile Details

- Legacy route/screen mapping:
  - AngularJS state: `Root.WithOrg.Client.Profiles.Details`
  - Legacy route: `/:organizationName/Profiles/:id` (defaults to current user when missing)
  - Legacy API: `GET /ApplicationUser/GetProfile` and `GET /ApplicationUser/GetUserProfile/{id}`
- Target React route:
  - `/profiles/me`
- Required API contract/endpoint:
  - Target modern contract: `GET /api/v1/profiles/me`
  - Current state: **missing in modern API**
- Implementation status in modern webapp:
  - Implemented page and typed API client.
  - Uses temporary isolated adapter on `404` to provide migration-safe read fallback.
- Risk/complexity notes:
  - This wave includes a summary profile read view only; edit flows remain legacy.
  - Authorization/self-vs-admin visibility parity is pending backend policy convergence.
  - Endpoint currently marked as temporary fallback in UI.

## Endpoint readiness summary

| Screen | Legacy API | Modern endpoint target | Wave 2 frontend status | Endpoint readiness |
|---|---|---|---|---|
| Employee Directory | `GET /Employees` | `GET /api/v1/employees` | Migrated route/page | Temporary stub fallback (`404` -> adapter) |
| My Profile Details | `GET /ApplicationUser/GetProfile` | `GET /api/v1/profiles/me` | Migrated route/page | Temporary stub fallback (`404` -> adapter) |

## Migration progress table

| Bucket | Items |
|---|---|
| Migrated now (Wave 2) | Employee Directory (`/employees`), My Profile (`/profiles/me`) |
| Migrated in Wave 1 | User Info (`/user-info`), General Settings read (`/settings/general`) |
| Still legacy | General settings write, profile edit tabs, full profile-by-id routing, wall/feed screens, and other non-migrated settings/profile areas |

## Backend gap notes for follow-up

1. Add `GET /api/v1/employees` with read-first pagination/filter contract parity to legacy `GET /Employees`.
2. Add `GET /api/v1/profiles/me` (and later `/api/v1/profiles/{id}`) with explicit profile visibility/authorization rules.
3. After real endpoints land, remove the temporary adapters in `modern/apps/webapp/src/api/wave2TemporaryAdapters.ts`.
