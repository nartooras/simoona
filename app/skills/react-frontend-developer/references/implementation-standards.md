# React Frontend Implementation Standards

Use this as the default standards baseline for `$react-frontend-developer` tasks.

## Architecture

1. Prefer functional components with explicit props contracts.
2. Keep page composition in feature-level containers and keep UI primitives focused.
3. Extract hooks only when logic is reused or significantly reduces component complexity.
4. Keep domain behavior in feature modules under `app/web/src/features/**`.

## State and Effects

1. Keep state local by default; lift state only when shared behavior requires it.
2. Keep effects deterministic and cleanup-safe.
3. Avoid effect-driven derived state when pure computation can be done during render.
4. Avoid imperative DOM reads/writes unless there is no React-native alternative.

## Accessibility

1. Use semantic elements first (`button`, `nav`, `main`, `section`, `label`, etc.).
2. Ensure full keyboard operation for interactive controls.
3. Preserve visible focus styles and avoid focus traps.
4. Provide meaningful labels/alt text/ARIA attributes where needed.
5. Respect `prefers-reduced-motion` for non-essential animation.

## TypeScript and Reliability

1. Keep `strict` TypeScript compatibility.
2. Avoid nullable hazards; narrow types before access and handle fallbacks explicitly.
3. Keep runtime boundary validation explicit for server-provided payloads.
4. Return stable error UI states for failed data loads.

## Styling and UI Consistency

1. Preserve legacy visual parity unless assignment explicitly approves redesign.
2. Keep CSS organization aligned with existing web package patterns.
3. Do not introduce new design frameworks without explicit approval.
4. Keep animations subtle and purposeful.

## Testing Expectations

1. Add/adjust tests for behavior changed by the task.
2. Validate route-level flows for navigation and user interactions.
3. Cover failure paths for loading/error/empty states when modified.
4. Document any residual parity gap or deferred frontend risk.
