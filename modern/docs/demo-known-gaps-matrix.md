# Known Gaps vs Legacy Matrix (Stakeholder Pack)

Practical, prioritized view of remaining differences to narrate during demo decisions.

## Demo Readiness

- Walkthrough script: `modern/docs/demo-runbook.md`
- Acceptance status: `modern/docs/demo-acceptance-checklist.md`
- Route/source baseline: `modern/docs/prototype-shell-parity.md`

## Current Demo Baseline

- Parity-acceptable now:
  - Shell/wall parity is stable for stakeholder walkthroughs.
  - Walls IA now matches legacy navigation semantics (`Official wall`, `All walls`, subscribed walls).
  - Wave 7 unified design tokens and reusable UI primitives across major routes, reducing visual drift between shell, real-backed pages, and placeholder pages.
  - Route contract metadata and availability labels are synchronized and non-empty across major destinations.
  - Demo reliability diagnostics are actionable for the main local failure classes.
- Known remaining gaps:
  - write-heavy modules are still disabled.
  - fixture-backed modules are still mock data.
  - social write interactions on wall feeds remain non-persistent.
  - Events/Kudos writes remain deferred even though read-side route slices are now demo-usable.
- Exact demo flow references:
  - walkthrough path: `modern/docs/demo-runbook.md` section `3`.
  - acceptance scoring: `modern/docs/demo-acceptance-checklist.md`.
  - route/source baseline: `modern/docs/prototype-shell-parity.md`.

## Events/Kudos Explicit Status

- Events (`/events`):
  - works now: deterministic grouped route with filter/sort controls, detail expansion, contextual widgets, and explicit empty/unavailable states.
  - mock-backed: deterministic fixture adapters in demo mode.
  - deferred: RSVP writes, event create/edit, reporting/export.
- Kudos (`/kudos`):
  - works now: deterministic feed + leaderboard/distribution with period/type/team filters and explicit empty/unavailable states.
  - mock-backed: deterministic fixture adapters in demo mode.
  - deferred: give-kudos submission and reward/category management.

## Matrix

| Priority | Area | Impact | Current status (`real` / `mock` / `disabled`) | Gap vs legacy | Recommended next action |
|---|---|---|---|---|---|
| 1 | Service requests workflow | high | `disabled` | Request creation/assignment/escalation writes are not available in modern demo flow. | Keep disabled in demos; plan dedicated write-path ADR + API/UI migration wave before enabling. |
| 2 | External integrations route | high | `disabled` | Connector setup and external sync workflows are not migrated. | Preserve IA placeholder with explicit scope note; sequence integration contract mapping and staged enablement. |
| 3 | Wall IA route data ownership | medium | `mock` | Official/all/subscribed wall routes are deterministic and fixture-backed; incident context remains unavailable pending legacy access-policy migration. | Keep demo-safe behavior; prioritize wall read contract migration and access policy mapping before enabling real incident data. |
| 4 | Wall feed interactions | medium | `mock` | Likes/replies/comments are simulated only, with no persistence or live counters. | Keep read-first framing in demos; define write semantics and backend ownership before implementation. |
| 5 | Events and Kudos read slices | medium | `mock` | Routes are now read-side complete and demo-usable, but still fixture-backed and write-disabled compared with legacy/live behavior. | Keep deterministic adapters for demo safety; prioritize modern API read contracts before enabling any writes. |
| 6 | Activity/books/vacations slices | medium | `mock` | Deterministic fixtures replace live backend data and legacy dynamic behavior. | Prioritize migration of highest-value read contracts to modern API; retire fixtures slice-by-slice. |
| 7 | Teams/projects/office/organization/committees | medium | `mock` | Company module destinations are route-complete but still non-live previews. | Convert by business priority, starting with routes that unblock stakeholder adoption decisions. |
| 8 | Shell micro-fidelity (icons, exact spacing) | low | `real` shell + mixed route modes | Wave 7 removed token drift, but pixel-exact legacy iconography and some fine-grain spacing nuances still differ. | Treat as polish backlog; avoid blocking demo unless visual regressions affect comprehension. |
| 9 | Advanced legacy interaction affordances | low | mixed (`real` + `mock`) | Context menus, inline edit/history, and richer interaction depth are not fully represented. | Add only where migration value is clear; keep current flows explicit about read-only/deferred scope. |

## Wall Navigation Prototype Limitations

- Wall IA routes (`/`, `/walls`, `/walls/<id>`) use deterministic fixture sets in demo mode (`mock-backed`).
- `All walls` includes one intentionally unavailable context and one intentionally empty context for realistic state coverage.
- Like/reply/comment affordances stay local-only and non-persistent; no write path is exposed.

## Demo Framing Guidance

- Start with what is stable now: route completeness, shell consistency, deterministic orchestration.
- Call out high-impact deferred areas early (`service-requests`, `integrations`) to avoid false write expectations.
- Close with priority order from this matrix to anchor next-wave decisions.
