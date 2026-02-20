# Orchestration Runbook

This runbook explains how to start, pause, and resume the modernization process with the skill team.

## 1) Start

Use this prompt:

```text
Use $simoona-modernization-orchestrator to start execution from the modernization plan, initialize orchestration files, and assign the highest-priority unblocked task with clear acceptance criteria.
```

For chained execution, use autopilot prompt:

```text
Use $simoona-modernization-orchestrator in autopilot mode to chain execution task-by-task: assign, run owner skill, run reviewer/qa gates when applicable, update orchestration files, and continue until a stop condition is hit.
```

Autopilot limiter:

- Default: `1` task per run.
- Override by adding a limit in prompt, for example:

```text
Use $simoona-modernization-orchestrator in autopilot mode with limit 3 tasks.
```

Expected flow after start:

1. `$full-stack-developer` implements task scope.
2. `$reviewer` returns `APPROVED` or `CHANGES_REQUESTED`.
3. If approved, `$qa` returns `GREEN`, `YELLOW`, or `RED`.
4. Merge only on QA `GREEN`.

Support roles as needed:

- `$parity-analyst` for parity matrix and gap tracking.
- `$data-migration-engineer` for migration dry-runs and integrity.
- `$platform-devops` for runtime/CI/CD/deploy readiness.

## 2) Pause (Stop Safely)

Use this prompt:

```text
Use $simoona-modernization-orchestrator to pause execution and update status.md with current phase, completed tasks, blocked tasks, open risks, and next 3 tasks to resume.
```

Before pausing, ensure:

- `status.md` reflects a `PAUSED` state.
- incomplete items remain in `backlog.md`.
- blockers and risk owners are recorded.

## 3) Resume

Use this prompt:

```text
Use $simoona-modernization-orchestrator to resume from current status.md and backlog.md, then assign the highest-priority unblocked task.
```

For chained resume, use:

```text
Use $simoona-modernization-orchestrator to resume in autopilot mode from status.md and backlog.md, continue chained execution, and stop only on defined stop conditions.
```

For explicit limit on resume:

```text
Use $simoona-modernization-orchestrator to resume in autopilot mode from current status.md and backlog.md with limit 2 tasks.
```

Resume checklist:

1. Read `status.md`.
2. Read `backlog.md`.
3. Confirm top blockers from `risks.md`.
4. Re-enter standard delivery flow.

## 4) Gate Rules

- Reviewer gate must be `APPROVED` before QA gate.
- QA gate must be `GREEN` before merge.
- If reviewer returns `CHANGES_REQUESTED`, return to `$full-stack-developer`.
- If QA returns `YELLOW` or `RED`, return to `$full-stack-developer` with QA feedback.

## 4.1) Autopilot Stop Conditions

- Reviewer remains `CHANGES_REQUESTED` after second implementation pass.
- QA returns `RED`.
- Blocking dependency/environment issue appears.
- High-severity risk has no mitigation owner.
- User-defined cycle limit reached.
- Default per-run task limit reached (`1`) or prompt-defined limit reached.
- Phase gate reached completion.

## 5) Daily Operating Prompts

Daily planning:

```text
Use $simoona-modernization-orchestrator to plan today’s top 3 tasks based on backlog priority, dependencies, and current risks.
```

Daily checkpoint:

```text
Use $simoona-modernization-orchestrator to produce a daily checkpoint: completed, in-progress, blocked, risk changes, and next 3 tasks.
```

Parity checkpoint:

```text
Use $parity-analyst to update parity coverage and report critical gaps that can block phase completion.
```

Migration readiness checkpoint:

```text
Use $data-migration-engineer to report migration readiness with dry-run summary, integrity checks, and rollback status.
```
