# Shell Engineer Guide

## 这个角色负责什么

Shell 方向负责把组件拼成可工作的企业后台骨架。

主要范围包括：

- ToolPage
- SideNavigation / NavigationList
- FlexibleColumnLayout
- ObjectPageLayout / Header / SubSection
- Breadcrumbs、Avatar、ObjectStatus、ObjectIdentifier

## 先看哪些文档

1. [../../01-roadmap.md](../../01-roadmap.md)
2. [../../05-demo-scenarios.md](../../05-demo-scenarios.md)
3. [../../backlog/sprint-4/README.md](../../backlog/sprint-4/README.md)
4. [../../execution/weekly-execution-board.md](../../execution/weekly-execution-board.md)

## 最常改的目录

- `packages/react/src/components/tool-header/*`
- `packages/react/src/components/tool-page/*`
- `packages/react/src/components/side-navigation/*`
- `packages/react/src/components/flexible-column-layout/*`
- `packages/react/src/components/object-page-*/*`
- `apps/docs/src/*` 里的 shell/object page lab

## 适合作为第一批承接的任务

- NavigationList
- SideNavigation
- Breadcrumbs
- ObjectStatus / ObjectIdentifier
- ObjectPageHeader

## 这个角色的核心原则

- 优先建立清晰层级，不要只做“看起来像”的布局
- 壳层组件要考虑真实工作流，而不是单页展示
- 多列布局和对象页滚动行为要有语义，不只是 CSS 拼版
- 先让真实 demo 跑通，再扩更多装饰性能力

## 最容易踩的坑

- 只做静态布局，不考虑导航状态和响应式退化
- 把多个复杂壳层能力塞进同一个大组件
- docs 示例只展示单页，不展示跨区域流转
- 和现有 `DynamicPage`、`SplitLayout` 能力重叠却没有边界说明

## 验收时至少看什么

- 导航、头部、内容区层级是否清晰
- 窄屏下是否有合理退化
- 对象页 section 导航是否和正文关系清楚
- 组件在 docs 中是否被用于真实工作区，而不是只摆样子

## 你最常协作的角色

- `Foundation Engineer`
- `Docs Engineer`
- `QA/Accessibility Engineer`
