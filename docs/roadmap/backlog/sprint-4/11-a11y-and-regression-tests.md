# S4-11 A11y And Regression Tests

## Type

- Docs Or QA Task

## Summary

为壳层、导航、多列布局和对象页补齐关键路径回归测试和基础无障碍验证。

## Goal

- 稳住系统级布局与结构交互
- 为 Sprint 5 图形接入前建立稳定壳层基线

## Scope

- In scope:
  - NavigationList tests
  - SideNavigation tests
  - FlexibleColumnLayout tests
  - Breadcrumbs tests
  - ObjectPageLayout tests
- Out of scope:
  - 全量视觉回归平台

## Planned File Areas

- `packages/react/src/**/*.test.*`
- test configuration files

## Verification Plan

- `pnpm typecheck`
- `pnpm build`
- Shell Lab walkthrough
- Object Page walkthrough

## Acceptance Criteria

- [ ] 壳层和对象页关键路径有测试
- [ ] 主要布局切换不易回归
- [ ] docs walkthrough 可作为人工验收脚本

## Dependencies

- S4-01
- S4-02
- S4-03
- S4-04
- S4-08
- S4-09

## Suggested Owner

- QA
