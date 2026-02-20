# E2E and Visual Baseline

Baseline verification for shell runtime and visual-regression capture readiness.

## Artifacts

- `visual/baseline-manifest.json`
  - viewport and scenario definition for desktop/tablet/mobile shell states
- `docs/visual-regression-workflow.md`
  - capture and storage workflow for baseline artifacts
- `scripts/verify-visual-baseline.mjs`
  - verification command for visual baseline manifest integrity
- `scripts/verify-runtime-smoke.mjs`
  - verification command for live runtime health and route response checks

## Validation

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e visual:baseline`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e runtime:smoke`
