# Release Readiness Checklist (R5)

Date: `2026-02-21`
Branch: `modernization`
Mode: `no-publish`

## Purpose

Define objective go/no-go criteria for production publish approval while publish commands remain deferred.

## Status

`COMPLETE_READY_FOR_PUBLISH_APPROVAL` - runtime parity gates are re-closed and release readiness is re-certified; publish stays blocked until explicit user approval.

## Parity Readiness

- [x] API parity matrix coverage is runtime-verified complete (`190/190` with live behavior evidence).
- [x] UI parity matrix coverage is runtime-verified complete (`115/115` with live behavior + visual evidence).
- [x] Offline-only verification is not used for final parity closure.
- [x] No open P0/P1 parity gaps are listed in `app/docs/parity/parity-gap-report.md`.

## Quality Gates

- [x] `pnpm --dir app lint`
- [x] `pnpm --dir app typecheck`
- [x] `pnpm --dir app test`
- [x] `pnpm --dir app smoke` (fallback allowed in sandbox where `127.0.0.1:5173` bind is blocked)
- [x] `pnpm --dir app build`
- [x] `pnpm --dir app verify`
- [x] `pnpm --dir app/api build`
- [x] `pnpm --dir app/api lint`
- [x] `pnpm --dir app/api typecheck`
- [x] `pnpm --dir app/api test`
- [x] `pnpm --dir app deploy:cloudflare:check`

## Deployment Artifact Readiness (No Publish)

- [x] Cloudflare Pages config exists (`app/infra/cloudflare/pages/wrangler.toml`).
- [x] Cloudflare Containers config exists (`app/infra/cloudflare/containers/wrangler.toml`).
- [x] Container adapter artifact exists (`app/infra/cloudflare/containers/worker.ts`).
- [x] API container contract file exists (`app/infra/cloudflare/containers/Dockerfile.api`).
- [x] Deployment artifact contract is executable (`app/infra/scripts/verify-cloudflare-deploy-contract.mjs`).

## Risk Review

- [x] `RISK-R4-CONTAINERS-BETA` acknowledged with rollback mitigation requirement.
- [x] `RISK-RUNTIME-PORT-SANDBOX` acknowledged for unrestricted runtime verification execution.
- [x] `RISK-R4-PUBLISH-DEFERRED` acknowledged as intentional until explicit approval.

## Go/No-Go Rule

- `GO_READY_FOR_APPROVAL` when all checks above are green and no new P0/P1 issues appear.
- `NO_GO` if any required gate check fails or a new P0/P1 issue opens.

## Current Decision

- Decision: `GO_READY_FOR_APPROVAL` (all non-publish readiness gates green; wait for explicit publish approval).
