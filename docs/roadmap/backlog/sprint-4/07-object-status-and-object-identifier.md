# S4-07 ObjectStatus And ObjectIdentifier

## Type

- Component Task

## Summary

实现 ObjectStatus 与 ObjectIdentifier，补齐企业对象信息展示原语。

## Goal

- 为对象页、表格、卡片和列表提供统一信息展示方式
- 形成可在多个场景复用的对象展示层

## Scope

- In scope:
  - ObjectStatus
  - ObjectIdentifier
  - state
  - iconName
  - title/subtitle/meta
- Out of scope:
  - 复杂业务格式化

## Planned File Areas

- `packages/react/src/components/object-status/*`
- `packages/react/src/components/object-identifier/*`
- `packages/react/src/index.ts`

## Docs Impact

- Object Page Lab 需要展示状态和标识信息

## Testing

- 状态色
- 长文本省略
- 图标对齐
- compact 模式

## Acceptance Criteria

- [ ] 可在对象页头、表格和卡片中复用
- [ ] 状态语义清晰
- [ ] 与 Avatar、Breadcrumbs 组合自然

## Dependencies

- Sprint 1 IconRegistry
- Sprint 1 theme foundation

## Suggested Owner

- Shell
