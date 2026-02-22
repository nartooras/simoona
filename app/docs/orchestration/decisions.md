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
