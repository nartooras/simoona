# Backlog

Use this backlog as the task source of truth for the orchestrator.

## Priority Queue

1. `T-0077` `P0` Build Phase 6 migration tooling idempotency contract baseline (`READY`)
- Owner role: `$data-migration-agent`
- Phase: `Phase 6 - Data and File Migration`
- Dependencies: `Gate 5` completed (`T-0073`)
- Acceptance:
  - Phase 6 dry-run command contract is documented with idempotency and rollback-safe invariants
  - migration integrity report template is extended with duration and bottleneck capture fields
  - scope and prerequisites are aligned with `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/phase-6-dry-run-plan-v1.md`

2. `T-0078` `P1` Execute Dry-Run 002 migration rehearsal with timing capture (`BLOCKED`)
- Owner role: `$data-migration-agent`
- Phase: `Phase 6 - Data and File Migration`
- Dependencies: `T-0077`
- Acceptance:
  - Dry-Run 002 execution report includes start/end timestamps, duration, and throughput notes
  - integrity checks include row-count and referential-consistency summaries
  - blockers and optimization actions are explicitly assigned

3. `T-0079` `P1` Execute rollback rehearsal and publish Gate 6 precheck (`BLOCKED`)
- Owner role: `$qa-parity-agent` + `$data-migration-agent`
- Phase: `Phase 6 - Data and File Migration`
- Dependencies: `T-0077`, `T-0078`
- Acceptance:
  - rollback rehearsal result is documented with deterministic step outcomes
  - Gate 6 precheck status is recorded with explicit `GO|NO-GO`
  - no unresolved P0/P1 issues remain for migration rehearsal scope when recommending `GO`

## Completed Archive

1. `T-0001` `P0` Build initial API endpoint parity matrix (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`

2. `T-0002` `P0` Build initial UI route parity matrix (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-route-matrix.csv`

3. `T-0003` `P0` Create feature checklist baseline (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/feature-checklist.md`

4. `T-0006` `P0` Capture critical-flow golden API/UI fixtures baseline (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/golden-fixtures-index.md`

5. `T-0004` `P1` Bootstrap platform skeleton under `/app` (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/pnpm-workspace.yaml`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/docker/docker-compose.yml`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/ci/run-foundation-ci.sh`

6. `T-0007` `P1` Add CI baseline runner script (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/infra/ci/run-foundation-ci.sh`

7. `T-0008` `P1` Record Phase 1 foundation ADR (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/adr/0001-phase1-foundation-baseline.md`

8. `T-0009` `P1` Produce Gate 1 checklist artifact (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-1-foundation-checklist.md`

9. `T-0010` `P0` Build core auth/token compatibility scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/auth-compatibility.module.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/auth/controllers/account-compatibility.controller.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/auth.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv` (`AccountController` mappings)

10. `T-0011` `P0` Add tenant context compatibility middleware scaffold (`COMPLETED`)
- Main artifact: `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/tenant/tenant-context.middleware.ts`

11. `T-0012` `P0` Add legacy permission compatibility guard scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/permissions/legacy-permission.guard.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/permissions/permission-compatibility.module.ts`

12. `T-0013` `P0` Add legacy error mapping compatibility scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/errors/legacy-error.mapper.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/errors/legacy-error.filter.ts`

13. `T-0014` `P1` Bootstrap auth contract-harness fixture map (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/auth/auth-fixture-map.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-auth-fixture-map.mjs`

14. `T-0015` `P0` Add first runnable auth contract assertions (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/auth/auth-contract-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-auth-fixture-map.mjs`

15. `T-0016` `P0` Map token/user-login compatibility handlers in parity matrix (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`

16. `T-0017` `P1` Draft Gate 2 incremental checklist (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-2-core-compatibility-checklist.md`

17. `T-0018` `P1` Publish Phase 2 core compatibility plan (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/phase-2-core-compatibility-plan.md`

18. `T-0019` `P1` Expand auth fixture baseline for token issue flow (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/auth/auth-contract-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/auth/token-issue-success.json`

19. `T-0020` `P0` Add first runnable tenant/permission compatibility assertions (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/tenant-permission-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/tenant-permission-fixture-map.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-tenant-permission-contract.mjs`

20. `T-0021` `P0` Add first runnable error-shape compatibility assertions (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/error-shape-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/core/error-shape-fixture-map.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-error-shape-contract.mjs`

21. `T-0022` `P0` Add aggregate core compatibility contract command (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-auth-fixture-map.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-tenant-permission-contract.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-error-shape-contract.mjs`

22. `T-0023` `P1` Update Gate 2 checklist with runnable core compatibility evidence (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-2-core-compatibility-checklist.md`

23. `T-0024` `P1` Record Phase 2 checkpoint and queue next unblocked task (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/decisions.md`

24. `T-0025` `P0` Add legacy response/date/pagination compatibility middleware scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/conventions/legacy-pagination.middleware.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/conventions/legacy-date-serialization.interceptor.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/conventions/legacy-response-envelope.interceptor.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-compatibility-conventions-contract.mjs`

25. `T-0026` `P0` Bootstrap web shell auth boundary and tenant-aware routing skeleton (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/auth-boundary.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/tenant-route-container.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/top-level-layout.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/verify-web-shell-foundation.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-shell-foundation-links.md`

26. `T-0027` `P1` Close Gate 2 checklist with final compatibility evidence (`COMPLETED`)
- Main artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-2-core-compatibility-checklist.md`

27. `T-0028` `P1` Transition orchestration from Phase 2 to Phase 3 (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-3-ui-foundation-checklist.md`

28. `T-0029` `P0` Build shared UI primitives parity baseline (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/src/primitives/legacy-shell-button.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/src/primitives/legacy-shell-nav-item.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/src/index.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/top-level-layout.ts`

29. `T-0030` `P1` Establish Phase 3 visual regression baseline scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/visual/baseline-manifest.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/docs/visual-regression-workflow.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/scripts/verify-visual-baseline.mjs`

30. `T-0031` `P1` Expand shell/navigation parity route pack for Gate 3 (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-shell-route-pack.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/verify-shell-route-pack.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/package.json`

31. `T-0032` `P1` Add reduced-motion animation baseline tokens (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/src/motion/legacy-motion-tokens.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-motion-baseline.md`

32. `T-0033` `P1` Close Gate 3 and transition to Phase 4 (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-3-ui-foundation-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-feature-waves-checklist.md`

33. `T-0034` `P0` Build Wave A (Social Core) scope-to-contract mapping pack (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-scope-pack.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-api-scope.csv`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-ui-scope.csv`

34. `T-0035` `P1` Draft Gate 4 quality checklist execution plan for Wave A (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-wave-a-execution-plan.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-feature-waves-checklist.md`

35. `T-0036` `P1` Add Wave A contract target manifest and scope verifier (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-contract-targets.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-wave-a-scope-pack.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/package.json`

36. `T-0037` `P1` Add Wave A e2e target manifest and verifier (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/wave-a/wave-a-e2e-targets.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/scripts/verify-wave-a-e2e-targets.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/package.json`

37. `T-0038` `P1` Record Phase 4 checkpoint and queue first implementation slice (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`

38. `T-0039` `P0` Build Wave A wall read/feed compatibility endpoint scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/controllers/wall-compatibility.controller.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-api-scope.csv`

39. `T-0040` `P0` Build Wave A post create/edit compatibility endpoint scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/controllers/post-compatibility.controller.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-api-scaffold-baseline.json`

40. `T-0041` `P1` Build Wave A comment compatibility endpoint scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/controllers/comment-compatibility.controller.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-wave-a-api-scaffold.mjs`

41. `T-0042` `P1` Build Wave A notification compatibility endpoint scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/controllers/notification-compatibility.controller.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/controllers/user-notification-compatibility.controller.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`

42. `T-0043` `P1` Record Phase 4 checkpoint and queue next Wave A slice (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`

43. `T-0044` `P0` Build Wave A wall mutation and membership compatibility scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/controllers/wall-compatibility.controller.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-api-scope.csv`

44. `T-0045` `P0` Build Wave A post interaction compatibility endpoint scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/controllers/post-compatibility.controller.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-contract-targets.json`

45. `T-0046` `P1` Extend Wave A parity manifests/checks for mutation and interaction routes (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-api-scaffold-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-contract-targets.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-wave-a-scope-pack.mjs`

46. `T-0047` `P1` Expand Wave A e2e target pack for wall/post interaction coverage (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/wave-a/wave-a-e2e-targets.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/scripts/verify-wave-a-e2e-targets.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/README.md`

47. `T-0048` `P1` Record Phase 4 checkpoint and queue next Wave A slice (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`

48. `T-0049` `P0` Build Wave A realtime-notification compatibility scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-api-scaffold-baseline.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-contract-targets.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-realtime-markers.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-scope-pack.md`

49. `T-0050` `P1` Build Wave A realtime payload fixture parity pack (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-realtime-fixture-map.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/wave-a/realtime/wave-a-realtime-payload-fixtures.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-wave-a-realtime-fixtures.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/package.json`

50. `T-0051` `P0` Provision and verify staging SQL clone access (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/staging-clone-access.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`

51. `T-0005` `P1` Define first migration dry-run plan (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/phase-6-dry-run-plan-v1.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/dry-run-001-integrity-report.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/staging-clone-access.md`

52. `T-0052` `P0` Refill Phase 4 queue with runtime contract-hardening batch (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`

53. `T-0053` `P1` Add Wave A planned-response contract baseline (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-planned-response-contract.json`

54. `T-0054` `P1` Add executable Wave A planned-response verifier command (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-wave-a-planned-responses.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/package.json`

55. `T-0055` `P1` Update Gate 4 docs with planned-response contract checks (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-wave-a-execution-plan.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-feature-waves-checklist.md`

56. `T-0056` `P1` Record Phase 4 checkpoint and queue next runtime slice (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/decisions.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/risks.md`

57. `T-0057` `P0` Build Wave A wall read adapter and DTO normalization scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/adapters/wall-read.adapter.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/dto/wall-read-compatibility.dto.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/social-compatibility.module.ts`

58. `T-0058` `P1` Add Wave A notification settings DTO normalizer scaffold (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/dto/notification-settings-compatibility.dto.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`

59. `T-0059` `P1` Run Wave A contract bundle checkpoint (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-feature-waves-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`

60. `T-0060` `P0` Refill no-limit autopilot queue for Phase 4 runtime boundary continuation (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`

61. `T-0061` `P0` Add Wave A post/comment adapter-boundary scaffolds (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/adapters/social-operation.adapter.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/dto/social-operation-compatibility.dto.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/social-compatibility.module.ts`

62. `T-0062` `P1` Extend adapter-boundary scaffolds for notification endpoint methods (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/services/social-compatibility.service.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/src/modules/core/social/dto/notification-settings-compatibility.dto.ts`

63. `T-0063` `P1` Add Wave A adapter-boundary contract command (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-adapter-boundaries.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/scripts/verify-wave-a-adapter-boundaries.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-wave-a-execution-plan.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-feature-waves-checklist.md`

64. `T-0064` `P1` Record Phase 4 checkpoint and escalate closure blocker dependencies (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/risks.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/decisions.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`

65. `T-0065` `P0` Bootstrap runnable Wave A API parity harness (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/scripts/wave-a-api-harness.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/api/README.md`

66. `T-0066` `P1` Produce Wave A changed-screen visual approval pack (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/visual/wave-a-changed-screen-approvals.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/scripts/verify-wave-a-visual-approvals.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-visual-approval-pack.md`

67. `T-0067` `P1` Gate 4 Wave A closure checkpoint (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-feature-waves-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-wave-a-execution-plan.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/risks.md`

68. `T-0068` `P0` Build critical integration inventory and staging credential matrix (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/integration-inventory-matrix.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/parity-gap-report.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/feature-checklist.md`

69. `T-0069` `P0` Add Phase 5 integration smoke harness baseline (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-smoke-contract.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/scripts/verify-integration-smoke.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/integration-smoke-runbook.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/ci/pipeline-contract.md`

70. `T-0070` `P1` Gate 5 integration readiness checkpoint (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-5-integration-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/risks.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`

71. `T-0074` `P0` Bootstrap live web runtime foundation in `/app/web` (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/index.html`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/vite.config.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/main.tsx`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/live-web-runtime.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/package.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/README.md`

72. `T-0075` `P0` Wire Wave A shell routes into live web runtime (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/live-web-runtime.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/shell/top-level-layout.ts`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/src/index.ts`

73. `T-0076` `P1` Re-run Gate 3 and Gate 4 with live web runtime evidence (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-3-ui-foundation-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-feature-waves-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-4-wave-a-execution-plan.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/scripts/verify-wave-a-runtime-smoke.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/package.json`

74. `T-0071` `P0` Provision critical integration staging credential references (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-staging-credential-references.env`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence/integration-credential-references.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-smoke-contract.json`

75. `T-0072` `P1` Add provider failure-path integration smoke checks (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/scripts/verify-integration-smoke.mjs`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/infra/contracts/integration-smoke-contract.json`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/integration-smoke-runbook.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/package.json`

76. `T-0073` `P1` Re-run Gate 5 integration readiness checkpoint (`COMPLETED`)
- Main artifacts:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/gate-5-integration-checklist.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`

## Intake Template

For new tasks add:

- Priority (`P0|P1|P2|P3`)
- Task name
- Owner role
- Phase
- Dependencies
- Acceptance criteria
- Validation commands
