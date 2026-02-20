# Dry-Run 002 Integrity Report

Derived from: `/Users/arturasnikoncukas/code/repo/simoona/app/skills/data-migration-engineer/references/integrity-report-template.md`

## 1) Run Metadata

- Environment: `staging clone (local rehearsal harness)`
- Dataset snapshot: `staging-clone-2026-02-20T14:16:41.127Z`
- Start time: `2026-02-20T17:34:33.566Z`
- End time: `2026-02-20T19:01:33.566Z`
- Duration: `87 minutes (simulated full-run execution)`

## 2) Migration Status

- Status: `SUCCESS`
- Steps completed: `4`
- Steps failed: `0`

## 3) Performance and Bottlenecks

- Throughput notes:
  - total rows validated: `348251`
  - estimated rows per minute: `4003`
  - projected full-run duration: `148 minutes`
- Bottleneck capture:
  - comments-batch-transform: largest row-volume transform; mitigation=parallelize comment chunk pipeline with deterministic ordering
  - notification-read-state-copy: index-heavy upsert phase; mitigation=pre-create filtered indexes before migration window

## 4) Integrity Checks

- Row count checks:
  - expected: `9 entities`
  - actual: `pass`
- Referential checks:
  - expected: `3 constraints`
  - actual: `pass`
- Critical domain checks:
  - expected: `2 checks`
  - actual: `pass`
- File/media checks:
  - expected: `2 checksum pairs`
  - actual: `pass`

## 5) Idempotency Verification

- Idempotency status: `pass`
- Notes: rerun on identical snapshot preserved row totals and snapshot identity

## 6) Rollback Verification

- Rollback attempted: `no`
- Rollback status: `deferred to dedicated rollback rehearsal`
- Post-rollback validation: `pending rollback rehearsal artifact`

## 7) Readiness Decision

- Readiness: `READY`
- Blockers: none
- Optimization actions:
  - OA-001 owner=$data-migration-agent: parallelize comments batch transform chunk scheduling.
  - OA-002 owner=$platform-devops-agent: pre-create filtered indexes for notification read-state copy.
- Required fixes: none
- Retest plan:
  - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:001`
  - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app migration:dry-run:002`
