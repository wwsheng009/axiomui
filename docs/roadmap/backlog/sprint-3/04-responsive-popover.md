# S3-04 ResponsivePopover

## Type

- Component Task

## Summary

实现 ResponsivePopover，让桌面端使用 popover，小屏端自动退化为更适合触屏的弹层形态。

## Goal

- 提供可复用的自适应弹层
- 为 Menu 和 MessagePopover 提供统一容器

## Scope

- In scope:
  - desktop popover 模式
  - small-screen dialog/drawer 模式
  - open state
  - focus and dismiss behavior
- Out of scope:
  - 具体菜单或消息中心内容

## Planned File Areas

- `packages/react/src/components/responsive-popover/*`
- `packages/react/src/index.ts`

## Docs Impact

- 需要展示桌面与小屏模式切换示例

## Testing

- 屏宽切换
- 焦点回收
- scroll lock
- Esc 与 dismiss

## Acceptance Criteria

- [ ] 桌面与小屏行为都稳定
- [ ] 可被 Menu 和 MessagePopover 直接消费
- [ ] 不破坏现有 overlay 约定

## Dependencies

- Sprint 2 Popover
- Sprint 1 overlay foundation

## Suggested Owner

- Overlay
