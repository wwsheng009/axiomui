# S4-03 ToolPage

## Type

- Component Task

## Summary

实现 ToolPage 壳层布局，形成 `header + side navigation + content` 的工作台主骨架。

## Goal

- 承载后台应用的整体信息架构
- 让现有 ToolHeader 有稳定宿主

## Scope

- In scope:
  - header slot
  - side content slot
  - main content slot
  - collapsed layout support
- Out of scope:
  - 真实路由系统

## Planned File Areas

- `packages/react/src/components/tool-page/*`
- `packages/react/src/index.ts`

## Docs Impact

- Shell Lab 需要以 ToolPage 为整体容器

## Testing

- 头部固定
- 内容区滚动
- 侧栏收起布局
- 移动端降级

## Acceptance Criteria

- [ ] 可承载 ToolHeader、SideNavigation 和内容区
- [ ] 不同布局状态稳定
- [ ] 适合作为 docs 工作台 demo 的主壳层

## Dependencies

- S4-02
- 现有 ToolHeader

## Suggested Owner

- Shell
