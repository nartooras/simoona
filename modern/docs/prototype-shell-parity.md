# Prototype Shell Parity Pass (Threads P + R)

This document captures the prototype-focused shell/navigation parity work for `modern/apps/webapp`, including route availability labeling and broader high-visibility prototype route coverage for demo-safe walkthroughs.

References:

- `modern/docs/architecture.md`
- `modern/docs/frontend-visual-parity.md`
- `modern/docs/demo-runbook.md`
- `modern/docs/release-readiness-checklist.md`

## Navigation IA alignment

The modern shell now mirrors legacy IA grouping more closely:

- Activities
- Company
- Externals
- System

The top header also includes explicit prototype affordances (`Prototype Shell`, demo org context) so walkthroughs clearly signal non-production context.

## Route availability map

| Route | Nav group | Availability mode | Data source | Demo status | Notes |
|---|---|---|---|---|---|
| `/` | Activities | `real` | `real` | ready | Home shell and parity summary route. |
| `/activities/feed` | Activities | `mock` | `mock` | ready | Static feed preview; live ingestion remains legacy-owned. |
| `/recognition` | Activities | `mock` | `mock` | ready | Recognition stream represented by deterministic mock cards. |
| `/events` | Activities | `mock` | `mock` | ready | Event discovery and schedule preview are fixture-backed. |
| `/vacations` | Activities | `mock` | `mock` | ready | Vacation overview is visible as read-only prototype scaffolding. |
| `/kudos` | Activities | `mock` | `mock` | ready | Kudos metrics and leaderboard are static demo content. |
| `/books` | Activities | `mock` | `mock` | ready | Book catalog entry point included for IA coverage. |
| `/service-requests` | Activities | `disabled` | `disabled` | constrained | Write-heavy workflow remains intentionally disabled in prototype mode. |
| `/employees` | Company | `real` | `real` | ready | Backed by modern API (`GET /api/v1/employees`). |
| `/profiles/me` | Company | `real` | `real` | ready | Backed by modern API (`GET /api/v1/profiles/me`). |
| `/user-info` | Company | `real` | `real` | ready | Backed by modern API (`GET /api/v1/account/user-info`). |
| `/settings/general` | Company | `real` | `real` | ready | Backed by modern API read contract (`GET /api/v1/user/general-settings`). |
| `/teams` | Company | `mock` | `mock` | ready | Team structure and capacity views are fixture-backed placeholders. |
| `/projects` | Company | `mock` | `mock` | ready | Project board route exposed via static milestone summaries. |
| `/office-map` | Company | `mock` | `mock` | ready | Office occupancy is demo-only and read-only. |
| `/organization/structure` | Company | `mock` | `mock` | ready | Organization hierarchy route is static and non-editable. |
| `/committees` | Company | `mock` | `mock` | ready | Committee overviews are represented with deterministic mock data. |
| `/externals/integrations` | Externals | `disabled` | `disabled` | constrained | Visible for IA parity only; connector setup remains out of scope. |
| `/health` | System | `real` | `real` | ready | Modern API readiness baseline route. |

## Prototype availability labeling

Every route now renders a `PrototypeNotice` banner with one of:

- `real`
- `mock`
- `disabled`

For non-real routes, the notice includes an explicit reason to prevent demo ambiguity and false production assumptions.

## Placeholder quality baseline

Prototype (`mock`/`disabled`) routes now include consistent semantic content blocks:

- summary context + deterministic data source marker
- representative cards/table blocks
- standardized sections:
  - available now
  - unavailable in prototype
  - planned next wave
- simulated disabled controls with explicit prototype-mode explanation

No prototype route is left blank.

## Parity status after this pass

### Parity-matched in this thread

- IA grouping and menu ordering now aligns to legacy-style sections.
- Key nav entries are visible in shell, including placeholder areas.
- Header has clearer top-level affordances for demo context.
- Route-level prototype availability is explicit across the app shell.
- Thread S hard gate now validates critical route definitions and availability labels before demo start/check pass.

## Wall Layout Parity

The `/` home route now mirrors legacy wall layout rhythm more closely with a dense three-column shell:

- left navigation column keeps grouped sections with visual expand/collapse indicators (`Walls`, `Activities`, `Company`, `Externals`, `System`) and active-item emphasis
- center stream includes stacked wall cards with source label, avatar/author/timestamp line, body text, media placeholder, reaction row, and disabled comment input row
- right rail includes compact cards for kudos feed, upcoming events, rankings, and birthdays with subtle row separators
- top blue header keeps global chrome and now includes search + quick user actions for legacy-like scanning behavior

### Wall Layout Parity: Matches

- compact spacing, thin borders/dividers, and light-gray canvas with white/near-white cards
- blue accent hierarchy on links, section titles, and navigational emphasis
- responsive behavior where side columns collapse/stack while preserving key feed and widget content
- prototype safety maintained: interaction controls shown but non-destructive and no backend write behavior added

### Wall Layout Parity: Remaining differences

- legacy-specific icon set and sprite assets are approximated with text/shape placeholders
- some exact pixel values (line heights, card paddings, and vertical offsets) remain slightly modernized
- advanced legacy controls (inline dropdown workflows, context menus, and live counters) are still static demo representations

### Still pending

- Legacy module-specific icons and specialized chrome details.
- Full interaction parity for advanced module flows (actions, dropdown workflows, inline editing).
- Migrating mocked/disabled routes to real API-backed functionality.

## Demo-ready quality checklist

| Focus area | Status | Detail |
|---|---|---|
| Visual consistency | ready | Shared spacing, typography hierarchy, notice styling, and card/table rhythm are aligned across migrated and placeholder routes. |
| Route coverage | ready | All nav entries are wired to concrete routes; route definitions and navigation links are test-validated for parity. |
| Known limitations | constrained | `mock` routes are fixture-backed; `disabled` routes are intentionally unavailable for write-heavy workflows. |
| Activities group | ready with constraints | Activity placeholders are demo-stable; Service Requests remains intentionally disabled and clearly labeled. |
| Company group | ready | Core migrated read routes are real-backed; remaining company routes are coherent mock previews. |
| Externals group | constrained | Integrations remains visible for IA parity and explicitly disabled. |
| System group | ready | Health route remains real-backed and stable for demo checks. |
