# Simoona Modernization Plan (Reset Baseline)

Date: `2026-02-20`

## Objective

Deliver a production-ready modernization in `/app` with strict API and UI parity against legacy `/src` behavior, no schema/data migrations in this phase, and Cloudflare deployment readiness.

## Constraints

1. Work only on branch `modernization`.
2. Keep `/src` and `/build` unchanged.
3. Preserve legacy HTTP contracts and user-visible route behavior.
4. Do not execute data migrations in this phase.

## Gate Model

1. `R0`: Cleanup reset and orchestration baseline.
2. `R1`: Production architecture baseline.
3. `R2`: API `190/190` parity implementation and verification.
4. `R3`: UI `115/115` parity implementation and verification.
5. `R4`: Cloudflare deployment (Pages + Containers, no migration).
6. `R5`: Final readiness, canary, rollback rehearsal, go-live gate.

## Deployment Target

- Web: Cloudflare Pages
- API: Cloudflare Containers
- Data: existing SQL Server schema as-is (no migration in this plan stage)

