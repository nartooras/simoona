# UI Visual Target Reference

Date added: `2026-02-20`
Sources:
1. user-provided legacy UI screenshot (wall/feed screen)
2. user-provided legacy UI GIF demo (wall/feed interactions)
3. user-provided legacy UI screenshot (employee list screen)

## Purpose

Define concrete visual parity constraints from the provided legacy screenshot so UI implementation work is judged against a real target, not generic shell output.

## Screen Scope

Primary target A (wall/feed) captured in the reference screenshot/GIF:

1. Top blue header with left product label (`SIMOONA`), centered search box, and right user/actions cluster.
2. Left vertical navigation rail with grouped sections (`Walls`, `Activities`, `Company`, `Important externals`, `Externals`) and dense menu lists.
3. Main center feed column with stacked post cards, profile thumbnail, timestamp/meta rows, text content, media block, reactions, comments, and inline comment box.
4. Right sidebar widgets: quick counters/list cards, upcoming events, kudos leaderboards, birthdays.
5. Global layout spacing: fixed three-column feel with light-gray page background and white card surfaces.

Primary target B (employee list) captured in the employee screenshot:

1. Same top header/search/user-actions shell as wall/feed.
2. Same persistent left navigation rail and section grouping.
3. Center content title `Employee List` with immediate filter input row.
4. Dense data table with columns:
   - `First name Last name`
   - `Birth date`
   - `Job title`
   - `Working hours`
5. Row highlight state (light-blue selection), zebra-like row striping, and thin cell dividers.
6. Bottom pagination control with compact square-ish page buttons and active-page highlight.

## Visual Constraints (Must Match)

1. Color direction:
- header/action blue and link accents consistent with legacy tone.
- light gray app background and white content cards.

2. Density and spacing:
- compact, information-dense typography and row spacing.
- left menu and right widgets must preserve dense list presentation (not spacious modern-card redesign).

3. Layout behavior:
- persistent left navigation and right sidebar on desktop.
- feed remains dominant center column.

4. Component look:
- card borders/shadows are subtle and mostly flat.
- list separators and thin dividers are visible across side widgets and feed items.

5. Employee table look:
- table header typography and blue accent links match legacy style.
- table cell density remains compact; no oversized spacing or modern card-grid substitution.
- pagination styling/placement remains visually close to legacy.

## Functional-Visual Coupling

Visual parity checks must be tied to behavior checks for this screen cluster:

1. Route rendering and section highlight behavior in left navigation.
2. Feed card interactions (`Like`, `Reply`, comment entry) present in legacy-style placement.
3. Sidebar data widget structure and ordering consistent with legacy composition.
4. Employee table filter, row highlight, and pagination interactions align with legacy placement and behavior.

## Acceptance Evidence Requirements

To mark related UI routes as `verified`, attach:

1. runtime screenshot captures (desktop/tablet/mobile),
2. comparison note against this reference document,
3. route-level behavior assertions for the same screen paths.

## Notes

This reference now covers two high-value legacy screen clusters (`Wall/Feed` and `Employee List`).
Additional legacy screenshots should still be added for other areas (profile/admin/settings/etc.) before claiming full UI parity completion.
