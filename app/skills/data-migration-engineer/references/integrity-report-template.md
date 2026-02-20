# Integrity Report Template

## 1) Run Metadata

- Environment:
- Dataset snapshot:
- Start time:
- End time:
- Duration:

## 2) Performance and Bottlenecks

- Throughput notes:
  - rows processed:
  - rows per minute:
  - projected full-run duration:
- Bottleneck capture:
  - component:
  - observation:
  - mitigation:

## 3) Migration Status

- Status: `SUCCESS|PARTIAL|FAILED`
- Steps completed:
- Steps failed:

## 4) Integrity Checks

- Row count checks:
  - expected:
  - actual:
- Referential checks:
  - expected:
  - actual:
- Critical domain checks:
  - expected:
  - actual:
- File/media checks:
  - expected:
  - actual:

## 5) Idempotency Verification

- Idempotency status: `pass|fail`
- Idempotency notes:

## 6) Rollback Verification

- Rollback attempted: `yes|no`
- Rollback status:
- Post-rollback validation:

## 7) Readiness Decision

- Readiness: `READY|NOT_READY`
- Blockers:
- Required fixes:
- Retest plan:
