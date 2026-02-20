# Orchestration Runbook

This runbook explains how to start, pause, and resume the modernization process with the skill team.

## 1) Start

Use this prompt:

```text
Use $simoona-modernization-orchestrator to start execution from the modernization plan, initialize orchestration files, and assign the highest-priority unblocked task with clear acceptance criteria.
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
