# Wave A Visual Approval Pack

Date: `2026-02-20`
Phase: `Phase 4 - Feature Porting Waves`
Owner role: `$web-parity-agent`

## Objective

Provide explicit changed-screen visual approvals for Wave A with route-level traceability and desktop/tablet/mobile status per screen.

## Artifacts

- Changed-screen approval manifest:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/visual/wave-a-changed-screen-approvals.json`
- Traceability sources:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-ui-scope.csv`
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/wave-a/wave-a-e2e-targets.json`
- Verification command:
  - `pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:visual-approvals`

## Changed Screens Summary

- `wave-a-wall-feed` (`/:organizationName/Wall/Feed?wall/?search/?post`)
- `wave-a-wall-members` (`/:organizationName/Wall/Members?wall`)
- `wave-a-wall-search` (`/:organizationName/Wall/Feed?search`)
- `wave-a-notification-popup` (`/:organizationName/Wall`)
- `wave-a-notification-settings` (`/:organizationName/Settings/Notifications`)

Approval status: all listed screens are `approved` for `desktop`, `tablet`, and `mobile`.

## Notes

- Any future unresolved diff must use `approvalStatus=diff_tracked` with `issueRef` in the changed-screen manifest.
- This pack is scoped to Wave A changed screens only.
