# Demo Acceptance Checklist (Stakeholder Pack)

Use this checklist during rehearsal and stakeholder walkthrough sign-off.

## Demo Readiness

- Runbook and operator flow: `modern/docs/demo-runbook.md`
- Known gaps framing: `modern/docs/demo-known-gaps-matrix.md`
- Route/source baseline: `modern/docs/prototype-shell-parity.md`

## Current Demo Baseline

- Parity-acceptable now:
  - Shell, home route, and dedicated wall route fidelity are consistent enough for stakeholder walkthroughs at desktop demo widths.
  - Dedicated Events and Kudos routes are now demo-usable with deterministic controls, explicit state handling, and read-only safety framing.
  - Wave 7 theme unification removes remaining cross-route token drift through shared primitives and consistent page/header/card/list semantics.
  - Route contract and availability signaling are synchronized across navigation metadata, notices, and rendered destinations.
  - Demo commands provide actionable diagnostics for ports, API reachability, DB availability, and env/token setup.
- Known remaining gaps:
  - Mock/disabled routes still require narrated scope framing.
  - Write behaviors remain intentionally out of scope.
  - Events/Kudos remain fixture-backed in demo mode; create/submit flows stay deferred.
- Exact demo flow references:
  - Walkthrough order: `modern/docs/demo-runbook.md` section `3`.
  - Gap narration: `modern/docs/demo-known-gaps-matrix.md`.
  - Route baseline/source of truth: `modern/docs/prototype-shell-parity.md`.

## Wall Page Prototype

- Dedicated route: `/wall` (`mock` / `mock-backed` in route metadata).
- Demo expectations:
  - wall selector switches deterministically between `Company`, `Engineering`, and `People` contexts
  - read-side sort/topic controls deterministically transform feed order/content
  - explicit empty (`Newcomers Wall`) and unavailable (`Incident Wall`) states render with no blank screen
- Known limitations:
  - wall feed/widgets are fixture-backed in demo mode
  - like/reply/comment controls remain local-only and non-persistent
  - unavailable incident context is intentionally blocked pending legacy migration/access-policy decisions

## Checklist

| Area | Pass criteria | Status (`met` / `partial` / `deferred`) | Notes |
|---|---|---|---|
| Shell parity expectations | Header, left navigation, home feed, dedicated wall route, and right rail are coherent and stable at demo desktop widths; no major visual breakage during route changes. | `met` | Wave 6 geometry + Wave 7 theme-token/primitives pass removed remaining high-visibility spacing/state drift in shell + pages. |
| Route completeness expectations | All left-nav destinations open non-empty pages with explicit route availability mode (`real`, `mock`, `disabled`). | `met` | Navigation and route wiring are smoke-tested; mode labeling is present across demoed routes. |
| Data realism expectations | Real routes show modern API read data (or explicit fallback); mock routes (including `/wall`) show deterministic but believable fixtures; disabled routes clearly explain scope. | `partial` | Real routes are read-only and fallback-capable; fixture-backed modules remain deterministic until read contracts migrate. |
| Events/Kudos vertical slice expectations | `/events` and `/kudos` are route-complete and non-empty with deterministic filter behavior, explicit empty/unavailable states, and disabled write CTAs. | `met` | Event create/RSVP and give-kudos submission remain explicitly deferred while read-side demos are stable. |
| Demo reliability expectations | `pnpm demo:check` and `pnpm demo:start` complete reliably; key walkthrough path is repeatable without manual patching. | `met` | Diagnostics now clearly classify port collisions, API unreachable, DB unavailable, and missing env/token setup. |
| Write-scope expectations | No persistent writes are presented as available; deferred write-heavy flows are explicitly called out. | `met` | `/service-requests` and `/externals/integrations` remain intentionally unavailable; home and wall interactions stay local-only/non-persistent. |
| Stakeholder decision framing | Presenter can close with concrete "what is ready now vs next" artifacts. | `met` | Use this checklist with `modern/docs/demo-known-gaps-matrix.md` in wrap-up. |

## Decision Rule

- Proceed with demo as decision-ready when all rows are `met` or `partial` and no high-impact row is `deferred`.
