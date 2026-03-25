# S3-01 MultiComboBox

## Type

- Component Task

## Summary

实现 MultiComboBox，把多选下拉和 token 输入组合成适合企业筛选场景的复合控件。

## Goal

- 支撑多值筛选和标签型选择场景
- 复用 Sprint 2 的 ComboBox 和 MultiInput 行为

## Scope

- In scope:
  - 多选候选项
  - token 同步
  - 输入过滤
  - placeholder
  - valueState
- Out of scope:
  - 远程异步搜索

## Planned File Areas

- `packages/react/src/components/multi-combo-box/*`
- `packages/react/src/index.ts`
- `apps/docs/src/worklist-*/*`

## Docs Impact

- 高级筛选 worklist 需要使用 MultiComboBox 演示多值过滤

## Testing

- 选中与取消选中
- token 添加与删除
- 输入过滤
- 键盘主路径

## Acceptance Criteria

- [ ] 可在 FilterBar 中完成多值筛选
- [ ] token、列表与输入状态同步稳定
- [ ] 与 valueState、compact/cozy 协同正常

## Dependencies

- Sprint 2 ComboBox
- Sprint 2 MultiInput
- Sprint 2 Popover

## Suggested Owner

- Form
