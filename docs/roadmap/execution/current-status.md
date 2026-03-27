# Current Status

## 快照说明

本文档记录 `2026-03-27` 对仓库当前代码快照的实施情况判断。结论以仓库中的实际组件导出、docs 示例页、测试文件和本地验证结果为准，不以 backlog 草稿默认状态为准。

## 验证结果

当前快照已在本地通过以下全量命令：

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm release:check`

其中当前 `workspace` 测试通过情况为：

- `@axiomui/react`：`46` 个测试文件、`160` 个测试全部通过
- `@axiomui/docs`：`10` 个测试文件、`35` 个测试全部通过
- 合计：`56` 个测试文件、`195` 个测试全部通过

## 总体判断

当前项目已经不是“初始化仓库”。更准确的状态是：

- `Foundation` 已完成
- `Form Core` 已完成
- `Advanced Filters` 已完成
- `Shell And Object Page` 已完成
- `MicroChart` 已完成
- `Sprint 1-5` backlog 主线与 QA 收口项也都已完成

## 里程碑状态

| Milestone | 当前状态 | 判断依据 |
| --- | --- | --- |
| `M1 Foundation Ready` | Done | 已有 `ThemeProvider`、`LocaleProvider`、Icon registry、overlay foundation，docs 支持 theme/density/direction/locale 切换 |
| `M2 Form Core Ready` | Done | 已实现 `Popover`、`Select`、`ComboBox`、`MultiInput`、`DatePicker`，并接入 `FormGrid` 与 docs 示例 |
| `M3 Advanced Filter Ready` | Done | 已实现 `MultiComboBox`、`DateRangePicker`、`TimePicker`、`ResponsivePopover`、`Menu`、`MessagePopover`，高级筛选 worklist 已可运行 |
| `M4 Shell Ready` | Done | 已有 `NavigationList`、`SideNavigation`、`ToolHeader`、`ToolPage`、`FlexibleColumnLayout`、`Breadcrumbs`、`Avatar`、`ObjectStatus`、`ObjectIdentifier`、`ObjectPageHeader`、`ObjectPageLayout`、`DynamicPage`、`ObjectPageNav`、`SplitLayout`，docs 也已演示 section、subsection 与 anchor sync |
| `M5 KPI Ready` | Done | 已实现并导出 `ChartSurface`、`ChartLegend`、`BulletMicroChart`、`RadialMicroChart`、`DeltaMicroChart`、`HarveyBallMicroChart`、`StackedBarMicroChart`、`InteractiveDonutChart`、`InteractiveLineChart`、`KpiCard`，docs 已提供独立 `Chart Lab` 与 3 个业务场景，图表层也已补齐基础 a11y、回归与性能基线 |

## 已落地范围

### Foundation

- 主题、密度、方向、语言切换已接入 docs 根应用
- token 包可独立构建并输出样式
- React 包已导出 Icon、overlay primitives、formatters 与 provider
- docs 根应用现已把 `operations`、`shell`、`charts` 三组重型演示区改为按视口接近时再触发的运行时懒加载，而不是首屏同步挂载整页 demo
- docs 还新增了 `App` 级 smoke，用于验证 eager sections 先渲染，而 `operations / shell / charts` 三组 deferred 模块仅在 observer 触发后再挂载
- docs 的 `App` 级 smoke 也已覆盖 locale 与 density 切换后的延迟挂载路径，确保 deferred groups 接收到的是最新 props，而不是初始快照

### Form And Overlay

- 已实现并导出：`Input`、`Select`、`ComboBox`、`MultiInput`、`MultiComboBox`
- 已实现并导出：`CalendarPanel`、`DatePicker`、`DateRangePicker`、`TimePicker`
- 已实现并导出：`Dialog`、`Popover`、`ResponsivePopover`、`Menu`、`MessagePopover`
- 已实现并导出：`FormGrid`、`FilterBar`、`Tabs`
- `Input`、`Select`、`ComboBox`、`MultiComboBox`、`DateRangePicker`、`TimePicker` 的错误态 aria 语义现已统一，`MultiComboBox` 的 token overflow 也已补齐可读摘要

### Worklist And Personalization

- 已实现并导出：`DataTable`、`Pagination`
- 已实现并导出：`VariantManager`、`VariantSync`
- 已实现并导出：`ColumnManager`、`SortManager`、`GroupManager`
- docs 中已有完整的高级筛选和本地视图管理流程

### Shell Primitives

- 已实现并导出：`AppShell`、`ToolHeader`、`Toolbar`
- 已实现并导出：`NavigationList`、`SideNavigation`、`ToolPage`、`FlexibleColumnLayout`、`Breadcrumbs`
- 已实现并导出：`Avatar`、`ObjectStatus`、`ObjectIdentifier`、`ObjectPageHeader`
- 已实现并导出：`ObjectPageLayout`、`DynamicPage`、`PageSection`、`SplitLayout`
- 已实现并导出：`NotificationList`、`MessagePage`、`ObjectPageNav`

### Chart Foundation

- token 包已补充 chart semantic tones、series palette、spacing 和 sizing tokens
- 已实现并导出：`ChartSurface`、`ChartLegend`
- 已实现并导出：`formatChartValueText`、`buildChartAriaLabel`、`getChartToneToken`、`getChartSeriesToken`
- docs 已新增 `Chart primitives and tokens` 示例区，用于展示 semantic tones、series palette、size matrix 和 a11y label helper

### Chart Components

- 已实现并导出：`BulletMicroChart`
- `BulletMicroChart` 当前支持 `actual`、`target`、`forecast`、`ranges`、可选 labels、extreme clamp 和 compact density
- docs 已新增 `Bullet microchart` 示例区，覆盖 KPI card baseline、object page summary 和长标签场景
- 已实现并导出：`RadialMicroChart`
- `RadialMicroChart` 当前支持 `value/total`、语义 `status`、`centerValue/centerLabel`、`sm/md/lg` 尺寸和 compact density
- docs 已新增 `Radial microchart` 示例区，覆盖大卡片、对象页紧凑指标和状态矩阵
- 已实现并导出：`DeltaMicroChart`、`HarveyBallMicroChart`
- `DeltaMicroChart` 当前支持自动方向判断、显式语义状态、幅度归一化、紧凑尺寸与可读 aria 文案
- `HarveyBallMicroChart` 当前支持多 segment、语义 tone、可选 legend、自定义 value display 与紧凑布局
- 已实现并导出：`StackedBarMicroChart`
- `StackedBarMicroChart` 当前支持多 segment、显式 total、剩余容量尾段、`compact/full/none` 标签模式与可选 legend
- 已实现并导出：`InteractiveDonutChart`、`InteractiveLineChart`
- `InteractiveDonutChart` 当前支持 hover / focus / click 高亮、受控 `activeKey`、中心内容联动和清晰的键盘遍历路径
- `InteractiveLineChart` 当前支持 active point、min/max marker、可选 axis labels、hover/focus 详情面板和点位按钮键盘导航
- 已实现并导出：`KpiCard`
- `KpiCard` 当前作为薄组合层承接 `Card + chart slot + indicators + status/trend`，用于 KPI tile、对象页摘要和 dashboard summary
- docs 已新增独立 `Chart Lab`，覆盖 `KPI cards wall`、`Object page summary`、`Table and list inline indicators`
- 图表层已新增 `compact + dark + RTL` 回归 smoke、多图渲染性能基线，以及 `Chart Lab` 场景 smoke

## 当前缺口

当前 `Sprint 1-5` 的 backlog 主线与收口项都已经落地，代码侧没有剩余的 roadmap 实现缺口。

## 风险与备注

- docs 构建已经完成手工分 chunk，当前不再出现 Vite chunk size warning；产物已拆分为 `vendor-react`、`axiomui-forms`、`docs-worklist`、`docs-shell`、`docs-charts` 等领域 chunk，其中最大 gzip 后约为 `56.35 kB`
- docs 运行时也已加入 `IntersectionObserver` 驱动的延迟挂载壳层，但若后续继续扩展单个分组内的演示复杂度，仍然需要重新评估分组边界，避免某一个 deferred 区块再次膨胀
- 根 `README` 和 roadmap 文档若不持续同步，仍然会让新成员误判实际完成度
- `ChartSurface` / `ChartLegend` 当前已经被整批 microchart 复用，这层 contract 后续应保持稳定，避免因为业务场景继续膨胀而重新分叉

## 建议的下一步

1. 若后续继续扩展 docs，优先沿用当前按 `foundation / worklist / shell / charts / react domains` 的 chunk 划分，不要再回到单入口大包。
2. 持续把新组件的 a11y / regression smoke 保持在和现有 chart、form 组件一致的收口标准上。
3. 若后续开启 `Sprint 6` 或新的 epic，建议直接沿用当前的 backlog/status 同步方式，避免文档状态再次滞后于代码。
