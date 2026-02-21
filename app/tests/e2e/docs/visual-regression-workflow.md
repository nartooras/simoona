# Visual Regression Workflow

Date: `2026-02-20`

## Scope

- Desktop wall/feed state
- Tablet wall/feed state
- Mobile wall/feed state

## Capture Workflow

1. Capture runtime behavior and screenshots:
   - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e runtime:wall-feed`
2. Verify scenario manifest and required screenshot artifacts:
   - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e visual:baseline`
3. Save artifacts under:
   - `visual/baselines/desktop`
   - `visual/baselines/tablet`
   - `visual/baselines/mobile`
4. Compare future captures against approved baseline screenshots.
## Notes

- Runtime capture includes behavior assertions (`Like` counter increment and `Reply` toggle) for the wall/feed route.
- Screenshots are generated from the live runtime process, not static placeholders.
