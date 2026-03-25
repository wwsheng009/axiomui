# Sprint 4 Backlog

## Sprint 目标

把 AxiomUI 从表单和筛选组件集合推进到完整的工作台壳层与对象页框架，交付导航、多列布局、对象页头和对象展示原语。

## 建议时间窗口

- Week 7-8

## Epic

- [00-sprint-4-epic.md](./00-sprint-4-epic.md)

## Task Drafts

- [01-navigation-list.md](./01-navigation-list.md)
- [02-side-navigation.md](./02-side-navigation.md)
- [03-tool-page.md](./03-tool-page.md)
- [04-flexible-column-layout.md](./04-flexible-column-layout.md)
- [05-breadcrumbs.md](./05-breadcrumbs.md)
- [06-avatar.md](./06-avatar.md)
- [07-object-status-and-object-identifier.md](./07-object-status-and-object-identifier.md)
- [08-object-page-header.md](./08-object-page-header.md)
- [09-object-page-layout.md](./09-object-page-layout.md)
- [10-shell-lab-and-object-page-demo.md](./10-shell-lab-and-object-page-demo.md)
- [11-a11y-and-regression-tests.md](./11-a11y-and-regression-tests.md)

## 建议并行分组

- `Track A`
  NavigationList、SideNavigation、ToolPage
- `Track B`
  FlexibleColumnLayout
- `Track C`
  Breadcrumbs、Avatar、ObjectStatus、ObjectIdentifier、ObjectPageHeader
- `Track D`
  ObjectPageLayout、Shell Lab/Object Page demo、A11y 与回归测试

## Sprint 退出标准

- NavigationList、SideNavigation、ToolPage、FlexibleColumnLayout、ObjectPageHeader、ObjectPageLayout 已导出
- docs 能演示 `shell -> list -> detail -> object page` 完整链路
- `FlexibleColumnLayout` 与 `SplitLayout` 的使用边界清晰
- 对象页支持 header、section、subsection、anchor sync
- 壳层与对象页关键路径具备基础键盘与回归测试
