---
name: Foundation Task
about: Track platform work such as theme, icons, locale, tokens, and overlay foundations.
title: "[Foundation] "
labels: ["epic:foundation"]
assignees: []
---

## Summary

Describe the foundation capability to implement or evolve.

## Goal

- What problem does this task solve?
- Which future component families depend on it?

## Scope

- In scope:
- Out of scope:

## Planned File Areas

- `packages/tokens/src/...`
- `packages/react/src/providers/...`
- `packages/react/src/lib/...`
- `apps/docs/src/...`

## API Sketch

```ts
// Add the expected public surface here.
```

## Token Or Styling Impact

- New semantic tokens:
- Updated theme overrides:
- Density or RTL impact:

## Docs Impact

- Required demo or lab updates:
- Walkthrough scenario to verify:

## Testing

- Unit or interaction tests:
- Theme or RTL checks:
- Accessibility checks:

## Acceptance Criteria

- [ ] Public API is clear and documented
- [ ] Uses semantic tokens instead of hard-coded theme values
- [ ] Works in `cozy` and `compact`
- [ ] Works in `LTR` and `RTL` when applicable
- [ ] Includes docs coverage
- [ ] Includes at least one test or smoke path
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes

## Dependencies

- Blocking dependencies:
- Follow-up tasks unlocked by this work:

## Notes

Link to related roadmap sections in `docs/roadmap/`.
