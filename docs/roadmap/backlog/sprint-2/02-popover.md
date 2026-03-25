# S2-02 Popover

## Type

- Component Task

## Summary

实现通用 Popover，作为第一批选择类和日期类控件的 anchor 弹层容器。

## Goal

- 为 Select、ComboBox、DatePicker 提供统一浮层
- 验证 overlay foundation 在非 dialog 场景下的可用性

## Scope

- In scope:
  - anchor 定位
  - placement 与 offset
  - 自动翻转
  - `matchTriggerWidth`
  - `onOpenChange`
- Out of scope:
  - 菜单与消息中心的特定交互

## Planned File Areas

- `packages/react/src/components/popover/*`
- `packages/react/src/index.ts`

## Docs Impact

- Form Lab 需要能独立展示 Popover 行为

## Testing

- 点击外部关闭
- Escape 关闭
- 边界碰撞与翻转
- 宽度跟随 trigger

## Acceptance Criteria

- [ ] 可被 Select 和 DatePicker 消费
- [ ] 定位和关闭行为稳定
- [ ] 与 ThemeProvider、LocaleProvider、RTL 协同正常

## Dependencies

- Sprint 1 overlay foundation

## Suggested Owner

- Overlay
