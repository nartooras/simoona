# Frontend Visual Parity Foundation

## Scope and references

This parity baseline aligns with:

- `modern/docs/architecture.md`
- `modern/docs/frontend-migration-wave1.md`
- `modern/docs/frontend-migration-wave2.md`

Legacy visual source files reviewed:

- `src/webapp/src/client/app/layout/layout.html`
- `src/webapp/src/client/app/layout/navigation-bar/navigation-bar.html`
- `src/webapp/src/client/app/layout/left-menu/left-menu.html`
- `src/webapp/src/client/app/layout/left-menu/left-menu.controller.js`
- `src/webapp/src/client/styles/nc3/_variables.less`
- `src/webapp/src/client/styles/style/_base.less`
- `src/webapp/src/client/styles/style/_navigation.less`
- `src/webapp/src/client/styles/style/_tables.less`

## Legacy baseline findings

### Page shell (header/sidebar/content)

- Legacy uses a fixed top navigation bar with `42px` height and a two-column body layout (`left-menu` + content) under `container-fluid`.
- Sidebar width behavior is constrained around `150px` to `220px` and uses grouped navigation sections.
- Main content uses light gray page background (`#EBEBEB`) and white content blocks with subtle 1px shadow.

### Navigation behavior

- Navigation is split between top bar controls and grouped left sidebar (`activities`, `company`, `externals`).
- Active links use blue text (`#337ab7`), stronger weight, and light gray active background.
- Hover state uses a soft gray background.
- Mobile uses a toggle button and slide-in sidebar with a dark overlay.

### Typography scale

- Base font family: `Open Sans`.
- Base size: `14px`; compact nav/link text around `13px`.
- Brand text is uppercase and larger (`~19px`).
- Common line-height rhythm is `145%`.

### Color palette

- Primary text: `#282828`; muted text: `#737373`.
- Primary blue: `#0974b3`; active blue: `#337ab7`; hover/link accent: `#0089d9`.
- Page background: `#EBEBEB`; panel background: white; borders commonly `#dddddd`.
- Table row hover uses light blue (`#CCEBFF`).

### Spacing rhythm

- Small increments around `4/8/10/12px`, section spacing around `16/20px`.
- Content and sidebar commonly use `20px` vertical rhythm.
- Form/table cells commonly use `10px` paddings.

### Table/list/card patterns

- Legacy data tables (`.nc-table`) are white panels with light borders, subtle top shadow, blue headers, and row hover highlight.
- Details/read screens use small bordered white containers with compact label/value spacing.
- Lists and secondary nav are compact and text-first with lightweight visual chrome.

## Modern parity foundation implemented

Implemented in `modern/apps/webapp`:

- Added reusable CSS variable tokens in `src/styles.css` for:
  - color system
  - spacing scale
  - radius + shadow
  - typography scale + font stack
- Updated app shell to legacy-like information architecture:
  - fixed `42px` top header
  - grouped left sidebar nav (Workspace, Account, System)
  - active/hover treatments closer to legacy
  - responsive mobile drawer + overlay behavior
- Applied shared page primitives to migrated routes:
  - page title style
  - status message panels
  - info cards grid (`User Info`, `General Settings`, `My Profile`)
  - table shell + table row/header styling (`Employee Directory`)

## Parity status

| Area | Status | Notes |
|---|---|---|
| Page shell (header + sidebar + content) | matched | Top bar height, two-column layout, mobile drawer behavior now aligned. |
| Navigation active/hover behavior | matched | Blue active text + gray hover/active background implemented. |
| Typography baseline | matched | `Open Sans`, `14px` base, compact nav sizing, uppercase brand. |
| Color system | matched | Legacy-derived token palette added and used across shell/pages. |
| Spacing rhythm | partially matched | Core rhythm aligned, but full legacy module-by-module spacing is still pending. |
| Table/list/card patterns | partially matched | Core table/card primitives aligned for migrated pages only. |
| Legacy iconography and module-specific chrome | not matched yet | Legacy icon sets and specialized module visuals intentionally deferred. |

## Remaining gaps (out of scope for this thread)

- Feature-specific visual parity for non-migrated legacy modules.
- Full parity for advanced table interactions (selection states, inline actions, badges).
- Profile/settings sub-navigation and dropdown parity beyond migrated routes.
