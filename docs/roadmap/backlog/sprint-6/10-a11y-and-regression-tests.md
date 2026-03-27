# S6-10 A11y And Regression Tests

## Type

- Docs Or QA Task

## Summary

为上传、规划、树选择、向导流和持久化适配补齐 a11y 与回归测试，避免 Sprint 6 变成新的复杂交互回归源。

## Goal

- 在新一批复杂交互组件上尽早固化工程保障
- 让 Workflow Lab 同时成为可执行验收脚本

## Scope

- In scope:
  - file queue keyboard tests
  - drag and drop state tests
  - calendar or tree keyboard tests
  - wizard blocked step tests
  - persistence adapter state tests
  - Workflow Lab smoke
- Out of scope:
  - 全量视觉回归平台

## Planned File Areas

- `packages/react/src/**/*.test.*`
- `apps/docs/src/**/*.test.*`
- test configuration files

## Verification Plan

- `pnpm typecheck`
- `pnpm build`
- Workflow Lab walkthrough
- keyboard and RTL walkthrough

## Acceptance Criteria

- [ ] 关键上传、规划、树选择和步骤流有测试覆盖
- [ ] 主要组件具备基础 a11y 语义断言
- [ ] docs walkthrough 可作为 Sprint 6 验收脚本

## Dependencies

- S6-02
- S6-03
- S6-04
- S6-05
- S6-06
- S6-07
- S6-08

## Suggested Owner

- QA
