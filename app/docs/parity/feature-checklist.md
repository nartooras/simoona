# Feature Checklist

Date initialized: `2026-02-20`
Last updated: `2026-02-22`
Owner role: `$parity-analyst`

## Artifacts

- API matrix: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
- UI matrix: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-route-matrix.csv`
- Gap report: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/parity-gap-report.md`

## Core Features

- [ ] Auth flows (`/token`, account registration/login/logout, external login handshake)
- [ ] Tenant/org resolution and organization switching behavior
- [ ] User/profile/general settings parity
- [ ] Wall/posts/comments parity including permissions and moderation actions
- [ ] Notification retrieval and read-state parity
- [ ] Error handling and HTTP error shape parity

## Admin Features

- [ ] Roles and permissions management parity
- [ ] User administration parity (legacy `ApplicationUser` endpoints and flows)
- [ ] Organization settings/configuration parity
- [ ] Classifier/configuration endpoints parity (job types, room types, floors, offices)
- [ ] Projects/certificates/skills administration parity
- [ ] Monitoring/admin operational endpoints parity

## Feature Domains (Previously Gated in Legacy Packaging)

- [ ] Events and event types parity
- [ ] Kudos and kudos basket parity
- [ ] Lotteries parity
- [ ] Vacations/vacation page parity
- [ ] Service requests parity
- [ ] Books/office map/organizational structure parity
- [ ] Committees parity
- [ ] Submit ticket parity

## Integration Features

- [ ] OAuth and external auth provider parity
- [ ] SMTP/email template delivery parity
- [ ] Storage/file/media URL behavior parity
- [ ] Background jobs and recurring task parity
- [ ] External jobs/callback behavior parity
- [ ] Localization parity (`lt_LT`, `en_US`)

## Gate Tracking

- [ ] API endpoint matrix is behavior-verified for full scope
- [ ] UI route matrix is behavior-verified for full scope
- [ ] Golden fixtures are populated and linked
- [ ] Reviewer + QA evidence exists for all completed waves

## Notes

- This checklist tracks true parity closure, not mapping-only progress.
- No changes are allowed under `src/**` or `build/**` for modernization threads unless explicitly requested.
