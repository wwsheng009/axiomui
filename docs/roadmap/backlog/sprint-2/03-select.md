# S2-03 Select

## Type

- Component Task

## Summary

实现单选下拉 Select，补齐最基础的企业选择件。

## Goal

- 提供简单稳定的单值选择输入
- 作为更复杂选择控件的行为基线

## Scope

- In scope:
  - items
  - controlled/uncontrolled value
  - placeholder
  - disabled state
  - valueState
  - keyboard navigation
- Out of scope:
  - 搜索过滤

## Planned File Areas

- `packages/react/src/components/select/*`
- `packages/react/src/index.ts`
- `apps/docs/src/form-lab/*`

## Docs Impact

- 基础 Select demo
- FilterBar 中的真实筛选示例

## Testing

- 上下键、Enter、Escape、Home、End
- placeholder、禁用项、长文本
- RTL

## Acceptance Criteria

- [ ] 可在 FormGrid 和 FilterBar 中使用
- [ ] API 遵循 `value/defaultValue/onValueChange`
- [ ] 支持 valueState 与紧凑模式

## Dependencies

- S2-01
- S2-02

## Suggested Owner

- Form
