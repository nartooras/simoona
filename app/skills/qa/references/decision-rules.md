# Decision Rules

Use these rules for final QA status.

## GREEN

Return `GREEN` when:

- all required tests pass
- no open P0/P1 findings
- acceptance criteria are met
- no parity regressions in task scope

## YELLOW

Return `YELLOW` when:

- non-blocking issues exist (P2/P3), or
- evidence is incomplete but no blocker is found, or
- limited environment constraints prevent full confidence

`YELLOW` requires explicit follow-up tasks.

## RED

Return `RED` when:

- any required test fails, or
- any P0/P1 defect is found, or
- acceptance criteria are unmet, or
- parity regression is confirmed

`RED` must include concrete fix instructions and retest commands.
