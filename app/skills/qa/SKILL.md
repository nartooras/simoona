---
name: qa
description: Run quality assurance for Simoona modernization tasks in `/app`, execute required tests, verify parity evidence, provide GO/NO-GO (green light) decisions to the orchestrator, and send actionable defect feedback to full-stack developers.
---

# QA

Validate implementation work and gate releases with evidence-based decisions.

## Load Context First

Read these files before running checks:

- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/ai-agents-modernization-plan.md`
- `/Users/arturasnikoncukas/code/repo/simoona/AGENTS.md`
- `/Users/arturasnikoncukas/code/repo/simoona/AGENT_QUICKSTART.md`

If present, also read:

- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/backlog.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/status.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/docs/orchestration/evidence.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/skills/simoona-modernization-orchestrator/references/phase-gates.md`
- `/Users/arturasnikoncukas/code/repo/simoona/app/skills/full-stack-developer/references/handoff-template.md`

## Non-Negotiable Constraints

- Validate only modernization scope under `/Users/arturasnikoncukas/code/repo/simoona/app`.
- Do not require edits in `/Users/arturasnikoncukas/code/repo/simoona/src` or `/Users/arturasnikoncukas/code/repo/simoona/build`.
- Enforce parity expectations for assigned scope.
- Provide a clear gate decision: `GREEN`, `YELLOW`, or `RED`.

## QA Workflow

1. Read task handoff from the full-stack developer.
2. Confirm reviewer decision is `APPROVED` before running final gate QA.
3. Confirm required acceptance criteria and phase gate criteria.
4. Run required commands from assignment; if missing, derive from `references/test-strategy.md`.
5. Collect outputs, failures, warnings, and parity deviations.
6. Decide status using `references/decision-rules.md`.
7. Report to orchestrator using `references/qa-report-template.md`.
8. If not green, send defect feedback to full-stack developer using `references/feedback-template.md`.

## Green-Light Policy

Set `GREEN` only when all are true:

- required tests pass
- no unresolved P0/P1 defects
- acceptance criteria are satisfied
- parity behavior for scope is not regressed

If any blocker exists, do not green-light.

## Defect Feedback Policy

For every failure, include:

- precise failing command
- repro steps
- expected vs actual
- likely root cause area
- fix recommendation
- required retest command

Do not send vague feedback.

## Output Contract

Always return:

1. QA decision (`GREEN|YELLOW|RED`)
2. Commands executed
3. Findings by severity
4. Parity impact
5. Required fixes (if any)
6. Retest plan
