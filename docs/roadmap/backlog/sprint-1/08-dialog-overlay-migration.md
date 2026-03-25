# S1-08 Dialog Overlay Migration

## Type

- Component Task

## Summary

将现有 Dialog 迁移到新的 overlay foundation，作为首个真实消费方验证底座设计。

## Goal

- 验证 overlay API 是否足以支撑交互复杂组件
- 提前暴露弹层焦点和关闭行为问题

## Scope

- In scope:
  - Dialog portal 化
  - 焦点回收
  - dismiss layer
  - scroll lock
- Out of scope:
  - Dialog 新功能扩展

## Planned File Areas

- `packages/react/src/components/dialog/*`
- `apps/docs/src/...` 中 dialog 示例

## Docs Impact

- Theme Lab 或 foundation demo 需要能验证 Dialog 行为

## Testing

- 打开后的初始焦点
- 关闭后的焦点返回
- Esc/backdrop 关闭
- 多个 dialog 的堆叠顺序

## Acceptance Criteria

- [ ] Dialog 已接 overlay foundation
- [ ] 行为不比当前版本退步
- [ ] 可以作为后续 Popover 和 DatePicker 的交互基准

## Dependencies

- S1-07

## Suggested Owner

- Overlay
