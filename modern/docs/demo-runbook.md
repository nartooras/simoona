# Demo Runbook (Thread Q)

This runbook defines deterministic local demo orchestration for the modern prototype using a hybrid data-source model.

## Goal

Run one command to boot:

1. modern API with local development auth bootstrap
2. minted development bearer token
3. modern webapp with deterministic `real` + `mock` adapter selection

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

## What `pnpm demo:check` validates

- `VITE_DEMO_MODE=true`
- organization id is numeric
- local API and webapp ports are available
- modern API can boot with local JWT signing-key mode
- `/health` responds successfully
- `POST /api/v1/dev-auth/token` returns a usable bearer token

The command fails fast with actionable error messages.

## What `pnpm demo:start` does

- runs preflight checks for config and ports
- starts modern API on `http://127.0.0.1:5187`
- mints a development token from `POST /api/v1/dev-auth/token`
- starts webapp on `http://127.0.0.1:5173`
- injects `VITE_*` environment values for deterministic demo mode
- stores process metadata in `/tmp/simoona-modern-demo.json`

## Environment Variable Matrix

| Variable | Required for demo | Source in `demo:start` | Notes |
|---|---|---|---|
| `VITE_DEMO_MODE` | yes | forced to `true` | Enables deterministic hybrid source selection. |
| `VITE_API_BASE_URL` | yes | defaults to `http://127.0.0.1:5187/api` | Webapp API base URL. |
| `VITE_API_ORGANIZATION_ID` | yes | defaults to `7` | Sent as `X-Org-Id`, must be numeric. |
| `VITE_API_BEARER_TOKEN` | yes | minted at startup | Generated via `POST /api/v1/dev-auth/token`. |

Supporting API auth envs are also applied by `demo:start` (`Auth__Jwt__Issuer`, `Auth__Jwt__Audience`, `Auth__Jwt__SigningKey`, `Auth__Jwt__Authority`, `Auth__DevToken__Enabled`).

## Demo Mode Route Matrix (Deterministic)

| Route | Data source in demo mode | Notes |
|---|---|---|
| `/user-info` | `real` | `GET /api/v1/account/user-info` |
| `/settings/general` | `real` | `GET /api/v1/user/general-settings` |
| `/employees` | `real` | `GET /api/v1/employees` |
| `/profiles/me` | `real` | `GET /api/v1/profiles/me` |
| `/health` | `real` | `GET /health` |
| `/activities/feed` | `mock` | deterministic static payload |
| `/recognition` | `mock` | deterministic static payload |
| `/teams` | `mock` | deterministic static payload |
| `/externals/integrations` | `mock` | deterministic static payload |

## Troubleshooting

- If `demo:check` reports a port conflict, stop the process using that port or provide `DEMO_API_PORT` / `DEMO_WEB_PORT`.
- If token minting fails, verify local JWT env values and `Auth__DevToken__Enabled=true`.
- If stale process state exists, run `pnpm demo:stop` and retry.
