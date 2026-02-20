# Wave A Social Core Scope Pack

Date: `2026-02-20`
Phase: `Phase 4 - Feature Porting Waves`
Owner role: `$parity-analyst-agent`

## Inclusion Criteria

A route/endpoint is included in Wave A when at least one rule matches:

1. API controller is one of: `WallController`, `PostController`, `CommentController`, `NotificationController`.
2. API route is `User/Notifications` (notification settings/read model dependency for social flows).
3. UI route state or module file belongs to wall feed/wall management paths or notifications settings.
4. Legacy realtime dependency directly affects wall/post/comment/notification UX.

## Scope Artifacts

- API scope CSV: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-api-scope.csv`
- UI scope CSV: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/waves/wave-a-social-core-ui-scope.csv`
- Contract targets: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-contract-targets.json`
- Realtime marker contract: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-realtime-markers.json`
- E2E targets: `/Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e/wave-a/wave-a-e2e-targets.json`

Scope counts (excluding header):

- API endpoints: `29`
- UI routes/states: `9`

## Wave A Contract Target Baseline

Initial P0/P1 contract targets:

- `Wall/List`, `Wall/Details`, `Wall/Posts`, `Wall/AllPosts`
- `Wall/Create`, `Wall/Edit`, `Wall/Delete`, `Wall/Members`, `Wall/Follow`, `Wall/Search`
- `Post/Create`, `Post/Edit`, `Post/Delete`, `Post/GetPost`
- `Post/Hide`, `Post/Like`, `Post/Watch`, `Post/Unwatch`
- `Comment/Create`, `Comment/Edit`, `Comment/Delete`, `Comment/Hide`, `Comment/Like`
- `Notification/GetAll`, `Notification/MarkAsRead`, `Notification/MarkAllAsRead`
- `User/Notifications` (`GET` + `PUT`)

## Wave A E2E Target Baseline

Initial P0/P1 e2e targets:

- wall feed open (`/:organizationName/Wall/Feed?...`)
- create post flow (`/:organizationName/Wall/Feed?...`)
- comment flow (`/:organizationName/Wall/Feed?...`)
- wall members/search flows (`/:organizationName/Wall/Feed?wall|search`)
- post interaction flows (`/:organizationName/Wall/Feed?post`)
- notification popup mark-read flow
- notification settings toggle flow (`/:organizationName/Settings/Notifications`)

## Realtime Dependency References

Legacy realtime behavior dependencies that Wave A implementation must preserve:

- `/Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Common/Hubs/NotificationHub.cs`
- `/Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/BackgroundWorkers/PostNotifier.cs`
- `/Users/arturasnikoncukas/code/repo/simoona/src/api/Shrooms.Presentation.Api/BackgroundWorkers/CommentNotifier.cs`
- `/Users/arturasnikoncukas/code/repo/simoona/src/webapp/src/client/app/layout/navigation-bar/notifications/notifications.repository.js`
- `/Users/arturasnikoncukas/code/repo/simoona/src/webapp/src/client/app/layout/navigation-bar/notifications/popup/notification/notification.component.js`

## Realtime Compatibility Ownership

- Owner role: `$api-compat-agent`
- Marker contract artifact:
  - `/Users/arturasnikoncukas/code/repo/simoona/app/tests/parity/contracts/wave-a/wave-a-realtime-markers.json`
- Explicit scaffold touchpoints:
  - `NotificationHub` (`newNotification`, `newContent`)
  - `PostNotifier` (`NotifyAboutNewPostAsync`, `NotifyUpdatedPostMentionsAsync`)
  - `CommentNotifier` (`NotifyAboutNewCommentAsync`, `NotifyUpdatedCommentMentionsAsync`)

## Dependencies for First Implementation Slices

- Core compatibility baseline (`Gate 2`) status: `unblocked`
- UI shell parity baseline (`Gate 3`) status: `unblocked`
- Wave A scope pack status: `unblocked`
- Staging data-migration rehearsal (`T-0005`) status: `blocked` but not a blocker for first Wave A coding slices

## Validation Commands

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:wave-a-scope
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:targets
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/web shell:check
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/parity contract:core
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app verify
```
