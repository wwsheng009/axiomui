# S4-02 SideNavigation

## Type

- Component Task

## Summary

实现 SideNavigation，补齐工作台左侧导航壳层。

## Goal

- 支撑展开/收起导航区
- 为 ToolPage 提供左侧导航容器

## Scope

- In scope:
  - collapsed state
  - header and footer slots
  - navigation content
  - width transitions
- Out of scope:
  - 顶部 header

## Planned File Areas

- `packages/react/src/components/side-navigation/*`
- `packages/react/src/index.ts`

## Docs Impact

- Shell Lab 需要演示展开与收起

## Testing

- 收起与展开
- 窄屏行为
- 焦点顺序
- active 栏高亮

## Acceptance Criteria

- [ ] 可与 NavigationList 组合成完整侧导航
- [ ] 收起状态下仍有清晰交互语义
- [ ] 与 ToolPage 布局协作正常

## Dependencies

- S4-01

## Suggested Owner

- Shell
