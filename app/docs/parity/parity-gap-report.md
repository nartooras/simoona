# Parity Gap Report

## 1) Coverage Summary

- API coverage: mapped 15.26% (29/190), implemented 0.00% (0/190), verified 0.00% (0/190).
- UI coverage: mapped 0.00% (0/115), implemented 0.00% (0/115), verified 0.00% (0/115).
- Domain coverage highlights (API):
- applicationuser: total 32, mapped 0 (0.00%), implemented 0, verified 0
- auth: total 11, mapped 0 (0.00%), implemented 0, verified 0
- wall: total 11, mapped 11 (100.00%), implemented 0, verified 0
- post: total 8, mapped 8 (100.00%), implemented 0, verified 0
- project: total 8, mapped 0 (0.00%), implemented 0, verified 0
- floor: total 7, mapped 0 (0.00%), implemented 0, verified 0
- kudosbasket: total 7, mapped 0 (0.00%), implemented 0, verified 0
- organization: total 7, mapped 0 (0.00%), implemented 0, verified 0
- Domain coverage highlights (UI):
- admin.customization: total 24, mapped 0 (0.00%), implemented 0, verified 0
- admin.offices: total 10, mapped 0 (0.00%), implemented 0, verified 0
- client.events: total 8, mapped 0 (0.00%), implemented 0, verified 0
- client.wall: total 8, mapped 0 (0.00%), implemented 0, verified 0
- admin.lotteries: total 5, mapped 0 (0.00%), implemented 0, verified 0
- client.projects: total 5, mapped 0 (0.00%), implemented 0, verified 0
- admin.roles: total 4, mapped 0 (0.00%), implemented 0, verified 0
- admin.roomtypes: total 4, mapped 0 (0.00%), implemented 0, verified 0

## 2) Critical Gaps (P0/P1)

1. API implementation parity is not started for most domains
   - Area: API parity implementation
   - Legacy reference: app/docs/parity/api-endpoint-matrix.csv
   - Missing in modern: 161 endpoints are still unmapped and 0 endpoints are implemented/verified.
   - Impact: R2 (API parity) cannot start safely without deeper endpoint mapping and contract-first implementation.
   - Recommended owner: $full-stack-developer + $parity-analyst
   - Suggested next task: execute R2-001 auth/account/token wave using shared contracts from app/packages/contracts.

2. UI route parity mapping remains fully unmapped
   - Area: UI route parity
   - Legacy reference: app/docs/parity/ui-route-matrix.csv
   - Missing in modern: 115/115 routes are unmapped and unverified.
   - Impact: R3 cannot progress and user-visible behavior parity remains unproven.
   - Recommended owner: $full-stack-developer + $parity-analyst
   - Suggested next task: map and implement auth shell + core navigation routes as first R3 wave.

## 3) Medium/Low Gaps (P2/P3)

1. Domain-level verification timestamps are empty
   - Area: parity evidence hygiene
   - Impact: weak audit trail for parity progression and gate readiness.
   - Recommended owner: $qa + $parity-analyst

2. Modern module-to-domain mapping is partial
   - Area: architecture traceability
   - Impact: dependency planning between R2 and R3 remains less predictable.
   - Recommended owner: $parity-analyst

## 4) Verification Blockers

- No hard environment blocker for R1 baseline tasks.
  - Needed to proceed: finish R1-002 command hardening and R1-003 shared contracts expansion.

## 5) Recommended Next Tasks

1. Complete R1-002 by replacing placeholder root/API command wrappers with runtime-backed command execution.
2. Complete R1-003 by expanding app/packages/contracts with route map, auth claims, permission constants, and error envelope schema.
3. Start R2-001 auth/account/token parity wave after R1 gate closes.
