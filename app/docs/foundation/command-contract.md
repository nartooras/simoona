# Foundation Command Contract

This document defines the initial Phase 1 command contract for the `/app` modernization workspace.

Run from repository root:

```bash
pnpm --dir app bootstrap
bash app/infra/ci/run-foundation-ci.sh
pnpm --dir app build
```

## Command Intent

- `bootstrap`
  - validates required Phase 1 directory and file skeleton under `/app`
  - validates baseline docs and docker/ci contracts are present
- `run-foundation-ci.sh`
  - runs `lint`, `typecheck`, `test`, and `smoke` as one CI-compatible sequence
- `build`
  - enforces foundation contract presence checks for build gate

## Notes

- These commands are intentionally minimal for the empty skeleton stage.
- Feature-level lint/typecheck/test/build commands will replace these placeholders as web/api apps are implemented.
