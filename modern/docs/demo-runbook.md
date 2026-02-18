# Demo Runbook (Demo-Ready Baseline)

This runbook is the single operator checklist for local stakeholder demos of the modern prototype.

References:

- `modern/docs/prototype-shell-parity.md`
- `modern/docs/release-readiness-checklist.md`

## 1) Startup (exact order)

From repository root:

```bash
pnpm demo:check
pnpm demo:start
```

Stop after demo:

```bash
pnpm demo:stop
```

CI gate equivalent:

```bash
pnpm demo:check -- --ci
```

## 2) Preflight expectations

`pnpm demo:check` must pass with:

- `VITE_DEMO_MODE=true`
- valid `VITE_API_BASE_URL` (`http://127.0.0.1:5187/api` by default)
- numeric `VITE_API_ORGANIZATION_ID`
- JWT/dev-token bootstrap enabled (`Auth__DevToken__Enabled=true`)
- required route definitions and availability labels present
- API health + auth baseline checks passing

If it fails, follow the hint in command output:

- port collision: free the port or set `DEMO_API_PORT` / `DEMO_WEB_PORT`
- env mismatch: fix `VITE_*` / `Auth__*` values
- DB unavailable: verify `ConnectionStrings__LegacyReadOnly` and SQL Server connectivity

## 3) Demo click path (exact flow)

Open `http://127.0.0.1:5173` and walk in this order.

1. `/`
- Expected: shell loads, left rail visible, feed + right rail render.
- Expected notice: `Prototype availability: Real.`

2. `/user-info`
- Expected: real API-backed user payload or explicit API-unavailable fallback message.
- No crash; page remains navigable.

3. `/settings/general`
- Expected: selected language/time zone (real-backed) or explicit fallback message.

4. `/employees`
- Expected: directory table rows (real-backed) or explicit fallback message.

5. `/profiles/me`
- Expected: profile cards (real-backed) or explicit fallback message.

6. `/activities/feed`
- Expected: deterministic mock fixtures with read-only interaction semantics.

7. `/service-requests`
- Expected: disabled prototype route with explicit scope notice.

## 4) Route mode expectations

- `real`: API-backed read contract; writes remain out of scope.
- `mock`: deterministic fixture content for stable walkthroughs.
- `disabled`: route present for IA parity; workflow intentionally unavailable.

Route status matrix (`route -> real/mock/disabled + demo note`):

| Route | Mode | Demo note |
|---|---|---|
| `/` | `real` | Home wall shell parity route with deterministic read-first state behavior. |
| `/activities/feed` | `mock` | Fixture-backed activity stream for deterministic walkthroughs. |
| `/recognition` | `mock` | Deterministic recognition summary/cards preserving legacy IA destination. |
| `/events` | `mock` | Static event schedule + highlights for demo-safe navigation parity. |
| `/kudos` | `mock` | Mock leaderboard and category distribution cards. |
| `/service-requests` | `disabled` | Intentionally unavailable workflow route; explicit deferred-scope notice. |
| `/books` | `mock` | Read-only catalog snapshot for IA parity. |
| `/vacations` | `mock` | Read-only balances/history blocks close to legacy expectations. |
| `/office-map` | `mock` | Static occupancy and office coverage metrics; no desk writes. |
| `/organization/structure` | `mock` | Deterministic hierarchy summaries; non-editable by design. |
| `/employees` | `real` | API-backed employee directory with resilient fallback states. |
| `/projects` | `mock` | Deterministic project milestone/risk summary table. |
| `/committees` | `mock` | Fixture-backed committee membership/open-seat summaries. |
| `/teams` | `mock` | Read-only team structure/capacity cards for route parity. |
| `/user-info` | `real` | API-backed user information contract. |
| `/settings/general` | `real` | API-backed general settings contract. |
| `/profiles/me` | `real` | API-backed profile contract. |
| `/externals/integrations` | `disabled` | Visible only for IA parity; connector flows intentionally deferred. |
| `/health` | `real` | API readiness baseline route used by demo gate checks. |

## 5) Known gaps to narrate during demo

- Real routes are read-only (no persistent write flows).
- Mock routes are deterministic fixtures, not live integrations.
- Disabled routes (`/service-requests`, `/externals/integrations`) are intentionally unavailable.
- Media/reaction/comment flows in feed are prototype-safe simulations.

## 6) Demo-ready acceptance checklist

Confirm before stakeholder session:

- `pnpm demo:check` passes locally
- `pnpm demo:start` boots API + webapp and prints PASS
- shell/header/left rail/feed/right rail render without visual outliers
- real-route API outage fallback messaging is visible and non-fatal
- mock/real/disabled mode signaling is explicit on every shown screen
