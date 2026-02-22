# Decisions

## 2026-02-22

1. `D-2026-02-22-001` Full parity requirement
- Decision: modernization cannot be declared complete until 100% legacy functionality parity is achieved.
- Rationale: user-defined acceptance criterion for release quality.

2. `D-2026-02-22-002` Terminology normalization
- Decision: modernization documentation uses `features` terminology instead of legacy gated-domain terminology.
- Rationale: domain scope is now treated as standard product feature parity.

3. `D-2026-02-22-003` Skills utilization protocol
- Decision: if a relevant skill exists or is explicitly requested, agents must load and follow its `SKILL.md` before planning or implementation.
- Rationale: improves consistency and gate discipline across implementation threads.

4. `D-2026-02-22-004` Reviewer/QA hard gate
- Decision: implementation is not complete until reviewer result is `APPROVED` and QA result is `GREEN`.
- Rationale: prevents self-certified completion without independent verification.

5. `D-2026-02-22-005` Production release freeze
- Decision: production publish remains frozen by default until parity gates are genuinely green and an explicit GO decision is recorded.
- Rationale: avoids premature release while parity is still incomplete.

6. `D-2026-02-22-006` Truth reset for orchestration docs
- Decision: orchestration control files are reset to a single current truth state; contradictory historical readiness claims are removed from active status artifacts.
- Rationale: status and risk signaling must be reliable for implementation planning.

7. `D-2026-02-22-007` Real auth priority
- Decision: auth/token/session behavior against existing SQL schema is prioritized before broader feature wave closure.
- Rationale: no parity claim is valid without real authentication and authorization behavior.

8. `D-2026-02-22-008` Code quality gate hardening
- Decision: marker-only lint/typecheck/test wrappers must be replaced by real quality checks where feasible.
- Rationale: contract markers alone are insufficient to guarantee maintainable implementation quality.

9. `D-2026-02-22-009` Shared runtime model extraction
- Decision: shared runtime seed data and path helpers are centralized in `app/web/src/runtime/runtime-shared.js` and reused by browser/runtime server code.
- Rationale: reduces web runtime drift and enables safer incremental decomposition of `main.tsx`.

10. `D-2026-02-22-010` Offline-safe validation fallback
- Decision: keep no-network syntax/contract validation paths as authoritative fallback when dependency reinstall is blocked in sandbox.
- Rationale: preserves deterministic validation progress under constrained environments while tracking install limitation explicitly.

11. `D-2026-02-22-011` Auth enforcement slice sequencing
- Decision: ship auth/token/session enforcement slice first (source + runtime check path), then close SQL-backed identity/session parity in a dedicated follow-up task.
- Rationale: enables immediate removal of placeholder behavior while preserving incremental and reviewable delivery.

12. `D-2026-02-22-012` Runtime auth lifecycle gate
- Decision: add a dedicated parity runtime check command (`pnpm --dir app/tests/parity runtime:api:auth`) for login/user-info/logout/revocation behavior.
- Rationale: core auth parity gate requires runtime behavior assertions beyond static contract markers.

13. `D-2026-02-22-013` SQL-backed compatibility auth store
- Decision: replace in-memory auth/session maps with SQL-backed compatibility tables (`node:sqlite`) for both API source auth store and runtime parity server.
- Rationale: satisfies SQL-backed identity/session enforcement goals without introducing new package dependencies in this recovery slice.

14. `D-2026-02-22-014` Strict legacy-header identity resolution
- Decision: unresolved `x-legacy-user-id` values must no longer grant authenticated fallback context.
- Rationale: synthetic identity fallback creates auth bypass risk and blocks reliable parity claims.

15. `D-2026-02-22-015` Web runtime decomposition boundary
- Decision: keep `main.tsx` as a runtime orchestrator and move styles, rendering, and interaction logic into dedicated runtime modules.
- Rationale: improves readability and supports parity-safe incremental extraction without changing route payload contracts.

16. `D-2026-02-22-016` Feature module extraction for runtime web slices
- Decision: split runtime render/interaction logic into domain feature modules under `app/web/src/features/**` while keeping orchestrators thin.
- Rationale: reduces monolith risk and makes parity behavior changes reviewable per domain.

17. `D-2026-02-22-017` Shared runtime payload normalization
- Decision: centralize client/runtime payload fallback behavior in `app/web/src/app/runtime-payload.js` and consume it from both `main.tsx` and `live-web-runtime.mjs`.
- Rationale: prevents route/payload drift between browser rendering and runtime server payload generation.
