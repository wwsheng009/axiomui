# S2-10 A11y And Smoke Tests

## Type

- Docs Or QA Task

## Summary

为 Sprint 2 的输入类与 Popover 交互补齐 smoke tests 和键盘路径验证。

## Goal

- 防止第一批输入控件在后续 Sprint 中频繁回归
- 把 a11y 和交互验证从一开始就固化下来

## Scope

- In scope:
  - Select keyboard tests
  - ComboBox keyboard tests
  - MultiInput token tests
  - DatePicker parsing and calendar tests
  - Popover dismiss tests
- Out of scope:
  - 视觉回归平台全量建设

## Planned File Areas

- `packages/react/src/**/*.test.*`
- test configuration files

## Verification Plan

- `pnpm typecheck`
- `pnpm build`
- Form Lab walkthrough
- keyboard walkthrough

## Acceptance Criteria

- [ ] Select、ComboBox、MultiInput、DatePicker、Popover 有关键路径测试
- [ ] docs walkthrough 可复现主要交互
- [ ] 后续 Sprint 可在此基础上继续扩展

## Dependencies

- S2-02
- S2-03
- S2-04
- S2-05
- S2-07

## Suggested Owner

- QA
