# S1-09 Foundation Smoke Tests

## Type

- Docs Or QA Task

## Summary

为 foundation 层建立最小 smoke tests 和 walkthrough 基线，防止主题与弹层能力频繁回归。

## Goal

- 稳住 Sprint 1 产物
- 为 Sprint 2 之后的控件扩展建立回归基础

## Scope

- In scope:
  - ThemeProvider smoke
  - Icon 渲染 smoke
  - locale 格式化 smoke
  - Dialog overlay smoke
- Out of scope:
  - 全量视觉回归平台

## Planned File Areas

- `packages/react/src/**/*.test.*`
- test configuration files
- `apps/docs/src/...` 中必要的 smoke hooks

## Verification Plan

- `pnpm typecheck`
- `pnpm build`
- 主题切换 walkthrough
- RTL walkthrough
- keyboard walkthrough

## Acceptance Criteria

- [ ] foundation 关键路径有最小自动化覆盖
- [ ] docs walkthrough 有明确脚本
- [ ] 后续 sprint 可在此基础上扩展测试

## Dependencies

- S1-01
- S1-05
- S1-06
- S1-08

## Suggested Owner

- QA
