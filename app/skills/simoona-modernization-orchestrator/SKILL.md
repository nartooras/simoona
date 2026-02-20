---
name: simoona-modernization-orchestrator
description: Orchestrate phased modernization of Simoona from legacy `/src` and `/build` into `/app` with full functionality parity, strict HTTP API and UI behavior compatibility, and weekend cutover readiness. Use when coordinating multiple AI agents, assigning migration workstreams, enforcing phase gates, and tracking risks/evidence for go-live.
---

# Simoona Modernization Orchestrator

Coordinate the Simoona migration as a delivery manager and technical orchestrator.

## Load Inputs First

Read these files before planning or assigning work:

- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/ai-agents-modernization-plan.md`
- `/Users/arturasnikoncukas/code/repo/simoona/AGENT_QUICKSTART.md`
- `/Users/arturasnikoncukas/code/repo/simoona/AGENTS.md`

If any file is missing, stop and ask for it.

## Enforce Non-Negotiables

- Keep all legacy behavior and functionality.
- Keep `/Users/arturasnikoncukas/code/repo/simoona/src` and `/Users/arturasnikoncukas/code/repo/simoona/build` unchanged.
- Build all new work under `/Users/arturasnikoncukas/code/repo/simoona/app`.
- Preserve HTTP API contract compatibility and end-user UI behavior.
- Require parity evidence before phase completion.

## Create Orchestration Control Files

Maintain these files under `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration`:

- `backlog.md`: ordered tasks with owner role, phase, and dependencies.
- `status.md`: current sprint/phase progress and blockers.
- `risks.md`: active risks, severity, mitigation, owner.
- `decisions.md`: architecture and delivery decisions with date and rationale.
- `evidence.md`: links to tests, parity reports, screenshots, and migration rehearsals.

## Use This Agent Topology

Run with 2-3 implementation agents plus reviewer coverage:

- `api-compat-agent`: NestJS modules, SQL behavior parity, auth/permission parity.
- `web-parity-agent`: React route parity, UI behavior parity, subtle animation layer.
- `parity-analyst-agent`: parity matrix ownership and gap reporting via `$parity-analyst`.
- `data-migration-agent`: DB/file migration tooling and rehearsals via `$data-migration-engineer`.
- `platform-devops-agent`: runtime/CI/CD/deployment readiness via `$platform-devops`.
- `reviewer-agent`: implementation quality/scope/architecture review via `$reviewer`.
- `qa-parity-agent`: parity tests, visual diffs, release gates via `$qa`.

Use one branch objective per agent and keep changes small and reviewable.

## Orchestration Loop

Repeat this loop continuously:

1. Select next highest-value task from `backlog.md` with dependencies satisfied.
2. Assign one owner role and define exact acceptance criteria.
3. Generate a task prompt using `references/subagent-prompts.md`.
4. Require task output to include:
   - changed files
   - tests run and results
   - known risks
   - parity impact
5. Invoke `$reviewer` to return `APPROVED|CHANGES_REQUESTED`.
6. If `CHANGES_REQUESTED`, forward reviewer feedback to `$full-stack-developer`.
7. If `APPROVED`, invoke `$qa` to run gate checks and return `GREEN|YELLOW|RED`.
8. Merge only on `GREEN`; on `YELLOW|RED`, forward QA feedback to `$full-stack-developer`.
9. Update `status.md`, `risks.md`, `decisions.md`, and `evidence.md`.

## Assignment Rules

- Assign only one bounded objective per task.
- Include explicit in-scope and out-of-scope lists.
- Include exact commands for verification.
- Require rollback-safe behavior for migration and cutover tasks.
- Prefer contract-first implementation when touching API-facing behavior.
- Invoke `$full-stack-developer` for implementation tasks that require writing code.
- Invoke `$parity-analyst` to maintain parity matrices and gap reports.
- Invoke `$data-migration-engineer` for migration dry-runs and cutover readiness.
- Invoke `$platform-devops` for platform, CI/CD, and deployment readiness tasks.
- Invoke `$reviewer` for scope/architecture/best-practice review before QA.
- Invoke `$qa` for test execution and `GREEN|YELLOW|RED` gate decisions.

## Gate Enforcement

Do not mark a phase complete until all of the following are true:

- Gate checklist for that phase is fully satisfied.
- Required evidence artifacts are linked in `evidence.md`.
- No open P0/P1 issues for that phase scope.

Use `references/phase-gates.md` as the source of truth.

## Escalation and Risk Policy

Escalate immediately when any of these occur:

- parity gap that cannot be resolved with current assumptions
- migration duration exceeds weekend cutover budget
- critical integration cannot run with staging credentials
- unresolved schema or data mapping conflicts

For each escalation, record:

- observed issue
- impact
- mitigation options
- recommended option

## Reporting Format

For every orchestration cycle, output:

1. `Current phase`
2. `Assigned tasks`
3. `Completed tasks`
4. `Blocked tasks`
5. `Open risks`
6. `Next 3 tasks`
7. `Gate status`

Keep reporting concise and actionable.
