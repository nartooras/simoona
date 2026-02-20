# Decisions

Record major architecture and delivery decisions with rationale.

## ADR-Style Log

1. `D-001` Frontend stack
- Date: `2026-02-20`
- Decision: `React + Vite + TypeScript`
- Rationale: fast local iteration on macOS and strong typed ecosystem.

2. `D-002` Backend stack
- Date: `2026-02-20`
- Decision: `Node.js + NestJS + TypeScript`
- Rationale: unified TypeScript stack and modular API architecture.

3. `D-003` Delivery strategy
- Date: `2026-02-20`
- Decision: `Big-bang cutover with phased internal delivery`
- Rationale: align with explicit stakeholder direction while using phased risk control.

4. `D-004` Compatibility contract
- Date: `2026-02-20`
- Decision: `Strict HTTP API + UI behavior parity`
- Rationale: preserve all legacy functionality with no omissions.

5. `D-005` Gate flow
- Date: `2026-02-20`
- Decision: `$full-stack-developer -> $reviewer -> $qa`
- Rationale: enforce quality and scope control before merge.

6. `D-006` Initial execution order
- Date: `2026-02-20`
- Decision: `Start with Phase 0 API endpoint parity matrix (T-0001) as highest-priority unblocked task`
- Rationale: endpoint inventory is a hard prerequisite for contract-first compatibility work and later wave planning.

7. `D-007` Autopilot execution batch limit
- Date: `2026-02-20`
- Decision: `Run Phase 0 tasks in bounded autopilot batches of up to 3 tasks per cycle`
- Rationale: preserves momentum while keeping review and gate updates manageable per cycle.

8. `D-008` Phase transition policy
- Date: `2026-02-20`
- Decision: `Stop autopilot cycle when current phase gate is complete, then hand over to next phase backlog`
- Rationale: respects gate-based delivery and avoids mixing objectives across phases in a single run.

9. `D-009` Foundation command contract
- Date: `2026-02-20`
- Decision: `Use stable root commands under /app (bootstrap, lint, typecheck, test, smoke, build) for early CI and local gates`
- Rationale: preserves predictable automation interfaces while implementation details evolve.

10. `D-010` Phase 1 container baseline
- Date: `2026-02-20`
- Decision: `Adopt placeholder Docker Compose services (web, api, redis) for initial runtime topology`
- Rationale: establishes deployment shape early without blocking on full app implementation.

11. `D-011` Phase 2 auth compatibility-first sequence
- Date: `2026-02-20`
- Decision: `Start Gate 2 with auth/token compatibility scaffolding before tenant/permission/error hardening`
- Rationale: auth behaviors are the highest-risk contract boundary and unblock fixture-driven contract testing.

12. `D-012` Contract-assertion validation style
- Date: `2026-02-20`
- Decision: `Use fixture-map-driven assertions that verify both fixture integrity and compatibility markers in core service scaffolds`
- Rationale: provides deterministic parity checks before full endpoint runtime wiring is in place.

13. `D-013` Core parity command consolidation
- Date: `2026-02-20`
- Decision: `Add a single parity command (contract:core) that executes auth + tenant/permission + error-shape checks`
- Rationale: reduces operator error and provides a single Gate 2 verification command.

14. `D-014` Autopilot continuation target after batch completion
- Date: `2026-02-20`
- Decision: `After completing the 5-task batch (`T-0020`..`T-0024`), queue middleware conventions (`T-0025`) as next highest-priority unblocked Phase 2 task`
- Rationale: middleware conventions are a direct prerequisite for web shell parity foundation and Gate 2 closure.

15. `D-015` Legacy conventions validation strategy
- Date: `2026-02-20`
- Decision: `Add a dedicated parity contract (`contract:conventions`) for response envelope, date serialization, and pagination markers`
- Rationale: keeps middleware/interceptor scaffold verification deterministic and repeatable in Gate 2.

16. `D-016` Phase 2 closure transition
- Date: `2026-02-20`
- Decision: `Close Gate 2 after auth/tenant/permission/error/conventions + shell baseline checks are green, then move to Phase 3 with a new gate checklist`
- Rationale: aligns gate progression with phased delivery boundaries and prevents cross-phase drift.

17. `D-017` Phase 3 shared primitive baseline strategy
- Date: `2026-02-20`
- Decision: `Introduce shared shell primitives and motion tokens in /app/packages/ui and enforce them with a dedicated primitives check script`
- Rationale: centralizes shell UI behavior contracts and creates reusable parity markers before feature waves.

18. `D-018` Visual baseline-first gating for Phase 3
- Date: `2026-02-20`
- Decision: `Treat visual regression baseline manifest/workflow + verification as the first Gate 3 approval signal`
- Rationale: enables controlled viewport coverage before integrating full screenshot tooling.

19. `D-019` Phase 3 closure transition
- Date: `2026-02-20`
- Decision: `Close Gate 3 after primitives, route parity, motion reduced-motion, and visual baseline checks pass, then transition to Phase 4`
- Rationale: keeps progression aligned with defined phase-gate criteria and avoids scope bleed.

20. `D-020` Wave A scope extraction policy
- Date: `2026-02-20`
- Decision: `Define Wave A scope directly from parity matrices using controller/state inclusion rules and publish dedicated API/UI scope CSV extracts`
- Rationale: provides deterministic wave boundaries before endpoint implementation starts.

21. `D-021` Wave A quality gate bootstrap
- Date: `2026-02-20`
- Decision: `Create Wave A contract/e2e target manifests plus verifier scripts before implementation slices`
- Rationale: ensures feature-wave progress can be measured with executable checks from the first code slice.

22. `D-022` Phase 4 first implementation sequencing
- Date: `2026-02-20`
- Decision: `Start Wave A implementation with wall read/feed endpoints (`T-0039`) before post/comment mutation endpoints`
- Rationale: feed-read surfaces are the highest-impact entry points and unblock subsequent post/comment flows.

23. `D-023` Wave A API scaffold structure
- Date: `2026-02-20`
- Decision: `Use a dedicated core social compatibility module with grouped controllers (Wall/Post/Comment/Notification/User) and a shared service for route markers`
- Rationale: keeps Wave A scaffolding cohesive and simplifies parity marker verification.

24. `D-024` Wave A verification split
- Date: `2026-02-20`
- Decision: `Add separate Wave A checks for scope (`contract:wave-a-scope`) and API scaffold markers (`contract:wave-a-api`)`
- Rationale: isolates documentation scope validation from implementation marker validation for clearer failures.

25. `D-025` Wave A mutation/interactions mapping completion
- Date: `2026-02-20`
- Decision: `Complete mapping and scaffold markers for wall mutation/membership and post interaction endpoints in the same Phase 4 batch`
- Rationale: closes the remaining unmapped Wave A social-core API rows and keeps feature-wave parity measurable.

26. `D-026` Phase 4 next-slice sequencing
- Date: `2026-02-20`
- Decision: `Queue realtime compatibility scaffolding (`T-0049`) immediately after Wave A mutation/interactions and target-pack expansion`
- Rationale: Wave A scope explicitly references legacy realtime dependencies that must be represented before gate closure.

27. `D-027` Wave A realtime contract representation
- Date: `2026-02-20`
- Decision: `Represent Wave A realtime parity as explicit markers in the social compatibility service plus a dedicated marker contract artifact`
- Rationale: keeps legacy `NotificationHub|PostNotifier|CommentNotifier` touchpoints traceable and testable before runtime wiring.

28. `D-028` Wave A realtime fixture validation policy
- Date: `2026-02-20`
- Decision: `Require fixture-id-to-marker-id parity checks for Wave A realtime payload fixtures`
- Rationale: ensures payload baselines stay synchronized with realtime compatibility ownership and marker definitions.

29. `D-029` Migration-prep dependency handling
- Date: `2026-02-20`
- Decision: `Introduce explicit staging-clone provisioning task (`T-0051`) before migration dry-run planning (`T-0005`)`
- Rationale: keeps autopilot actionable and ensures migration planning starts only after verified read-only staging access exists.

30. `D-030` Staging clone verification baseline
- Date: `2026-02-20`
- Decision: `Use local SQL Server container staging clone (`SimoonaStagingClone`) with read-only verification as the initial unblock baseline for migration planning`
- Rationale: provides immediate, reproducible access evidence so `T-0005` can proceed without waiting on external environment setup.

31. `D-031` First migration rehearsal scope baseline
- Date: `2026-02-20`
- Decision: `Use a bounded Dry-Run 001 scope (identity/org + Wave A social-core + notifications) with explicit invariants and rollback-safe requirements`
- Rationale: de-risks migration execution by validating integrity and rollback behavior on a constrained, high-value dataset before broader rehearsals.

32. `D-032` Phase 4 queue refill strategy after migration-plan detour
- Date: `2026-02-20`
- Decision: `Refill priority queue with a bounded Wave A runtime contract-hardening batch (`T-0052`..`T-0056`) before the next implementation slice`
- Rationale: restores autopilot continuity while improving Gate 4 signal quality beyond scaffold-presence checks.

33. `D-033` Wave A planned-response contract policy
- Date: `2026-02-20`
- Decision: `Introduce a dedicated planned-response contract and verifier command (`contract:wave-a-planned`) for social-core endpoint scaffold methods`
- Rationale: enforces deterministic `status`/`compatibility` output contracts until runtime adapters and real data mapping are introduced.

34. `D-034` Next Wave A implementation boundary
- Date: `2026-02-20`
- Decision: `Queue wall read adapter and DTO normalization scaffold (`T-0057`) as next READY P0 implementation objective`
- Rationale: read-path boundary extraction is the minimal safe step toward runtime parity without expanding scope into full data access.

35. `D-035` Wave A wall-read boundary pattern
- Date: `2026-02-20`
- Decision: `Route wall read methods through a dedicated adapter scaffold and normalize outputs through DTO boundary helpers`
- Rationale: establishes an incremental seam for future runtime data-mapping without breaking existing parity marker contracts.

36. `D-036` User-notification DTO normalization boundary
- Date: `2026-02-20`
- Decision: `Wrap User/Notifications read/write planned responses with explicit normalization helpers`
- Rationale: keeps notification settings response shaping centralized and prepares a safe insertion point for future runtime adapters.

37. `D-037` Wave A contract bundle checkpoint cadence
- Date: `2026-02-20`
- Decision: `Run full Wave A command bundle (`scope|api|planned|adapters|realtime|core|e2e|visual|shell|verify`) after each runtime slice checkpoint`
- Rationale: keeps Gate 4 evidence current and catches scaffold/contract drift early while implementation remains incremental.

38. `D-038` Post/comment adapter-boundary normalization policy
- Date: `2026-02-20`
- Decision: `Route Wave A post/comment scaffold methods through a shared social-operation adapter and DTO normalizer`
- Rationale: keeps method-level contract markers stable while introducing bounded runtime seams for subsequent data mapping.

39. `D-039` Adapter-boundary contract enforcement
- Date: `2026-02-20`
- Decision: `Add dedicated Wave A adapter-boundary verifier command (`contract:wave-a-adapters`) and include it in Gate 4 execution commands`
- Rationale: protects incremental refactors from bypassing adapter seams and preserves deterministic contract evidence.

40. `D-040` Gate 4 closure dependency escalation
- Date: `2026-02-20`
- Decision: `Treat runtime-backed API harness and changed-screen visual approvals as explicit blocking dependencies for Wave A gate closure`
- Rationale: current scaffold-level checks are green but insufficient to satisfy Gate 4 pass criteria for runtime parity and visual approvals.

41. `D-041` Wave A API runtime harness command contract
- Date: `2026-02-20`
- Decision: `Replace placeholder /app/api scripts with a local runtime harness (`start|build|lint|typecheck|test`) that exposes a deterministic process boundary and runs the full Wave A verification bundle in test mode`
- Rationale: turns Gate 4 API evidence from scaffold-only checks into runtime-backed execution while preserving no-secrets local macOS startup.

42. `D-042` Wave A changed-screen visual approval contract
- Date: `2026-02-20`
- Decision: `Track Wave A changed-screen visual approvals in a dedicated manifest with explicit UI-scope/e2e-target traceability and per-screen desktop/tablet/mobile approval status`
- Rationale: converts visual gate evidence from baseline scaffold-only checks into deterministic, reviewable changed-screen approval artifacts.

43. `D-043` Phase 4 closure and transition policy execution
- Date: `2026-02-20`
- Decision: `Close Gate 4 after T-0066 and T-0067 pass, then stop autopilot at phase boundary and queue Phase 5 integration tasks (T-0068..T-0070)`
- Rationale: enforces gate-first progression while preserving deterministic handoff into the next phase backlog.

44. `D-044` Phase 5 integration inventory baseline policy
- Date: `2026-02-20`
- Decision: `Require an explicit integration inventory and credential matrix (`ready|missing|blocked`) before executing any Gate 5 smoke and QA checkpoints`
- Rationale: creates deterministic ownership/readiness visibility for all gate-critical providers and prevents hidden credential assumptions.

45. `D-045` Integration smoke gating policy
- Date: `2026-02-20`
- Decision: `Adopt a dual-mode integration smoke contract where baseline mode reports blockers and strict mode hard-fails Gate 5 on missing gate-critical readiness`
- Rationale: enables safe continuous visibility during setup while preserving strict enforcement at gate checkpoints.

46. `D-046` Gate 5 checkpoint remediation sequence
- Date: `2026-02-20`
- Decision: `After Gate 5 QA NO-GO, queue remediation in fixed order: credential provisioning (T-0071) -> failure-path checks (T-0072) -> checkpoint re-run (T-0073)`
- Rationale: enforces dependency order so QA re-check occurs only when both readiness and failure-path evidence are available.

47. `D-047` Gate 3 and Gate 4 re-open policy for live web runtime
- Date: `2026-02-20`
- Decision: `Re-open Gate 3 and Gate 4 until a runnable web runtime exists and Wave A UI evidence is generated from live runtime execution rather than manifest-only checks`
- Rationale: prior closure criteria validated shell artifacts and metadata checks but did not prove a user-visible runnable modern web application.

48. `D-048` Gate 3/4 re-closure and Phase 5 resume policy
- Date: `2026-02-20`
- Decision: `After web runtime foundation, Wave A route runtime wiring, and runtime-smoke QA checks pass, re-close Gate 3 and Gate 4 and resume Phase 5 queue from T-0071`
- Rationale: restores phase order while preserving stronger runtime-based UI gate criteria for future closures.

49. `D-049` Phase 5 re-entry sequencing
- Date: `2026-02-20`
- Decision: `After T-0076 completion, restore priority queue to integration sequence T-0071 -> T-0072 -> T-0073 without additional Phase 3/4 detours`
- Rationale: keeps integration-critical execution focused now that live web runtime closure requirements are satisfied.
