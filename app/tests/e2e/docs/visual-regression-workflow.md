# Visual Regression Workflow (Phase 3 Baseline)

Date: `2026-02-20`

## Scope

- Desktop shell login state
- Tablet shell home state
- Mobile shell home state

## Capture Workflow

1. Run baseline verification command:
   - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e visual:baseline`
2. Capture snapshots for each scenario in `visual/baseline-manifest.json`.
3. Save artifacts under:
   - `visual/baselines/desktop`
   - `visual/baselines/tablet`
   - `visual/baselines/mobile`
4. Compare future captures against approved baseline snapshots.

## Notes

- This scaffold verifies structure and artifact paths first.
- Actual image capture wiring is queued for post-baseline tooling tasks in Phase 3.
