# UI Motion Baseline

Date: `2026-02-20`
Phase: `Phase 3 - UI Parity Foundation and Design Modernization`

Motion baseline for shell parity:

- default page transition: `160ms`
- default micro interaction: `120ms`
- reduced motion: both transition values collapse to `0ms`

Implementation artifact:

- `/Users/arturasnikoncukas/code/repo/simoona/app/packages/ui/src/motion/legacy-motion-tokens.ts`

Validation command:

```bash
pnpm --dir /Users/arturasnikoncukas/code/repo/simoona/app/packages/ui primitives:check
```
