# Data Migration Dry-Run v1 Report Template

Use this template for each dry-run rehearsal execution.

## Run Metadata

- Run ID: `<dryrun-v1-...>`
- Timestamp (UTC): `<YYYY-MM-DDTHH:mm:ss.sssZ>`
- Mode: `<dry-run>`
- Source: `<legacy export source identifier>`
- Writes executed: `no`

## Counts

| Entity | Extracted | Transformed |
|---|---:|---:|
| users/profile basics | `<n>` | `<n>` |
| organization references | `<n>` | `<n>` |
| employee directory | `<n>` | `<n>` |
| general settings essentials | `<n>` | `<n>` |

## Validation Summary

- Valid: `<yes/no>`
- Error count: `<n>`
- Warning count: `<n>`

### Errors

- `[<code>] (<entity>) <description>`

### Warnings

- `[<code>] (<entity>) <description>`

## Unmapped Fields

### users

- `<field>`

### organizations

- `<field>`

### employeeDirectory

- `<field>`

### generalSettings

- `<field>`

## Assumptions

- `<assumption>`

## TODOs

- `<todo>`

## Artifact Paths

Example generated artifact path (not committed by default):
- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.report.json`
- `/tmp/simoona-migration-dryrun-v1/dryrun-v1.report.md`

Static sample artifact committed for reference:
- `modern/docs/migration/examples/dryrun-v1-sample-report.json`
- `modern/docs/migration/examples/dryrun-v1-sample-report.md`
