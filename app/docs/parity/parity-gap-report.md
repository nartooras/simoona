# Parity Gap Report

Date: `2026-02-22`

## 1) Coverage Summary

- API mapping: `190/190` mapped, parity verification in progress.
- UI mapping: `115/115` mapped, parity verification in progress.
- Note: mapped coverage is not treated as release-ready parity.

## 2) Critical Gaps (P0/P1)

1. `P0` SQL-backed authentication/authorization parity is incomplete (current runtime uses seeded in-memory auth/session store).
2. `P0` Legacy header compatibility fallback still permits synthetic authenticated identities for unresolved users.
3. `P0` Web runtime still relies on monolithic and partially static rendering patterns.
4. `P0` Integration feature parity remains incomplete (OAuth, SMTP, storage, callbacks, jobs).
5. `P1` Feature-domain parity (events, kudos, lotteries, vacations, service requests, books, projects, committees, office map, org structure, submit ticket, widgets) is not fully runtime-verified.

## 3) Medium/Low Gaps (P2/P3)

1. Local runtime evidence in sandbox can require unrestricted execution.
2. Legacy side-by-side visual references are incomplete for some domains.

## 4) Verification Blockers

- No policy blockers; implementation and evidence backlog remains.

## 5) Recommended Next Tasks

1. Complete `R2-AUTH-REAL-001B` by connecting auth/session behavior to SQL-backed identity state and removing unresolved synthetic-user fallback.
2. Complete `R3-WEB-REFACTOR-001B` web decomposition and runtime drift removal.
3. Execute feature-domain runtime evidence waves and promote parity only on reviewer/QA-green outcomes.
4. Keep production publish frozen until `R5` checklist closure.
