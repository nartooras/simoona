---
name: simoona-modernization-orchestrator
description: Orchestrate phased modernization of Simoona from legacy `/src` and `/build` into `/app` with full functionality parity, strict HTTP API and UI behavior compatibility, and weekend cutover readiness. Use when coordinating multiple AI agents, assigning migration workstreams, enforcing phase gates, and tracking risks/evidence for go-live.
---

# Simoona Modernization Orchestrator

Coordinate the Simoona migration as a delivery manager and technical orchestrator.

## Recommended Model and Reasoning

- Model: `GPT-5`
- Reasoning: `High`

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

## Execution Modes

Support two modes:

- `manual`: assign only, then wait for user-triggered next cycle.
- `autopilot`: execute chained cycles automatically.

When prompt includes words like `autopilot`, `chain`, or `continue automatically`, use `autopilot`.
Default to `manual` when mode is not specified.

## Autopilot Task Limit

Apply a per-run task limit in autopilot mode:

- Default limit: `1` task.
- If prompt includes a limit (for example `limit 3` or `max 3 tasks`), use that value.
- Count a task as completed when it reaches terminal status for the cycle (`done`, `blocked`, or `returned for fixes`).
- Stop autopilot when the limit is reached, then emit checkpoint summary.

## Autopilot Chain Behavior

In `autopilot`, run this sequence repeatedly:

1. Select highest-priority unblocked task.
2. Dispatch owner skill and collect output.
3. If task is implementation-related, run `$reviewer`, then `$qa` on approval.
4. Apply feedback loops to `$full-stack-developer` until reviewer/QA pass or stop condition hits.
5. Update orchestration files after each cycle.
6. Continue to next unblocked task.

## Autopilot Stop Conditions

Stop autopilot immediately when any condition is true:

- reviewer returns `CHANGES_REQUESTED` and a second pass still fails
- QA returns `RED`
- any blocking dependency or environment issue appears
- any high-severity risk is opened without mitigation owner
- user-defined task or cycle limit is reached
- per-run autopilot task limit is reached
- current phase gate is complete

When stopping, emit a checkpoint with:

- reason for stop
- current phase status
- completed tasks
- blocked tasks
- next 3 tasks to resume

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
