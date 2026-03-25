# S4-10 Shell Lab And Object Page Demo

## Type

- Docs Or QA Task

## Summary

在 docs 中建立完整工作台和对象页实验页，把壳层、导航、多列布局和对象页串成真实业务链路。

## Goal

- 提供 Sprint 4 的主要验收场
- 让 AxiomUI 的系统级能力可被一眼看见

## Scope

- In scope:
  - Shell Lab
  - Object Page Lab
  - ToolPage demo
  - SideNavigation demo
  - FlexibleColumnLayout demo
  - ObjectPageHeader + ObjectPageLayout demo
- Out of scope:
  - 真实路由

## Planned File Areas

- `apps/docs/src/app.tsx`
- `apps/docs/src/shell-lab/*`
- `apps/docs/src/object-page-lab/*`

## Walkthrough

1. 进入工作台壳层
2. 切换导航层级项
3. 进入 list-detail-detail 多列布局
4. 打开 detail 并进入 object page
5. 验证 header、section、subsection、anchor sync

## Acceptance Criteria

- [ ] docs 能演示完整后台信息架构
- [ ] theme、density、RTL、locale 切换下 demo 仍可用
- [ ] 可作为 Sprint 4 walkthrough 的主入口

## Dependencies

- S4-01
- S4-02
- S4-03
- S4-04
- S4-08
- S4-09

## Suggested Owner

- Docs
