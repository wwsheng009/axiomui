# S1-07 Overlay Foundation

## Type

- Foundation Task

## Summary

实现弹层基础设施，包括 portal、dismiss、focus trap、scroll lock 和 stack 管理。

## Goal

- 为 Popover、DatePicker、Menu、MessagePopover 提供统一底座
- 减少后续每个弹层组件重复造轮子

## Scope

- In scope:
  - `PortalHost`
  - `DismissLayer`
  - `FocusTrap`
  - scroll lock
  - z-index stack
- Out of scope:
  - Popover 或 Menu 的具体 UI

## Planned File Areas

- `packages/react/src/lib/overlay/*`
- `packages/react/src/components/overlay/*`
- `packages/react/src/index.ts`

## Docs Impact

- Theme Lab 需要至少能触发一组 overlay 行为验证

## Testing

- 点击外部关闭
- Escape 关闭
- 焦点回收
- body scroll lock
- 多 overlay 叠放顺序

## Acceptance Criteria

- [ ] overlay 基础设施已存在且可复用
- [ ] 可被 Dialog 接入
- [ ] keyboard 与 dismiss 主路径稳定

## Dependencies

- 无

## Suggested Owner

- Foundation
