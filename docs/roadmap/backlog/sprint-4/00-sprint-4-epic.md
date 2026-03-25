# Sprint 4 Epic

## Type

- Sprint Epic

## Goal

把 AxiomUI 推进成能够承载企业后台主骨架的系统，重点交付工作台导航、多列布局、对象页结构和对象展示原语。

## Target Deliverables

- NavigationList
- SideNavigation
- ToolPage
- FlexibleColumnLayout
- Breadcrumbs
- Avatar
- ObjectStatus
- ObjectIdentifier
- ObjectPageHeader
- ObjectPageLayout
- Shell Lab
- Object Page Lab

## Planned Task Breakdown

- [ ] 01 NavigationList
- [ ] 02 SideNavigation
- [ ] 03 ToolPage
- [ ] 04 FlexibleColumnLayout
- [ ] 05 Breadcrumbs
- [ ] 06 Avatar
- [ ] 07 ObjectStatus 与 ObjectIdentifier
- [ ] 08 ObjectPageHeader
- [ ] 09 ObjectPageLayout
- [ ] 10 Shell Lab 与 Object Page demo
- [ ] 11 A11y 与回归测试

## Exit Criteria

- [ ] 工作台壳层组件已导出
- [ ] 对象页结构组件已导出
- [ ] docs 可演示 `shell -> list -> detail -> object page` 链路
- [ ] `FlexibleColumnLayout` 与现有 `SplitLayout` 边界清晰
- [ ] 关键结构交互有回归测试

## Main Demo

- Shell Lab
- Object Page Lab

## Main Risks

- 新壳层与现有 ToolHeader、DynamicPage、SplitLayout 语义重叠
- 对象页结构不完整，退化成简单 tab 导航
- 多列布局在窄屏和切换状态下易出现行为回归

## References

- [01-roadmap.md](../../01-roadmap.md)
- [04-sprint-checklists.md](../../04-sprint-checklists.md)
- [05-demo-scenarios.md](../../05-demo-scenarios.md)
