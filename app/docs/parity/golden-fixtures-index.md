# Golden Fixtures Index

Date initialized: `2026-02-20`
Phase: `Phase 0 - Parity Baseline and Inventory`
Owner role: `$parity-analyst`

This index tracks critical API and UI baseline fixtures captured from legacy behavior.

## auth

- Fixture ID: `auth-account-userinfo-success`
  - Legacy API: `GET Account/UserInfo` (`AccountController.GetUserInfo`)
  - Legacy UI route/state: `Root.WithOrg.Home`
  - Expected behavior: returns authenticated user payload with organization context and legacy error shape when unauthenticated.
  - Capture method: legacy runtime HTTP capture (authenticated + unauthenticated pair).
  - Artifact path: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/auth/account-userinfo-success.json`

- Fixture ID: `auth-account-register-validation`
  - Legacy API: `ANY Account/Register` (`AccountController.RegisterUser`)
  - Expected behavior: validation and conflict responses preserve legacy status and payload shape.
  - Capture method: request/response capture with invalid and duplicate registration payloads.
  - Artifact path: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/auth/account-register-validation.json`

## wall

- Fixture ID: `wall-list-details`
  - Legacy API: `GET Wall/List`, `GET Wall/Details`
  - Legacy UI route/state: `Root.WithOrg.Client.Wall`
  - Expected behavior: wall listing and details include permission-dependent visibility and paging semantics.
  - Capture method: legacy runtime HTTP capture + UI route traversal snapshot.
  - Artifact path: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/wall/wall-list-details.json`

- Fixture ID: `wall-post-create-comment-like`
  - Legacy API: `POST Post/Create`, `POST Comment/Create`, `PUT Post/Like`
  - Expected behavior: write actions preserve permission checks and response/error shapes.
  - Capture method: scripted sequence capture against seeded tenant data.
  - Artifact path: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/wall/post-comment-like-sequence.json`

## profile

- Fixture ID: `profile-details-and-edit`
  - Legacy API: `GET ApplicationUser/GetUserProfile/{id}`, `PUT ApplicationUser/PutPersonalInfo`
  - Legacy UI route/state: `Root.WithOrg.Client.Profiles.Details`, `Root.WithOrg.Client.Profiles.Edit`
  - Expected behavior: profile detail/edit tabs and payload validation match legacy behavior.
  - Capture method: UI flow capture and corresponding API trace export.
  - Artifact path: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/profile/profile-details-edit.json`

## admin

- Fixture ID: `admin-roles-paged-and-update`
  - Legacy API: `GET Role/GetPaged`, `Route("Put")` on `RolesController`
  - Legacy UI route/state: `Root.WithOrg.Admin.Roles.List`, `Root.WithOrg.Admin.Roles.Edit`
  - Expected behavior: role listing paging/filtering and update permissions preserve legacy semantics.
  - Capture method: admin-user API capture with role modification scenario.
  - Artifact path: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/admin/roles-paged-update.json`

- Fixture ID: `admin-application-users-list`
  - Legacy API: `GET ApplicationUser/GetPaged`
  - Legacy UI route/state: `Root.WithOrg.Admin.ApplicationUsers`
  - Expected behavior: filtering and sorting query contract (`roomId`, `sort`, `dir`, `page`, `s`, `filter`) remains compatible.
  - Capture method: UI query-variant capture across multiple filter combinations.
  - Artifact path: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/admin/application-users-list.json`

## premium

- Fixture ID: `premium-events-list-join`
  - Legacy API: `GET Events/`, `POST Events/Join` (`EventController`)
  - Legacy UI route/state: `Root.WithOrg.Client.Events.List`, `Root.WithOrg.Client.Events.Join`
  - Expected behavior: event list and join flow keep legacy validation, attendance semantics, and permission checks.
  - Capture method: premium-enabled tenant API and UI flow capture.
  - Artifact path: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/premium/events-list-join.json`

- Fixture ID: `premium-lottery-paged-enter`
  - Legacy API: `GET Lottery/Paged`, `POST Lottery/Enter`
  - Legacy UI route/state: `Root.WithOrg.Admin.Lotteries.List`
  - Expected behavior: lottery listing and participation preserve status transitions and permission boundaries.
  - Capture method: admin + participant scenario capture.
  - Artifact path: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/fixtures/premium/lottery-paged-enter.json`

## Notes

- Fixture artifact files are indexed placeholders and must be populated by capture runs.
- This index satisfies Gate 0 fixture linkage requirements; fixture content quality is validated in later parity QA gates.
