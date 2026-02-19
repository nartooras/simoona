# Demo Acceptance Checklist (Stakeholder Pack)

Use this checklist during rehearsal and stakeholder walkthrough sign-off.

## Demo Readiness

- Runbook and operator flow: `modern/docs/demo-runbook.md`
- Known gaps framing: `modern/docs/demo-known-gaps-matrix.md`
- Route/source baseline: `modern/docs/prototype-shell-parity.md`

## Checklist

| Area | Pass criteria | Status (`met` / `partial` / `deferred`) | Notes |
|---|---|---|---|
| Shell parity expectations | Header, left navigation, home feed, and right rail are coherent and stable at demo desktop widths; no major visual breakage during route changes. | `partial` | Core shell parity is strong; legacy icon spriteography and some micro-geometry details are still approximate. |
| Route completeness expectations | All left-nav destinations open non-empty pages with explicit route availability mode (`real`, `mock`, `disabled`). | `met` | Navigation and route wiring are smoke-tested; mode labeling is present across demoed routes. |
| Data realism expectations | Real routes show modern API read data (or explicit fallback); mock routes show deterministic but believable fixtures; disabled routes clearly explain scope. | `partial` | Real routes are read-only and fallback-capable; mock data remains fixture-based rather than live legacy parity data. |
| Demo reliability expectations | `pnpm demo:check` and `pnpm demo:start` complete reliably; key walkthrough path is repeatable without manual patching. | `met` | Demo orchestration preflight + startup checks enforce deterministic environment and route baselines. |
| Write-scope expectations | No persistent writes are presented as available; deferred write-heavy flows are explicitly called out. | `met` | `/service-requests` and `/externals/integrations` remain intentionally unavailable; home interactions stay local-only/non-persistent. |
| Stakeholder decision framing | Presenter can close with concrete "what is ready now vs next" artifacts. | `met` | Use this checklist with `modern/docs/demo-known-gaps-matrix.md` in wrap-up. |

## Decision Rule

- Proceed with demo as decision-ready when all rows are `met` or `partial` and no high-impact row is `deferred`.
