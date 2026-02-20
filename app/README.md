# App Skills Runbook

This folder contains the modernization plan and the skill set used by the AI agent team.

## Scope Rules

- Build new solution work only under `/Users/arturasnikoncukas/code/repo/simoona/app`.
- Treat `/Users/arturasnikoncukas/code/repo/simoona/src` and `/Users/arturasnikoncukas/code/repo/simoona/build` as legacy reference only.
- Keep functionality and behavior parity with the legacy app.

## Source Documents

- Plan: `/Users/arturasnikoncukas/code/repo/simoona/app/docs/ai-agents-modernization-plan.md`
- Quick project map: `/Users/arturasnikoncukas/code/repo/simoona/AGENT_QUICKSTART.md`
- Repo guardrails: `/Users/arturasnikoncukas/code/repo/simoona/AGENTS.md`

## Skills Available

- Orchestrator: `$simoona-modernization-orchestrator`
- Implementation: `$full-stack-developer`
- Code review: `$reviewer`
- QA gate: `$qa`
- Parity analysis: `$parity-analyst`
- Data migration: `$data-migration-engineer`
- Platform/CI/CD: `$platform-devops`

Skill definitions are under:
- `/Users/arturasnikoncukas/code/repo/simoona/app/skills`

## Recommended Workflow

1. Orchestrate work items and acceptance criteria with `$simoona-modernization-orchestrator`.
2. Implement task scope with `$full-stack-developer`.
3. Review implementation quality and scope with `$reviewer`.
4. Run tests and gate decision with `$qa`.
5. Track parity coverage and gaps with `$parity-analyst`.
6. Run migration dry-runs and integrity checks with `$data-migration-engineer`.
7. Maintain platform/CI/CD/deploy readiness with `$platform-devops`.

Execution styles:

- `Manual`: orchestrator assigns one task per cycle.
- `Autopilot`: orchestrator chains task execution automatically until a stop condition.
  - Default limit: `1` task per run.
  - Optional override: specify `limit N` in the prompt.

## Gate Logic

- Reviewer must return `APPROVED` before QA gate.
- QA returns `GREEN`, `YELLOW`, or `RED`.
- Merge only on QA `GREEN`.
- For `CHANGES_REQUESTED`, `YELLOW`, or `RED`, return feedback to `$full-stack-developer`.

## Example Invocation Prompts

- `Use $simoona-modernization-orchestrator to assign the next phase task with acceptance criteria.`
- `Use $simoona-modernization-orchestrator in autopilot mode to chain execution across tasks until a stop condition is hit.`
- `Use $simoona-modernization-orchestrator in autopilot mode with limit 3 tasks.`
- `Use $full-stack-developer to implement this scoped task under /app with tests and parity notes.`
- `Use $reviewer to verify scope compliance, architecture alignment, and over-engineering risks.`
- `Use $qa to run required checks and return GREEN/YELLOW/RED with actionable feedback.`
- `Use $parity-analyst to update parity matrices and report current gaps.`
- `Use $data-migration-engineer to run migration dry-runs and produce readiness status.`
- `Use $platform-devops to validate local runtime, CI/CD, and deployment readiness.`
