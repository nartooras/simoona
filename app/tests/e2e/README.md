# E2E and Visual Baseline Scaffold

Phase 3 baseline for shell visual-regression capture readiness.

## Artifacts

- `visual/baseline-manifest.json`
  - viewport and scenario definition for desktop/tablet/mobile shell states
- `docs/visual-regression-workflow.md`
  - capture and storage workflow for baseline artifacts
- `scripts/verify-visual-baseline.mjs`
  - verification command for placeholder baseline scaffold
- `wave-a/wave-a-e2e-targets.json`
  - Wave A social-core e2e target baseline manifest (feed, wall members/search, post interactions, notifications)
- `scripts/verify-wave-a-e2e-targets.mjs`
  - verification command for Wave A route target completeness
- `visual/wave-a-changed-screen-approvals.json`
  - Wave A changed-screen manifest with route traceability and desktop/tablet/mobile approval status per screen
- `scripts/verify-wave-a-visual-approvals.mjs`
  - verification command for changed-screen coverage and visual approval status integrity

## Validation

- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e visual:baseline`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:targets`
- `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:visual-approvals`
