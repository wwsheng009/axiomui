# S2-05 MultiInput

## Type

- Component Task

## Summary

实现 token 化输入 MultiInput，用于多值筛选、标签输入和对象关联场景。

## Goal

- 补齐多值输入原语
- 为 Sprint 3 的 MultiComboBox 和高级筛选打基础

## Scope

- In scope:
  - tokens
  - 删除与聚焦
  - 回车创建
  - placeholder
  - 只读态
- Out of scope:
  - 完整 suggestion dropdown

## Planned File Areas

- `packages/react/src/components/multi-input/*`
- `packages/react/src/index.ts`

## Docs Impact

- Form Lab 需要展示 token 创建、删除和折叠

## Testing

- 回车创建
- Backspace 删除
- token focus
- 长 token 折叠

## Acceptance Criteria

- [ ] 可用于 filter chips 或多值条件输入
- [ ] 与 FormField 的状态和布局协同正常
- [ ] 为 MultiComboBox 提供可复用 token 行为

## Dependencies

- S2-01
- Sprint 1 IconRegistry

## Suggested Owner

- Form
