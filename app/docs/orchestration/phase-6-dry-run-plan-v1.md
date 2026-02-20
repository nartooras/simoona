# Phase 6 Dry-Run Plan V1 (`T-0005`)

Date: `2026-02-20`  
Owner role: `$data-migration-engineer`  
Prerequisite evidence: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/staging-clone-access.md`

## Objective

Define the first migration rehearsal so we can validate tooling safety, data integrity checks, and rollback readiness before full cutover rehearsals.

## Staging Target

- Host: `127.0.0.1`
- Port: `14333`
- Database: `SimoonaStagingClone`
- Verification timestamp: `2026-02-20T14:16:41.127Z`

## Rehearsal Scope (Dry-Run 001)

In scope (bounded subset for first rehearsal):

1. Identity and organization entities (tenants, users, roles, memberships).
2. Wave A social-core entities (walls, posts, comments).
3. Notification entities tied to Wave A flows (notification feed + read-state).
4. Referential links between the groups above.

Out of scope (deferred to later rehearsals):

1. Premium and extended modules.
2. External integration payload stores.
3. Large binary/media migration.
4. Full production-scale volume/performance.

## Invariants to Validate

1. Row count parity for each in-scope entity group.
2. No orphaned records for key foreign-key chains:
   - `organization -> users -> memberships`
   - `walls -> posts -> comments`
   - `users -> notifications/read-state`
3. Critical domain checks:
   - membership/user references remain valid
   - wall/post/comment ownership references remain valid
4. Idempotency expectation:
   - rerunning dry-run with same snapshot does not create duplicates
   - rerun logs show deterministic step outcomes

## Checklist and Template Usage

Checklist baseline:

- `/Users/arturasnikoncukas/code/repo/simoona/app/skills/data-migration-engineer/references/migration-checklist.md`

Integrity report template baseline:

- `/Users/arturasnikoncukas/code/repo/simoona/app/skills/data-migration-engineer/references/integrity-report-template.md`
- Run-specific report artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-001-integrity-report.md`

## Dry-Run Execution Sequence

1. Prepare source snapshot metadata and migration inputs.
2. Execute migration scripts in dry-run mode (no destructive production actions).
3. Capture start/end timestamps and duration.
4. Run integrity checks and populate the run report artifact.
5. Execute rollback rehearsal steps and post-rollback validation.
6. Record readiness decision (`READY|NOT_READY`) and blockers.

## Rollback-Safe Notes

1. Dry-run must execute against staging clone only.
2. Every migration step must be resumable and logged.
3. Rollback script must restore pre-run state for in-scope entities.
4. Post-rollback integrity checks are mandatory before any readiness recommendation.

## Exit Signal for `T-0005`

`T-0005` is complete when this plan and the initial integrity-report artifact exist, and orchestration state is updated to show dry-run planning is ready for execution.
