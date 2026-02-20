# Feature Checklist Baseline

Date initialized: `2026-02-20`
Phase: `Phase 0 - Parity Baseline and Inventory`
Owner role: `$parity-analyst`

## Artifacts

- API matrix: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/api-endpoint-matrix.csv`
- UI matrix: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/ui-route-matrix.csv`

## Core

- [ ] Auth flows (`/token`, account registration/login/logout, external login handshake)
- [ ] Tenant/org resolution and organization switching behavior
- [ ] User/profile/general settings parity
- [ ] Wall/posts/comments parity including permissions and moderation actions
- [ ] Notification retrieval and read-state parity
- [ ] Error handling and HTTP error shape parity

## Admin

- [ ] Roles and permissions management parity
- [ ] User administration parity (legacy `ApplicationUser` endpoints and flows)
- [ ] Organization settings/configuration parity
- [ ] Classifier/configuration endpoints parity (job types, room types, floors, offices)
- [ ] Projects/certificates/skills administration parity
- [ ] Monitoring/admin operational endpoints parity

## Premium

- [ ] Events and event types parity
- [ ] Kudos and kudos basket parity
- [ ] Lotteries parity
- [ ] Vacations/vacation page parity
- [ ] Service requests parity
- [ ] Books/office map/organizational structure parity

## Integration

- [ ] OAuth and external auth provider parity
  - status: `mapped`
  - owner: `$api-compat-agent`
  - evidence: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/integration-inventory-matrix.md`
- [ ] SMTP/email template delivery parity
  - status: `mapped`
  - owner: `$platform-devops-agent` + `$api-compat-agent`
  - evidence: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/integration-inventory-matrix.md`
- [ ] Storage/file/media URL behavior parity
  - status: `mapped`
  - owner: `$api-compat-agent`
  - evidence: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/integration-inventory-matrix.md`
- [ ] Background jobs and recurring task parity
  - status: `mapped`
  - owner: `$platform-devops-agent`
  - evidence: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/integration-inventory-matrix.md`
- [ ] External jobs/callback behavior parity
  - status: `mapped`
  - owner: `$platform-devops-agent` + `$api-compat-agent`
  - evidence: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/integration-inventory-matrix.md`
- [ ] Localization parity (`lt_LT`, `en_US`)
  - status: `mapped`
  - owner: `$web-parity-agent` + `$api-compat-agent`
  - evidence: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/parity/integration-inventory-matrix.md`

## Gate 0 Tracking

- API endpoint matrix created: `YES`
- UI route matrix created: `YES`
- Critical-flow golden fixtures linked: `NO` (pending)
- Gate 0 status: `IN_PROGRESS`

## Notes

- This checklist is a baseline and must be updated as parity gaps are identified from matrix analysis.
- No changes were made under `/Users/arturasnikoncukas/code/repo/simoona/src` or `/Users/arturasnikoncukas/code/repo/simoona/build`.
