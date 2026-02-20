# Review Checklist

Use this checklist for every assigned review.

## Scope Compliance

- Changes match assigned in-scope items.
- No unrelated refactors are included.
- No edits in `/src` or `/build`.

## Architecture Compliance

- Work remains inside `/app` modernization boundaries.
- Module boundaries are respected (web/api/packages/tests separation).
- No forbidden cross-layer shortcuts are introduced.

## Quality and Maintainability

- Code is readable and cohesive.
- Error handling is explicit and appropriate.
- Input/output contracts are clear and typed.
- Tests cover changed behavior.

## Over-Engineering Check

- No speculative abstractions.
- No unused generic frameworks/utilities added.
- Complexity is proportional to objective.

## Best Practices

- Follows existing repo conventions and assigned standards.
- Keeps changes minimal and reviewable.
- Avoids hidden side effects and unclear coupling.

## Parity Risk

- No obvious user-visible behavior drift in assigned scope.
- API behavior changes are intentional and justified.
- Risky changes are documented with mitigation.
