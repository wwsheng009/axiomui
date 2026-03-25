# S2-04 ComboBox

## Type

- Component Task

## Summary

实现可输入过滤的 ComboBox，用于常见的企业筛选和半结构化选择场景。

## Goal

- 支撑输入过滤与候选项选择
- 为 MultiComboBox 提前打基础

## Scope

- In scope:
  - inputValue
  - selectedKey
  - filtering
  - optional custom value
  - keyboard selection
- Out of scope:
  - 远程异步搜索

## Planned File Areas

- `packages/react/src/components/combo-box/*`
- `packages/react/src/index.ts`

## Docs Impact

- Form Lab 需要包含输入过滤示例
- Worklist 需要有一处筛选 demo

## Testing

- 输入过滤
- Arrow navigation
- Enter 选中
- Escape 收起
- 无结果态

## Acceptance Criteria

- [ ] 可完成输入 -> 过滤 -> 选中 的主路径
- [ ] 可在 FilterBar 和表单布局中稳定使用
- [ ] 为 Sprint 3 的 MultiComboBox 提供基础

## Dependencies

- S2-01
- S2-02

## Suggested Owner

- Form
