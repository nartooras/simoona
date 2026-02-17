# Data Migration Dry-Run v1 Report

## Run
- Run ID: dryrun-v1-20260217120000000
- Timestamp (UTC): 2026-02-17T12:00:00.000Z
- Mode: dry-run
- Source: legacy-export-json
- Writes executed: no

## Counts
| Entity | Extracted | Transformed |
|---|---:|---:|
| users/profile basics | 2 | 2 |
| organization references | 1 | 1 |
| employee directory | 2 | 2 |
| general settings essentials | 1 | 1 |

## Validation
- Valid: yes
- Errors: 0
- Warnings: 4

### Errors
- None

### Warnings
- [UNMAPPED_FIELDS] (users) Unmapped fields in users: legacySalaryBand, legacySlackHandle.
- [UNMAPPED_FIELDS] (organizations) Unmapped fields in organizations: legacyRegionCode.
- [UNMAPPED_FIELDS] (employeeDirectory) Unmapped fields in employeeDirectory: legacyDeskLocation.
- [UNMAPPED_FIELDS] (generalSettings) Unmapped fields in generalSettings: legacyTheme.

## Unmapped Fields
### users
- legacySalaryBand
- legacySlackHandle

### organizations
- legacyRegionCode

### employeeDirectory
- legacyDeskLocation

### generalSettings
- legacyTheme

## Assumptions
- When legacy organizations are missing, organization references are derived from users using ORG-{organizationId} placeholders.
- When legacy employee directory rows are missing, employee directory is derived from users/profile basics.
- When legacy general settings rows are missing, general settings are derived from users culture/timezone values.

## TODOs
- TODO: Replace organization placeholder names with authoritative organization lookup from legacy source.
- TODO: Confirm final legacy source for department and office mappings for profile response parity.
- TODO: Replace derived general settings fallback with dedicated legacy settings source once available.
