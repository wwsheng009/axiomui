---
name: Component Task
about: Track a component or component-family implementation task.
title: "[Component] "
labels: ["area:component"]
assignees: []
---

## Summary

Describe the component to implement or expand.

## Goal

- Which user or business scenario does this component support?
- Which UI5-inspired capability does it align with?

## Scope

- In scope:
- Out of scope:

## Planned File Areas

- `packages/react/src/components/...`
- `packages/react/src/styles/...`
- `packages/react/src/index.ts`
- `apps/docs/src/...`

## API Sketch

```ts
interface ExampleProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (nextValue: string) => void;
}
```

## Interaction Notes

- Keyboard behavior:
- Open/close behavior:
- Value state behavior:
- Empty, loading, or disabled behavior:

## Token Or Styling Impact

- New tokens needed:
- Reused shared primitives:
- Theme, density, or RTL considerations:

## Docs Impact

- Required basic demo:
- Required real-world demo:

## Testing

- Unit tests:
- Keyboard path tests:
- Accessibility checks:

## Acceptance Criteria

- [ ] Public API follows `docs/roadmap/02-api-conventions.md`
- [ ] Uses semantic tokens
- [ ] Supports `cozy` and `compact`
- [ ] Supports `LTR` and `RTL` when applicable
- [ ] Supports value state or status semantics when applicable
- [ ] Includes at least one docs demo
- [ ] Includes tests for core interaction paths
- [ ] Exported from `packages/react/src/index.ts`
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes

## Dependencies

- Required shared primitives or providers:
- Related components:

## Notes

Reference related sprint and lab scenarios from `docs/roadmap/04-sprint-checklists.md` and `docs/roadmap/05-demo-scenarios.md`.
