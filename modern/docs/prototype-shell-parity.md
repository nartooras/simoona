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

### Wave 1A geometry baseline (desktop parity target)

| Geometry target | Value | Notes |
|---|---|---|
| Header height | `44px` | Sticky top chrome baseline. |
| Header content max width | `1360px` | Aligns with shell frame. |
| Sidebar width | `236px` | Fixed desktop nav rail width. |
| Content max width (center wall stream) | `748px` | Main wall feed parity target. |
| Right rail width | `272px` | Widget column parity target. |
| Core spacing (main grid gap + content gutter) | `18px` | Shared shell rhythm token. |
| Sidebar nav row height | `31px` | Legacy-like nav density baseline. |

### Wave 1B alignment completed

- wall post card anatomy now follows legacy rhythm more closely: wall label line, avatar/author/timestamp line, body spacing, media block proportion, reaction/meta line, and action row
- action affordances were aligned to legacy naming (`Like`/`Unlike`, `Reply`) while remaining read-only and non-persistent in prototype mode
- comment composer row now matches legacy visual treatment more closely (avatar + muted input field) and stays disabled
- read-only sample comment thread blocks were added under feed content to mirror legacy nested reply rhythm
- right-rail widgets (kudos, events, rankings, birthdays) now use tighter heading chrome, row separators, and compact two-line text hierarchy

### Wave 1C alignment completed

- left rail taxonomy was reordered to match legacy grouping and item rhythm for shared modules (notably Activities and Company ordering)
- group headers now support expand/collapse state with explicit chevron indicators and compact icon affordances
- left rail row density, hover/active/focus treatments, and long-list scroll behavior were tuned toward legacy sidebar interaction patterns
- item-level affordances now include subtle bullet markers and toned-down prototype availability labels to preserve legacy visual hierarchy
- topbar geometry pass aligned search + action control spacing/sizing while preserving existing prototype behavior

### Wave 1D alignment completed

- home feed card density now matches legacy compact rhythm more closely:
  - tighter card spacing and reduced intra-card whitespace
  - adjusted text scale/line-height/weight for wall label, author line, timestamp/meta, and body copy
  - reduced media block and avatar proportions to closer legacy anatomy
- post section separators were normalized so meta, reactions, actions, thread, and comment composer rows read as consistent compact blocks
- right rail widgets were refined to legacy-like block anatomy:
  - tighter header treatment (uppercase, compact blue heading chrome)
  - denser row spacing with cleaner separators
  - compact two-level typography hierarchy for row primary/secondary text
- feed and widget structure tests were expanded to lock section ordering, separator-row presence, and right-rail heading/list semantics

### Wave 2A alignment completed

- home feed interactions now behave closer to legacy while staying prototype-safe:
  - like/unlike toggles are interactive and local-only (simulated, non-persistent)
  - reply composer expands/collapses per post via a dedicated action toggle
  - comment thread visibility uses explicit show/hide replies controls
- home route data shaping now uses explicit adapter split (`real` vs `mock`) with deterministic fixture sets:
  - feed and right-rail adapters are selected through the hybrid data-source matrix
  - fixture content now mirrors legacy-like author/timestamp/wall label/comment/reply anatomy
  - right-rail order and density align to legacy scanning rhythm (`Kudos Feed`, `Upcoming Events`, `Rankings`, `Birthdays`)
- home sections now have resilient state handling for demo safety:
  - loading states for feed and right rail during adapter resolution
  - empty states when an adapter yields zero items
  - unavailable states with explicit reason text if a section source is disabled
- interactive section styling was tightened for parity:
  - denser action-row spacing and clearer hierarchy between actions, replies, and composer
  - reply blocks now read as compact nested conversation units with clearer separation

### Wave 2B alignment completed

- shell frame geometry was tuned toward legacy desktop proportions:
  - left rail width, center gutter rhythm, and right-rail offset were re-balanced (`232 / 16 / 268` shell tokens)
  - content and rail spacing now use a tighter compact baseline at desktop breakpoints
- topbar fidelity moved closer to legacy chrome hierarchy:
  - topbar control/search geometry was tightened with explicit Wave 2B semantic hooks
  - right-side controls now include icon-first affordances for create, quick links, notifications, and profile chevron hierarchy
  - brand/search/action typography scale and spacing were compacted for legacy-like scanning rhythm
- left rail fidelity was refined for dense legacy-like navigation:
  - group toggle headers and row spacing were tightened for compactness
  - hover/active/focus states now include stronger left-edge contrast cues and consistent focus outlines
  - long navigation labels now truncate with ellipsis instead of overflow wrapping
- shell geometry regression guardrails now assert semantic hooks (topbar + left rail) rather than brittle pixel-only expectations.

### Explicit gaps vs legacy after Wave 2B

- legacy icon sprite assets are still represented by simple text/placeholders
- write interactions remain intentionally non-persistent (no backend like/reply/comment mutations)
- advanced legacy controls (context menus, inline dropdown workflows, live counters) are still static
- fine-grain font rendering parity (glyph metrics/kerning) remains approximate
- screenshot pixel-diff automation is still not wired; baseline scaffold exists at `modern/apps/webapp/src/smoke/ShellVisualBaseline.scaffold.ts`
- profile/settings account dropdown parity in topbar remains simplified in prototype shell (single non-interactive trigger only)
- externals split (`Externals important` vs `Externals basic`) remains condensed into a single modern externals section

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
