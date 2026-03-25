# S4-08 ObjectPageHeader

## Type

- Component Task

## Summary

实现 ObjectPageHeader，把当前对象页头从简单标题升级为企业对象概览头。

## Goal

- 聚合标题、状态、头像、路径、关键动作
- 为 ObjectPageLayout 提供稳定头部

## Scope

- In scope:
  - title and subtitle
  - avatar
  - statuses
  - breadcrumbs
  - meta
  - actions
- Out of scope:
  - 完整滚动和 anchor 行为

## Planned File Areas

- `packages/react/src/components/object-page-header/*`
- `packages/react/src/index.ts`

## Docs Impact

- Object Page Lab 需要以此为主头部

## Testing

- 响应式换行
- 动作区布局
- 状态群展示
- compact/cozy

## Acceptance Criteria

- [ ] 可与 Breadcrumbs、Avatar、ObjectStatus、ObjectIdentifier 组合
- [ ] 在不同宽度下信息层次仍清晰
- [ ] 可成为对象页主要头部组件

## Dependencies

- S4-05
- S4-06
- S4-07

## Suggested Owner

- Shell
