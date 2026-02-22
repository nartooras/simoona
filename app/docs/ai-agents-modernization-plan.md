# Simoona Modernization Plan (Full Parity Recovery Baseline)

Date: `2026-02-22`

## Objective

Deliver a production-ready modernization in `app/**` with strict API/UI parity against legacy `src/**` behavior.

Hard requirement:
- 100% feature and functionality parity before production release unfreeze.

## Constraints

1. Work only on branch `modernization`.
2. Keep `src/**` and `build/**` unchanged unless explicitly requested.
3. Preserve legacy HTTP contracts and user-visible route behavior.
4. Existing SQL schema is the initial auth/data source for modern parity delivery.
5. Use `features` terminology for modernization domains and avoid legacy gated-domain naming unless referencing literal legacy project names.

## Gate Model

1. `R0`: Governance and documentation synchronization.
2. `R1`: Engineering baseline hardening (real quality gates).
3. `R2`: Real auth/permission enforcement and API parity implementation.
4. `R3`: UI parity implementation with real runtime behavior.
5. `R4`: Integration parity and rollback readiness.
6. `R5`: Final release readiness and production unfreeze decision.

## Required Gate Discipline

A gate can close only when:

1. Reviewer decision is `APPROVED`.
2. QA decision is `GREEN`.
3. Runtime parity evidence exists for scope.
4. No open P0/P1 issues remain in scope.

## Deployment Target

- Web: Cloudflare Pages
- API: Cloudflare Workers/Containers path currently used in `app/infra/cloudflare`
- Production publish: blocked by default until `R5` closure criteria are satisfied.
