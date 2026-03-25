# 05 Demo Scenarios

## 目标

docs 不是静态画册，而是 AxiomUI 的验收场。每个阶段都要有能验证真实企业场景的 demo。

## Theme Lab

### 作用

验证 Foundation 层是否稳定。

### 必备场景

- theme 切换
- density 切换
- LTR/RTL 切换
- locale 切换
- Button、Input、Card、Tabs、Dialog、Toolbar、MessageStrip 的基础矩阵

### Walkthrough

1. 切换 `horizon -> horizon_dark -> horizon_hcb`
2. 切换 `cozy -> compact`
3. 切换 `ltr -> rtl`
4. 检查 focus ring、文本对比度、边框和 surface

## Form Lab

### 作用

验证高频输入件和表单布局是否协作正常。

### 必备场景

- Input / Select / ComboBox / MultiInput / DatePicker
- valueState 和 help text
- FormGrid 紧凑布局
- 小宽度换行和 label 对齐

### Walkthrough

1. 逐个切换 valueState
2. 在 compact 下检查字段高度和对齐
3. 检查长文案、空态、禁用态

## Advanced Filter Worklist

### 作用

验证复杂筛选件在业务场景中的真实可用性。

### 必备场景

- FilterBar
- VariantManager
- Select / MultiComboBox / DateRangePicker / TimePicker
- DataTable
- MessagePopover

### Walkthrough

1. 设置多值筛选
2. 选择日期范围
3. 应用筛选到 worklist
4. 打开 MessagePopover 检查反馈

## Shell Lab

### 作用

验证工作台主骨架是否成立。

### 必备场景

- ToolHeader
- ToolPage
- SideNavigation
- NavigationList
- 页面内容区滚动与布局切换

### Walkthrough

1. 收起和展开 SideNavigation
2. 切换导航层级项
3. 验证 header、side、content 三段结构

## Object Page Lab

### 作用

验证对象页结构是否完整，不只是 section tab 切换。

### 必备场景

- Breadcrumbs
- ObjectPageHeader
- ObjectStatus / ObjectIdentifier / Avatar
- ObjectPageLayout
- sections / subsections / anchor sync

### Walkthrough

1. 检查对象页头部信息密度
2. 切换 sections
3. 滚动验证 anchor sync
4. 在不同主题与宽度下查看信息层次

## Chart Lab

### 作用

验证微图表是否能真正进入企业 UI 场景。

### 必备场景

- KPI cards
- Object page summary charts
- Table/list inline charts
- Bullet / Radial / Delta / HarveyBall / StackedBar / InteractiveDonut / InteractiveLine

### Walkthrough

1. 检查不同主题下图形颜色语义
2. 检查极小尺寸下可读性
3. 检查 hover/focus 或 active state
4. 检查图表是否提供摘要文本

## 发布前总体验收脚本

### Foundation

- 切换主题、密度、方向、语言
- 打开和关闭 dialog/popover

### Forms

- 在 Form Lab 中完成一组输入和校验
- 在 worklist 中应用一组复杂筛选

### Shell

- 走通导航、列表、详情、对象页链路

### Charts

- 查看 KPI 卡、对象页摘要和表格行内指标

### Quality

- 跑通 `pnpm typecheck`
- 跑通 `pnpm build`
- 跑通 smoke tests
