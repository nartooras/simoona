# Migration Dry-Run v1 Tooling

This folder contains deterministic, read-only migration rehearsal tooling for:
- extract
- transform
- validate

Entry points:
- `modern/tools/migration/scripts/extract.mjs`
- `modern/tools/migration/scripts/transform.mjs`
- `modern/tools/migration/scripts/validate.mjs`
- `modern/tools/migration/scripts/run-dryrun.mjs`

Default mode is always `dry-run` and write mode is intentionally blocked.
