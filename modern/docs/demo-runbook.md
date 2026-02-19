# Demo Runbook (Wave 5 Stakeholder Pack)

Operator runbook for a repeatable 10-15 minute stakeholder demo with decision-focused narration.

## Demo Readiness

- Walkthrough script: `modern/docs/demo-runbook.md`
- Acceptance checklist (met/partial/deferred): `modern/docs/demo-acceptance-checklist.md`
- Known gaps vs legacy matrix: `modern/docs/demo-known-gaps-matrix.md`
- Route parity/source of truth: `modern/docs/prototype-shell-parity.md`
- Release gate baseline: `modern/docs/release-readiness-checklist.md`

## 1) Startup and Control Commands

Run from repository root in this exact order:

```bash
pnpm demo:check
pnpm demo:start
```

Stop after the session:

```bash
pnpm demo:stop
```

CI-safe command (no local server boot):

```bash
pnpm demo:check -- --ci
```

Use `demo:start` for demos. Do not substitute ad hoc `pnpm --filter @simoona/webapp dev` + manual API startup for stakeholder walkthroughs.

## 2) Preflight Expectations

`pnpm demo:check` must validate:

- `VITE_DEMO_MODE=true`
- `VITE_API_BASE_URL` targeting local modern API (`http://127.0.0.1:5187/api` by default)
- numeric `VITE_API_ORGANIZATION_ID`
- `Auth__DevToken__Enabled=true`
- critical route definitions + availability labels present
- API health and authenticated baseline calls succeeding

Failure hints from command output are authoritative:

- port collision: free port or set `DEMO_API_PORT` / `DEMO_WEB_PORT`
- env mismatch: correct `VITE_*` and `Auth__*` configuration
- DB unavailable: verify `ConnectionStrings__LegacyReadOnly` and SQL Server access

## 3) 10-15 Minute Walkthrough Script

Open `http://127.0.0.1:5173`.

| Minute | Route / action | Expected visual/behavior outcome |
|---|---|---|
| 0-1 | Confirm terminal shows `[demo:start] PASS` and open app | API + webapp are running in deterministic demo mode. |
| 1-3 | Home shell tour (`/`) | Header, grouped left rail, feed, and right rail render; notice reads `Prototype availability: Real.`; wall data summary indicates mock feed/widgets for stability. |
| 3-5 | Real-backed read route: `/user-info` | User payload is shown from modern API, or explicit API-unavailable fallback text appears without crashing/navigation loss. |
| 5-6 | Real-backed read route: `/settings/general` | Language/time zone settings load from modern API or clear fallback state renders. |
| 6-7 | Real-backed read route: `/employees` | Employee table/content region renders or explicit fallback appears; no blank page. |
| 7-9 | Mock-backed route: `/activities/feed` | Notice reads `Prototype availability: Mock.`; deterministic fixture content appears with read-only interaction framing. |
| 9-10 | Mock-backed route: `/kudos` (or `/events`) | Deterministic fixture cards/tables load; destination remains non-empty and stable between refreshes. |
| 10-12 | Deferred/disabled route: `/service-requests` | Notice reads `Prototype availability: Disabled.` and reason text explains deferred write-heavy workflow scope. |
| 12-15 | Decision wrap-up using docs | Open acceptance checklist + gaps matrix to confirm what is met now and what is intentionally deferred. |

## 4) Narration Guardrails

- `real` routes are read-first and no persistent writes are shown.
- `mock` routes are deterministic fixtures for walkthrough stability.
- `disabled` routes are visible for IA parity but intentionally unavailable.
- Keep "known gaps vs legacy" framing aligned to `modern/docs/demo-known-gaps-matrix.md`.
