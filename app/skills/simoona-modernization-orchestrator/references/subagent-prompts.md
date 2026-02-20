# Sub-Agent Prompt Templates

Use these templates for consistent task dispatch.

## API Compatibility Agent

```text
Role: api-compat-agent
Objective: <single objective>
Phase: <phase id>
Scope in: <explicit files/modules>
Scope out: <explicit exclusions>
Constraints:
- Do not modify /src or /build.
- Keep HTTP contract and behavior parity.
- Work only under /app.
Acceptance:
- <testable acceptance criteria>
Validation commands:
- <exact commands>
Output format:
1) Summary
2) Changed files
3) Tests run + pass/fail
4) Parity impact
5) Risks/follow-ups
```

## Web Parity Agent

```text
Role: web-parity-agent
Objective: <single objective>
Phase: <phase id>
Scope in: <routes/components>
Scope out: <explicit exclusions>
Constraints:
- Preserve legacy UX behavior and information architecture.
- Apply only subtle animations (easy on eyes, reduced-motion support).
- Do not modify /src or /build.
Acceptance:
- <testable acceptance criteria>
Validation commands:
- <exact commands>
Output format:
1) Summary
2) Changed files
3) UI parity checks
4) Visual diff notes
5) Risks/follow-ups
```

## Parity Analyst Agent

```text
Role: parity-analyst-agent
Skill: use $parity-analyst
Objective: <single objective>
Phase: <phase id>
Scope in: <legacy areas and app targets>
Scope out: <explicit exclusions>
Constraints:
- Keep parity artifacts current under /app/docs/parity.
- Report gaps explicitly with severity and owner.
- Do not modify /src or /build.
Acceptance:
- Updated parity matrices/checklists with coverage deltas.
Validation commands:
- <inventory and verification commands>
Output format:
1) Coverage summary
2) Updated artifacts
3) Gap list by severity
4) Recommended next tasks
5) Risks/blockers
```

## Data Migration Agent

```text
Role: data-migration-agent
Skill: use $data-migration-engineer
Objective: <single objective>
Phase: <phase id>
Scope in: <scripts/tools/checks>
Scope out: <explicit exclusions>
Constraints:
- Idempotent migrations only.
- Preserve data semantics and referential integrity.
- Include rollback path.
Acceptance:
- <testable acceptance criteria>
Validation commands:
- <exact commands>
Output format:
1) Summary
2) Changed files
3) Dry-run results
4) Integrity check results
5) Risks/follow-ups
```

## Platform DevOps Agent

```text
Role: platform-devops-agent
Skill: use $platform-devops
Objective: <single objective>
Phase: <phase id>
Scope in: <platform files/pipelines/runtime components>
Scope out: <explicit exclusions>
Constraints:
- Keep changes under /app only.
- Preserve reproducible local runtime on macOS M3.
- Do not commit secrets.
Acceptance:
- Platform status READY with validation evidence.
Validation commands:
- <exact platform/ci/runtime commands>
Output format:
1) Platform status (READY|NOT_READY)
2) Changed files
3) Validation results
4) Deployment/runtime impact
5) Risks and follow-ups
```

## Reviewer Agent

```text
Role: reviewer-agent
Skill: use $reviewer
Objective: <single objective>
Phase: <phase id>
Scope in: <changed modules/files>
Scope out: <explicit exclusions>
Constraints:
- Validate scope, architecture, and best practices.
- Reject over-engineering and unrelated refactors.
- Do not block on style-only nits.
Acceptance:
- Return APPROVED or CHANGES_REQUESTED with evidence.
Validation commands:
- <exact commands or static review focus>
Output format:
1) Decision (APPROVED|CHANGES_REQUESTED)
2) Findings by severity
3) Scope/architecture compliance
4) Required fixes (if any)
5) Recommendation to orchestrator
```

## QA and Parity Agent

```text
Role: qa-parity-agent
Skill: use $qa
Objective: <single objective>
Phase: <phase id>
Scope in: <test packs/matrices>
Scope out: <explicit exclusions>
Constraints:
- Verify behavior parity against golden baseline.
- Report only reproducible findings with evidence.
Acceptance:
- <testable acceptance criteria>
Validation commands:
- <exact commands>
Output format:
1) Findings by severity
2) Repro steps
3) Expected vs actual
4) Evidence links
5) Gate recommendation (GO/NO-GO)
```
