# S4-01 NavigationList

## Type

- Component Task

## Summary

实现层级导航列表 NavigationList，作为工作台左侧导航树的基础组件。

## Goal

- 提供可嵌套的导航项与分组能力
- 为 SideNavigation 建立稳定内容层

## Scope

- In scope:
  - nested items
  - active item
  - expanded keys
  - badges or meta
  - keyboard navigation
- Out of scope:
  - 壳层布局本身

## Planned File Areas

- `packages/react/src/components/navigation-list/*`
- `packages/react/src/index.ts`

## Docs Impact

- Shell Lab 需要有独立 navigation tree 示例

## Testing

- 展开/收起
- active 项切换
- 键盘上下与左右导航
- RTL

## Acceptance Criteria

- [ ] 可独立渲染层级导航
- [ ] 可被 SideNavigation 直接消费
- [ ] active 与 expanded 状态清晰稳定

## Dependencies

- Sprint 1 theme/icon foundation

## Suggested Owner

- Shell
