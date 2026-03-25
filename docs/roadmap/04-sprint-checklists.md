# 04 Sprint Checklists

## Sprint 1 Foundation

### 目标

- ThemeProvider
- semantic token 分层
- IconRegistry
- LocaleProvider
- Overlay foundation
- Theme Lab

### 退出标准

- 至少 6 套主题可切换
- 现有组件不依赖单一 horizon 色值
- Dialog 已接 overlay foundation
- docs 可切 theme、density、dir、locale

### 评审重点

- token 命名是否稳定
- overlay API 是否足够支撑后续弹层
- docs 是否已经拆出独立 lab

## Sprint 2 Form Core

### 目标

- field primitives
- Popover
- Select
- ComboBox
- MultiInput
- DatePicker
- Form Lab

### 退出标准

- 新控件可放入 FormGrid/FilterBar 且不溢出
- 支持 compact/cozy、RTL、locale、valueState
- 核心键盘路径可用

### 评审重点

- 输入类组件 API 是否统一
- field primitives 是否足够复用
- DatePicker 是否与 locale/overlay 协作正常

## Sprint 3 Advanced Filters

### 目标

- MultiComboBox
- DateRangePicker
- TimePicker
- ResponsivePopover
- Menu
- MessagePopover
- 高级筛选 demo

### 退出标准

- Worklist 高级筛选 demo 跑通
- MessagePopover 与反馈体系协作正常
- 复杂组合控件有键盘和焦点测试

### 评审重点

- ResponsivePopover 的桌面与小屏行为
- Menu 层级导航与 RTL
- 高级筛选布局在紧凑模式下是否稳定

## Sprint 4 Shell And Object Page

### 目标

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

### 退出标准

- docs 中可以演示 `shell -> list -> detail -> object page` 链路
- `FlexibleColumnLayout` 与 `SplitLayout` 边界清晰
- 对象页支持 header、section、subsection、anchor sync

### 评审重点

- 工作台布局在不同宽度下是否稳定
- 对象页语义是否完整
- 展示类组件是否可被表格、卡片、对象页复用

## Sprint 5 MicroChart

### 目标

- chart primitives
- BulletMicroChart
- RadialMicroChart
- DeltaMicroChart
- HarveyBallMicroChart
- StackedBarMicroChart
- InteractiveDonutChart
- InteractiveLineChart
- KPI Card
- Chart Lab

### 退出标准

- 至少 3 个真实业务场景接入图形组件
- 图形组件支持 semantic state 与主题切换
- 具备基础 a11y 摘要文本

### 评审重点

- 图形 token 是否统一
- 小尺寸和极值场景是否稳定
- 图表不是孤立 demo，而是进入对象页、卡片和表格场景

## 每个 Sprint 的通用清单

### 开始前

- 当前 sprint 依赖是否已完成
- API 约定是否已冻结
- docs 写入范围是否已拆分

### 开发中

- 每个组件同时补 docs 示例
- 每个复杂交互同时补测试
- 避免在 review 末期再统一改命名

### 结束前

- `pnpm typecheck`
- `pnpm build`
- 主题切换 walkthrough
- RTL walkthrough
- keyboard walkthrough
- 关键 demo walkthrough
