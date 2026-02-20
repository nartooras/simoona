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
