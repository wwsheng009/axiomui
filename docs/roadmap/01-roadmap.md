# 01 Roadmap

## 项目目标

AxiomUI 当前已经具备一批面向企业后台的 React 组件与 worklist 原型能力，但要继续向 SAP UI5 风格的完整体系推进，还需要补齐以下三层能力：

- `Foundation`
  主题、图标、国际化、RTL、overlay、shared primitives
- `Component Families`
  高频输入控件、弹层反馈、工作台导航、对象页结构
- `Enterprise Visualization`
  KPI 卡片与 microchart 家族

## 路线原则

- 优先补基础设施，再补高频控件，最后做高级可视化
- 先覆盖最常见的企业场景，而不是追求 UI5 全量控件数
- 每个 sprint 产物都必须可在 docs 中直接验证
- 避免所有人长期同时修改同一文件，尤其是 `apps/docs/src/app.tsx`

## 规划范围

### P0 Foundation

- ThemeProvider
- 主题注册表
- semantic tokens
- IconRegistry
- LocaleProvider
- Overlay foundation

### P1 High-Frequency Controls

- Popover
- Select
- ComboBox
- MultiInput
- DatePicker
- MultiComboBox
- DateRangePicker
- TimePicker
- Menu
- MessagePopover

### P2 Shell And Object Page

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

### P3 Enterprise Visualization

- BulletMicroChart
- RadialMicroChart
- DeltaMicroChart
- HarveyBallMicroChart
- StackedBarMicroChart
- InteractiveDonutChart
- InteractiveLineChart
- KPI Card

## 里程碑

### M1 Foundation Ready

- 主题可切换
- RTL/locale 生效
- Dialog 已接入 overlay foundation
- docs 有 Theme Lab

### M2 Form Core Ready

- Popover、Select、ComboBox、MultiInput、DatePicker 可用
- 可在 FormGrid/FilterBar 中稳定工作
- docs 有 Form Lab

### M3 Advanced Filter Ready

- MultiComboBox、DateRangePicker、TimePicker、ResponsivePopover、Menu、MessagePopover 可用
- 高级筛选和消息交互 demo 跑通

### M4 Shell Ready

- SideNavigation、ToolPage、FlexibleColumnLayout、ObjectPageLayout 可用
- docs 有 Shell Lab 和 Object Page Lab

### M5 KPI Ready

- 第一批 microchart 可用
- KPI Card 与真实业务示例跑通
- docs 有 Chart Lab

## Sprint 规划

| Sprint | 时间 | 主目标 | 关键交付 |
| --- | --- | --- | --- |
| Sprint 1 | Week 1-2 | Foundation | ThemeProvider、LocaleProvider、IconRegistry、Overlay foundation、Theme Lab |
| Sprint 2 | Week 3-4 | Form Core | Popover、Select、ComboBox、MultiInput、DatePicker、Form Lab |
| Sprint 3 | Week 5-6 | Advanced Filters | MultiComboBox、DateRangePicker、TimePicker、Menu、MessagePopover |
| Sprint 4 | Week 7-8 | Shell & Object Page | SideNavigation、ToolPage、FlexibleColumnLayout、ObjectPageHeader、ObjectPageLayout |
| Sprint 5 | Week 9-10 | MicroChart | Bullet、Radial、Delta、HarveyBall、StackedBar、InteractiveDonut、InteractiveLine、Chart Lab |
| Sprint 6 | Week 11-12 或下一阶段规划窗口 | Workflow And Planning | Upload primitives、FileUploader、Calendar、PlanningCalendar、Tree、HierarchicalSelect、Wizard、Saved Variant persistence adapter、Workflow Lab |

`Sprint 6` 当前承接上传、规划、层级选择和向导流这条新主线；若并行资源不足，可把 `Week 11-12` 视为它的起步与缓冲窗口。

## 并行工作流

建议长期维持以下并行泳道：

- `Track A` Foundation
- `Track B` Form Controls
- `Track C` Overlay & Feedback
- `Track D` Shell & Object Page
- `Track E` Docs & QA

每个 sprint 只调整主次，不改变泳道结构：

- Sprint 1：A 主，E 跟进
- Sprint 2：B/C 主，E 跟进
- Sprint 3：B/C 主，E 跟进
- Sprint 4：D 主，E 跟进
- Sprint 5：Visualization 主，E 跟进

## 人力配置建议

### 最小配置

- 1 人：Foundation owner
- 1 人：Form controls owner
- 1 人：Overlay/Menu owner
- 1 人：Shell/Object Page owner
- 1 人：Docs/QA/Chart owner

### 理想配置

- 1 人：Theme/Icon/I18n
- 1 人：Overlay/Popup
- 2 人：Form Controls
- 1 人：Shell/Object Page
- 1 人：Charts/KPI
- 1 人：Docs/QA

## 工作完成标准

任一组件或能力完成时，至少满足：

- 已导出
- 已接入 semantic tokens
- 支持 `compact/cozy`
- 支持 `LTR/RTL`
- 支持基本键盘交互
- docs 有真实示例
- 有至少一组测试
- 不破坏 `pnpm typecheck` 与 `pnpm build`

## Sprint 6 Workflow And Planning

截至 `2026-03-27`，`Sprint 6` 已从预留阶段转入实施阶段：

- 已完成：`Upload primitives / file model`、`FileUploader`、`Saved Variant persistence adapter`
- backlog 中：`Calendar`、`PlanningCalendar`、`Tree`、`Hierarchical Select`、`Wizard`
- 规划配套：`Workflow Lab`、`A11y / regression tests`
