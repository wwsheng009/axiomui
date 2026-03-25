# S3-05 Menu

## Type

- Component Task

## Summary

实现 Menu 与层级菜单，补齐工作台顶部、表格行操作和上下文操作入口。

## Goal

- 支撑常见操作菜单
- 为 ToolHeader、Toolbar 和对象页动作提供统一 menu 入口

## Scope

- In scope:
  - menu items
  - iconName
  - disabled and destructive item
  - submenu
  - keyboard navigation
- Out of scope:
  - 命令系统和快捷键中心

## Planned File Areas

- `packages/react/src/components/menu/*`
- `packages/react/src/index.ts`

## Docs Impact

- 需要有 Toolbar 或 ToolHeader 下的 menu 演示

## Testing

- 层级菜单展开
- 键盘导航
- RTL
- 图标与危险项样式

## Acceptance Criteria

- [ ] 可挂载到 Toolbar、ToolHeader 或表格行操作
- [ ] 支持层级导航
- [ ] 与 ResponsivePopover 协同正常

## Dependencies

- Sprint 1 IconRegistry
- S3-04 ResponsivePopover

## Suggested Owner

- Overlay
