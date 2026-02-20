# Matrix Specification

Use these schemas for parity artifacts.

## api-endpoint-matrix.csv Columns

- `legacy_controller`
- `legacy_action`
- `http_method`
- `legacy_route`
- `auth_required`
- `permission_model`
- `modern_module`
- `modern_endpoint`
- `status` (`unmapped|mapped|implemented|verified`)
- `parity_notes`
- `last_verified_utc`

## ui-route-matrix.csv Columns

- `legacy_state_or_route`
- `legacy_url_pattern`
- `legacy_view`
- `role_or_permission`
- `modern_route`
- `modern_component`
- `status` (`unmapped|mapped|implemented|verified`)
- `parity_notes`
- `last_verified_utc`

## feature-checklist.md Sections

- `Core Features`
- `Admin Features`
- `Premium Features`
- `Integrations`
- `Background Jobs`

For each feature include:

- status (`unmapped|mapped|implemented|verified`)
- owner role
- linked evidence
