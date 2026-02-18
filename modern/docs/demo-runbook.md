# Demo Runbook (Thread S)

This runbook defines the hard-gated, repeatable demo rehearsal flow for the modern prototype using deterministic `real` + `mock` + `disabled` route modes.

## Goal

Run one command to validate, one to boot, and one to stop:

1. hard-gate readiness checks
2. modern API with local development auth bootstrap
3. minted development bearer token
4. modern webapp with deterministic route adapter selection

## Commands

From repository root:

```bash
pnpm demo:check
pnpm demo:start
```

Optional shutdown command:

```bash
pnpm demo:stop
```

CI-safe gate path:

```bash
pnpm demo:check -- --ci
```

## What `pnpm demo:check` validates

- `VITE_DEMO_MODE=true`
- `VITE_API_BASE_URL` points to the configured demo API origin and `/api` path prefix
- `VITE_API_ORGANIZATION_ID` is numeric
- `Auth__DevToken__Enabled=true`
- critical route definitions + availability labels exist in `AppRouter` and `navigation` sources
- local mode:
  - API + webapp ports are available
  - modern API boots with local JWT signing-key mode
  - `/health` returns `200` and `status=healthy`
  - `POST /api/v1/dev-auth/token` returns a usable bearer token
  - auth baseline for critical endpoints:
    - no token => `401`
    - valid token + org => `200` with expected payload shape
    - invalid `X-Org-Id` => `400` (user-info baseline)
- CI mode (`--ci`):
  - runs `pnpm smoke:ci` as the runtime-safe hard gate path

The command fails non-zero on any unmet requirement.

## What `pnpm demo:start` does

- runs preflight checks for config, route definitions, and ports
- starts modern API on `http://127.0.0.1:5187`
- mints a development token from `POST /api/v1/dev-auth/token`
- validates API health/auth baseline before launching webapp
- starts webapp on `http://127.0.0.1:5173`
- verifies webapp responds before reporting success
- injects `VITE_*` environment values for deterministic demo mode
- stores process metadata in `/tmp/simoona-modern-demo.json`
- writes logs to `/tmp/simoona-modern-demo-logs`

## What `pnpm demo:stop` does

- reads `/tmp/simoona-modern-demo.json`
- stops API + webapp process trees deterministically
- escalates to `SIGKILL` if graceful shutdown times out
- reports one of: `stopped`, `killed`, `not-running`, `not-configured`, `timeout`

## Environment Variable Matrix

| Variable | Required for demo | Source in `demo:start` | Notes |
|---|---|---|---|
| `VITE_DEMO_MODE` | yes | forced to `true` | Enables deterministic hybrid source selection. |
| `VITE_API_BASE_URL` | yes | defaults to `http://127.0.0.1:5187/api` | Must target demo API origin and `/api` prefix. |
| `VITE_API_ORGANIZATION_ID` | yes | defaults to `7` | Sent as `X-Org-Id`, must be numeric. |
| `VITE_API_BEARER_TOKEN` | yes | minted at startup | Generated via `POST /api/v1/dev-auth/token`. |

Supporting API auth envs are also applied by `demo:start` (`Auth__Jwt__Issuer`, `Auth__Jwt__Audience`, `Auth__Jwt__SigningKey`, `Auth__Jwt__Authority`, `Auth__DevToken__Enabled`).

## Click-Through Rehearsal Script (Operator Checklist)

After `pnpm demo:start`, open `http://127.0.0.1:5173` and walk this exact sequence:

1. `/` (shell load)
   - Expect shell + navigation sections visible.
   - Expect `PrototypeNotice` in `real` mode.
2. `/user-info`
   - Expect live user payload rendered from API.
   - Expect `real` mode and no placeholder warning.
3. `/settings/general`
   - Expect live read model data (language/timezone settings surface).
   - Expect `real` mode.
4. `/employees`
   - Expect API-backed directory list/paged content.
   - Expect `real` mode.
5. `/profiles/me`
   - Expect API-backed profile details.
   - Expect `real` mode.
6. `/activities/feed` (prototype-only)
   - Expect deterministic placeholder cards and explicit mock explanation.
   - Expect `mock` mode and no write actions.
7. `/service-requests` (prototype-only)
   - Expect route shell present but workflow actions disabled.
   - Expect `disabled` mode with explicit scope note.

Route mode expectations:

- `real` routes: API-backed read data, production-like shape, no mock disclaimer.
- `mock` routes: deterministic static content, explicit prototype explanation, simulated read-only controls.
- `disabled` routes: navigation parity only, actions intentionally unavailable.

## Known-Gap Registry (Prototype Limits)

| Route | Availability mode | Data source | Write behavior | Owner / next-wave note |
|---|---|---|---|---|
| `/user-info` | `real` | legacy read DB via modern API | real-disabled (read only) | API Wave 3: evaluate write-path ADR alignment. |
| `/settings/general` | `real` | legacy read DB via modern API | real-disabled (read only) | API Wave 3: deferred write contract migration. |
| `/employees` | `real` | legacy read DB via modern API | real-disabled (read only) | API Wave 3: filter/sort parity hardening. |
| `/profiles/me` | `real` | legacy read DB via modern API | real-disabled (read only) | API Wave 3: profile edit remains out of scope. |
| `/activities/feed` | `mock` | fixture/static payload | simulated | Webapp Wave 3: API read contract integration. |
| `/recognition` | `mock` | fixture/static payload | simulated | Webapp Wave 3: recognition read-path integration. |
| `/events` | `mock` | fixture/static payload | simulated | Webapp Wave 3: events read-path integration. |
| `/vacations` | `mock` | fixture/static payload | simulated | Webapp Wave 3: balance/history read contract. |
| `/kudos` | `mock` | fixture/static payload | simulated | Webapp Wave 3: kudos analytics read contract. |
| `/books` | `mock` | fixture/static payload | simulated | Webapp Wave 3: catalog read contract. |
| `/teams` | `mock` | fixture/static payload | simulated | Webapp Wave 3: teams hierarchy integration. |
| `/projects` | `mock` | fixture/static payload | simulated | Webapp Wave 3: project read model migration. |
| `/office-map` | `mock` | fixture/static payload | simulated | Webapp Wave 3: occupancy read model integration. |
| `/organization/structure` | `mock` | fixture/static payload | simulated | Webapp Wave 3: organization hierarchy API. |
| `/committees` | `mock` | fixture/static payload | simulated | Webapp Wave 3: committees data contract. |
| `/service-requests` | `disabled` | not available in prototype | not available | Requires dedicated workflow migration ADR and phased rollout plan. |
| `/externals/integrations` | `disabled` | not available in prototype | not available | Out of scope for current modernization waves. |

## Troubleshooting

- If `demo:check` reports a port conflict, stop the process using that port or provide `DEMO_API_PORT` / `DEMO_WEB_PORT`.
- If token minting fails, verify local JWT env values and `Auth__DevToken__Enabled=true`.
- If stale process state exists, run `pnpm demo:stop` and retry.
- If `demo:start` fails after spawn, inspect `/tmp/simoona-modern-demo-logs/api-*.log` and `/tmp/simoona-modern-demo-logs/webapp-*.log`.
