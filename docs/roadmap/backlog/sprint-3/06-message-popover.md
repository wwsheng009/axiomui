# S3-06 MessagePopover

## Type

- Component Task

## Summary

实现 MessagePopover，形成消息中心入口，并与现有 MessageStrip、NotificationList 形成反馈体系。

## Goal

- 支撑消息分组、严重级别和消息明细查看
- 提升 worklist 和工作台反馈能力

## Scope

- In scope:
  - message list
  - severity grouping
  - count
  - empty state
  - item click
- Out of scope:
  - 全局通知存储中心

## Planned File Areas

- `packages/react/src/components/message-popover/*`
- `packages/react/src/index.ts`

## Docs Impact

- 高级筛选 worklist 或 shell demo 需要一组消息中心示例

## Testing

- 分组
- 空态
- 滚动列表
- 键盘聚焦

## Acceptance Criteria

- [ ] 能与 MessageStrip、NotificationList 形成统一语义
- [ ] 支持严重级别和计数
- [ ] 可在 toolbar/header 中使用

## Dependencies

- S3-04 ResponsivePopover

## Suggested Owner

- Overlay
