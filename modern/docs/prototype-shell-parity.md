# Prototype Shell Parity Pass (Thread P)

This document captures the prototype-focused shell/navigation parity pass for `modern/apps/webapp` and the explicit route availability labeling introduced for demo safety.

References:

- `modern/docs/architecture.md`
- `modern/docs/frontend-visual-parity.md`
- `modern/docs/release-readiness-checklist.md`

## Navigation IA alignment

The modern shell now mirrors legacy IA grouping more closely:

- Activities
- Company
- Externals
- System

The top header also includes explicit prototype affordances (`Prototype IA`, demo org context) so walkthroughs clearly signal non-production context.

## Route availability map

| Route | Nav group | Availability | Notes |
|---|---|---|---|
| `/` | Activities | `real` | Home shell and parity summary, real route. |
| `/activities/feed` | Activities | `mock` | Static feed preview; legacy modules still own live feed behavior. |
| `/recognition` | Activities | `mock` | Static recognition preview; no live nomination flow wiring. |
| `/employees` | Company | `real` | Backed by modern API (`GET /api/v1/employees`). |
| `/profiles/me` | Company | `real` | Backed by modern API (`GET /api/v1/profiles/me`). |
| `/user-info` | Company | `real` | Backed by modern API (`GET /api/v1/account/user-info`). |
| `/settings/general` | Company | `real` | Backed by modern API read contract (`GET /api/v1/user/general-settings`). |
| `/teams` | Company | `mock` | Prototype shell section with static team/capacity placeholders. |
| `/externals/integrations` | Externals | `disabled` | Visible for IA parity only; intentionally unavailable in prototype. |
| `/health` | System | `real` | Modern API readiness route baseline. |

## Prototype availability labeling

Every route now renders a `PrototypeNotice` banner with one of:

- `real`
- `mock`
- `disabled`

For non-real routes, the notice includes an explicit reason to prevent demo ambiguity and false production assumptions.

## Placeholder quality baseline

Prototype (`mock`/`disabled`) routes now include realistic static sections/cards:

- summary context
- representative card content
- explicit limitations and non-production behavior markers

No prototype route is left blank.

## Parity status after this pass

### Parity-matched in this thread

- IA grouping and menu ordering now aligns to legacy-style sections.
- Key nav entries are visible in shell, including placeholder areas.
- Header has clearer top-level affordances for demo context.
- Route-level prototype availability is explicit across the app shell.

### Still pending

- Legacy module-specific icons and specialized chrome details.
- Full interaction parity for advanced module flows (actions, dropdown workflows, inline editing).
- Migrating mocked/disabled routes to real API-backed functionality.
