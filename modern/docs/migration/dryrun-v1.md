# Data Migration Dry-Run v1

## Purpose

Data Migration Dry-Run v1 provides a deterministic, repeatable rehearsal path for read-only cutover validation.

It follows:
- `modern/docs/architecture.md`
- `modern/docs/auth-migration.md`
- `modern/docs/release-readiness-checklist.md`
- `modern/docs/adr/0002-read-only-first-data-migration.md`

Key safety principle: no production writes are executed.

## Covered v1 Entities

Dry-Run v1 transforms and validates only migration-critical read models required by already migrated screens/endpoints:
- users/profile basics
- organization references
- employee directory fields
- general settings essentials

## Tooling Location

- `modern/tools/migration/scripts/extract.mjs`
- `modern/tools/migration/scripts/transform.mjs`
- `modern/tools/migration/scripts/validate.mjs`
- `modern/tools/migration/scripts/run-dryrun.mjs`

## Prerequisites

- Node.js 22+
- `pnpm install` completed
- Read-only legacy export JSON available (or use provided fixture)

## Environment Variables

Optional variables:
- `MIGRATION_INPUT_PATH` (default: `modern/tools/migration/fixtures/legacy-export-sample.json`)
- `MIGRATION_OUTPUT_DIR` (default: `modern/tools/migration/output`)
- `MIGRATION_MODE` (default: `dry-run`)
- `MIGRATION_SOURCE` (default: `legacy-export-json`)

## Run Commands

End-to-end dry-run:

```bash
pnpm migration:dryrun:v1 \
  --input modern/tools/migration/fixtures/legacy-export-sample.json \
  --output-dir /tmp/simoona-migration-dryrun-v1 \
  --mode dry-run \
  --source legacy-export-json
```

Step-by-step:

```bash
node modern/tools/migration/scripts/extract.mjs --input modern/tools/migration/fixtures/legacy-export-sample.json --output-dir /tmp/simoona-migration-dryrun-v1
node modern/tools/migration/scripts/transform.mjs --output-dir /tmp/simoona-migration-dryrun-v1
node modern/tools/migration/scripts/validate.mjs --output-dir /tmp/simoona-migration-dryrun-v1
```

## Expected Outputs

Generated artifacts (example output dir `/tmp/simoona-migration-dryrun-v1`):
- `dryrun-v1.extracted.json`
- `dryrun-v1.transformed.json`
- `dryrun-v1.report.json`
- `dryrun-v1.report.md`

Report content includes:
- extracted counts
- transformed counts
- validation errors/warnings
- unmapped field list
- explicit assumptions and TODOs

## Safety Guardrails

- Dry-run is default mode.
- `--mode write` is explicitly blocked by design in v1.
- Scripts print clear warning banners before executing.
- No destructive database operations are implemented.

## Determinism and Repeatability

- Input normalization is stable.
- Entity records are sorted by deterministic keys.
- JSON outputs are written with stable key ordering.
- Fixture-based test verifies reproducible dry-run path.

## Known Gaps

- Live read-only DB adapter is not implemented in this thread; v1 consumes a read-only export JSON snapshot.
- Organization fallback naming uses placeholder `ORG-{organizationId}` when source organizations are absent.
- Department and office mapping parity may need a dedicated legacy source confirmation.
- General settings may be derived from user data when explicit settings source is absent.
