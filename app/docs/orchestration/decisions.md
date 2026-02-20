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
