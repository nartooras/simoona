# Gate 7 Performance Baseline

## 1) Run Metadata

- Date: `2026-02-20`
- Phase: `Phase 7 - Hardening and UAT`
- Owner role: `$qa-parity-agent`

## 2) Baseline Command

- Command: `/usr/bin/time -p pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/tests/e2e wave-a:runtime-smoke`
- Result: `PASS`
- Route check evidence: `[wave-a-runtime-smoke] Live runtime route checks passed.`

## 3) Threshold Evaluation

- Accepted threshold:
  - runtime readiness and route verification must complete within `20s` timeout envelope
  - routes `/`, `/profile`, `/Wall/Feed`, `/Settings/Notifications` must return `200`
- Actual:
  - elapsed wall time: `real 0.53`
  - all required routes verified by runtime smoke command
- Verdict: `WITHIN_THRESHOLD`

## 4) Findings by Severity

1. `P3` Non-blocking runtime warning on module type metadata
- Repro:
  - run the baseline command above and observe Node warning output
- Expected: runtime smoke pass; warnings do not alter pass/fail semantics
- Actual: command passed; warnings are informational and do not affect Gate 7 threshold compliance
