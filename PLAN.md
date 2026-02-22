# 100% Legacy Parity Recovery Plan + Full Markdown Synchronization

## Brief Summary
1. Target is strict: modern app reaches 100% legacy functionality parity before production unfreeze.
2. Scope includes all feature domains, including those previously labeled `premium`; terminology becomes `features`.
3. Documentation is a first-class deliverable: all markdown in chosen scope is updated and internally consistent.
4. `AGENTS.md` is upgraded to explicitly require skill usage and enforce reviewer/QA gating.

## Scope Lock
1. Markdown scope for synchronization: all root + modernization markdown files (58 files), excluding `src/**` and `build/**` docs per your decision.
2. Code scope remains modernization-only under `/Users/arturasnikoncukas/code/repo/simoona/app/**` plus root governance docs.
3. Legacy runtime code under `/Users/arturasnikoncukas/code/repo/simoona/src/**` and `/Users/arturasnikoncukas/code/repo/simoona/build/**` remains unchanged.

## Workstream 1: Governance Reset (Docs First, Week 0)
1. Update `/Users/arturasnikoncukas/code/repo/simoona/AGENTS.md` to add a mandatory `Skills Utilization Protocol` section:
`If a relevant skill exists or is explicitly requested, agent must load and follow that SKILL.md before planning or implementation.`
`Implementation completion requires reviewer APPROVED and QA GREEN.`
`Handoff must list skills used, decisions made, commands run, and evidence links.`
`If a required skill is missing/unreadable, agent must report and use documented fallback.`
2. Update `/Users/arturasnikoncukas/code/repo/simoona/AGENT_QUICKSTART.md` to remove branch-policy conflict and align to `modernization` branch only for this repo.
3. Update `/Users/arturasnikoncukas/code/repo/simoona/README.md` and `/Users/arturasnikoncukas/code/repo/simoona/LocalSetup.md` with current modernization truth and parity policy.

## Workstream 2: Full Markdown Sync (58 Files, Week 0-1)
1. Audit and update all in-scope markdown files:
`/Users/arturasnikoncukas/code/repo/simoona/AGENTS.md`
`/Users/arturasnikoncukas/code/repo/simoona/AGENT_QUICKSTART.md`
`/Users/arturasnikoncukas/code/repo/simoona/README.md`
`/Users/arturasnikoncukas/code/repo/simoona/LocalSetup.md`
All markdown under `/Users/arturasnikoncukas/code/repo/simoona/app/docs/**`
All markdown under `/Users/arturasnikoncukas/code/repo/simoona/app/infra/**`
All markdown under `/Users/arturasnikoncukas/code/repo/simoona/app/packages/**`
All markdown under `/Users/arturasnikoncukas/code/repo/simoona/app/skills/**`
All markdown under `/Users/arturasnikoncukas/code/repo/simoona/app/tests/**`
`/Users/arturasnikoncukas/code/repo/simoona/app/api/README.md`
`/Users/arturasnikoncukas/code/repo/simoona/app/web/README.md`
2. Terminology migration:
Replace `Premium` section labels with `Features`.
Replace `premium` fixture/domain labels with `features` in modernization docs.
Keep literal legacy assembly/project names only when required, annotated as `legacy project name`.
3. Consistency fixes:
Remove contradictory readiness claims.
Align `status.md`, `backlog.md`, `risks.md`, `decisions.md`, `evidence.md`, `release-readiness-checklist.md`, and `final-verification-report.md` to one truth state.
4. Add `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/doc-sync-manifest.md` with 58/58 file audit entries and disposition (`updated` or `no-change + reason`).

## Workstream 3: Real Engineering Baseline (Week 1-2)
1. Replace marker-only gates with real quality gates for web/api lint/typecheck/test.
2. Frontend restructure from monolith to feature modules; decompose `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/main.tsx`.
3. Remove duplicated runtime logic drift between `/Users/arturasnikoncukas/code/repo/simoona/app/web/src/main.tsx` and `/Users/arturasnikoncukas/code/repo/simoona/app/web/scripts/live-web-runtime.mjs`.

## Workstream 4: Real Auth and Permission Enforcement (Week 2-3)
1. Implement real modern auth using existing SQL schema.
2. Enforce token/session checks for protected routes and APIs.
3. Replace permissive guards and compatibility stubs with actual authorization behavior.
4. Keep external-provider advanced parity as a tracked feature wave item, not a hidden deferment.

## Workstream 5: 100% Feature Parity Waves (Week 3-8)
1. Wave A: Wall Feed + Employee List full parity.
2. Wave B: Profile + Settings + Auth Utility full parity.
3. Wave C: Admin + Reference/Configuration full parity.
4. Wave D: All feature domains formerly tagged `premium`:
Events, Kudos, Lotteries, Vacations, Service Requests, Books, Projects, Committees, Office Map, Organizational Structure, Submit Ticket, related widgets.
5. Wave E: Integration parity:
OAuth/external auth, SMTP/email templates, storage/media URLs, external jobs/callbacks, localization, background jobs.
6. No domain marked complete until runtime behavior and data correctness are verified.

## Workstream 6: Reviewer + QA Enforcement (Continuous)
1. Every implementation task must produce reviewer report in `/Users/arturasnikoncukas/code/repo/simoona/app/docs/reviews/`.
2. Reviewer must return `APPROVED` before QA.
3. QA report goes to `/Users/arturasnikoncukas/code/repo/simoona/app/docs/qa/` and must return `GREEN` before merge.
4. Orchestration docs are updated in the same change-set as status transitions.

## Workstream 7: Release Re-enable (Week 9-10)
1. Keep production publish frozen until all parity gates are truly green.
2. Run full validation pack from `/Users/arturasnikoncukas/code/repo/simoona/AGENTS.md`.
3. Run full runtime parity against staging candidate and capture artifacts.
4. Execute rollback rehearsal and record timing/evidence.
5. Unfreeze production only after final GO decision.

## Public API / Interface / Type Changes
1. Expand and harden auth/session/error contracts in:
`/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/auth.ts`
`/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/auth-claims.ts`
`/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/permissions.ts`
`/Users/arturasnikoncukas/code/repo/simoona/app/packages/contracts/error-envelope.ts`
2. Update parity matrices to map real components and real endpoint behavior, not catchup placeholders.
3. Rename modernization domain labels and fixture references from `premium` to `features`.

## Test Cases and Scenarios
1. Auth lifecycle tests: login, token issue, invalid credential rejection, logout, protected-route redirects.
2. Permission matrix tests: allowed/denied behavior across role-sensitive endpoints and UI routes.
3. Full domain behavior tests for all feature families (including all former premium-labeled areas).
4. Integration failure-path tests: timeout/auth failures for OAuth/SMTP/storage/external jobs.
5. UI runtime tests must assert behavior, not only rendering or payload marker presence.
6. Documentation integrity checks:
No stale `premium` terminology in modernization docs.
No branch-policy conflicts.
No contradictory gate states across orchestration docs.
Doc manifest shows 58/58 audited.

## Explicit Assumptions and Defaults
1. Branch remains `/Users/arturasnikoncukas/code/repo/simoona` on `modernization`.
2. Legacy code under `/Users/arturasnikoncukas/code/repo/simoona/src/**` and `/Users/arturasnikoncukas/code/repo/simoona/build/**` is not modified.
3. Existing SQL schema is the initial auth/data parity source.
4. Production release stays frozen until 100% parity evidence and gate approvals are complete.
