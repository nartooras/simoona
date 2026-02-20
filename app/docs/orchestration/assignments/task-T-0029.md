# Task Assignment `T-0029`

- Date assigned: `2026-02-20`
- Owner role: `$web-parity-agent`
- Phase: `Phase 3 - UI Parity Foundation and Design Modernization`
- Priority: `P0`
- Status: `READY`

## Objective

Build the first shared UI primitives parity baseline that the shell can consume.

## Scope In

- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/**`
- `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/**`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/**`

## Scope Out

- Any changes under `/Users/arturasnikoncukas/code/repo/simoona/src/**`
- Any changes under `/Users/arturasnikoncukas/code/repo/simoona/build/**`
- Feature-wave business modules beyond shared shell/component baseline

## Acceptance Criteria

1. Initial shared primitives baseline exists in `/app/packages/ui` with explicit legacy behavior markers.
2. Web shell baseline references at least one shared primitive.
3. `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web shell:check` and core parity contract checks remain green.

## Validation Commands

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web shell:check
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:core
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app verify
```
