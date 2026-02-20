# Migration Checklist

Use this checklist before recommending readiness.

## Design

- migration scope and entities are documented
- source/target mapping rules are explicit
- invariants are defined

## Script Safety

- scripts are idempotent
- scripts are resumable after failure
- scripts emit actionable logs

## Dry-Run

- dry-run executed on staging clone
- runtime duration recorded
- no blocking errors

## Integrity

- row counts validated
- key references validated
- critical business constraints validated
- file checksum or size checks validated (if applicable)

## Rollback

- rollback steps documented
- rollback rehearsal executed
- post-rollback integrity validated
