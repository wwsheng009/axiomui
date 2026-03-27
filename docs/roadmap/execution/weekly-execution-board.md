# Weekly Execution Board

这份执行板用于把 `Sprint 1-5` 的 backlog 压缩到周级别，作为历史周计划基线，方便回看当时的排班方式、周会节奏和风险跟踪方法。

截至 `2026-03-27`，当前 live status 不再以本页为准：

- 当前真实实施状态请先看 [current-status.md](./current-status.md)
- 当前任务状态和依赖关系请看 [master-backlog-board.md](../backlog/master-backlog-board.md) 与 [owner-backlog-board.md](../backlog/owner-backlog-board.md)
- 本页更适合回答“前五个 sprint 当时是怎么按周推进的”，而不是“现在 Sprint 6 正在做什么”

## 字段说明

- `Priority`
  建议优先级，`P0 > P1 > P2`
- `Owner`
  默认负责角色
- `Deliverable`
  本周应产出的可见成果
- `Exit Check`
  周结束前必须确认的检查点

## Week 1

### 周目标

启动 Foundation 层，把主题上下文、token 分层和底座 API 框架立起来。

| Priority | ID | Task | Owner | Deliverable | Exit Check |
| --- | --- | --- | --- | --- | --- |
| P0 | S1-01 | ThemeProvider and theme context | Foundation | `ThemeProvider`、`useTheme`、主题类型 | provider API 可跑通，docs 可挂载 |
| P0 | S1-02 | Token layering and theme files | Foundation | `base + semantic + theme overrides` 初版 | 至少 2 套主题能切换 |
| P0 | S1-05 | Icon registry v1 | Foundation | `Icon` 组件和图标注册表初版 | 至少一批基础图标可命名调用 |
| P0 | S1-06 | Locale provider and formatters | Foundation | `LocaleProvider` 和格式化工具初版 | `zh-CN` / `en-US` 输出可见差异 |
| P1 | S1-07 | Overlay foundation | Foundation | portal、dismiss、focus trap 架子 | overlay 主路径已能本地验证 |

### 本周风险

- token 命名过早漂移
- provider API 未冻结导致后续并行组返工

### 周会检查点

- 是否冻结 `ThemeProvider` 基本 API
- 是否冻结第一版 semantic token 命名
- IconRegistry 是否已足够支撑 Button/Message 类组件

## Week 2

### 周目标

把 foundation 从“有底座”推进到“可验证”，重点打通 Theme Lab、Dialog 和 smoke tests。

| Priority | ID | Task | Owner | Deliverable | Exit Check |
| --- | --- | --- | --- | --- | --- |
| P0 | S1-03 | Component token cleanup | Foundation | 核心组件 token 清扫 | Button/Input/Card/Dialog/Tabs 可随主题变化 |
| P0 | S1-08 | Dialog overlay migration | Overlay | Dialog 接入 overlay 底座 | 焦点回收、Esc、backdrop 行为稳定 |
| P0 | S1-04 | Theme Lab and docs shell | Docs | docs 独立 Theme Lab | theme/density/dir/locale 可切换 |
| P1 | S1-09 | Foundation smoke tests | QA | foundation 主路径 smoke tests | `typecheck/build` + 主题/RTL/dialog walkthrough |
| P1 | S1-10 | Foundation exports and usage docs | Docs | foundation 使用说明和导出收口 | README 和 docs 可找到接入方式 |

### 本周风险

- docs 入口拆分不足，后续继续堆在单文件
- Dialog 行为在 overlay 接入后出现退化

### 周会检查点

- Theme Lab 是否可以作为 Sprint 1 主验收页
- Dialog 是否已经能作为后续 Popover 的交互基线
- foundation 导出是否稳定

## Week 3

### 周目标

进入 Form Core，先立 field primitives 和 Popover，再并行拉起 Select 与 ComboBox。

| Priority | ID | Task | Owner | Deliverable | Exit Check |
| --- | --- | --- | --- | --- | --- |
| P0 | S2-01 | Shared field primitives | Form | trigger、listbox、clear button、empty state | Select/ComboBox/DatePicker 可共用基础壳 |
| P0 | S2-02 | Popover | Overlay | 通用 Popover | 定位、dismiss、宽度跟随稳定 |
| P0 | S2-03 | Select | Form | Select 初版 | 单选、键盘主路径可用 |
| P1 | S2-04 | ComboBox | Form | ComboBox 初版 | 输入过滤和选中路径跑通 |
| P1 | S2-06 | Calendar panel primitive | Form | 月视图和日期面板初版 | DatePicker 已能开始接入 |

### 本周风险

- field primitives 抽得太薄，后面控件继续分叉
- Popover 定位与 dismiss 行为不稳

### 周会检查点

- Select、ComboBox 是否已复用同一套 trigger/list 容器
- Calendar panel 是否足够支撑 DatePicker
- Popover 是否已可作为通用浮层

## Week 4

### 周目标

完成第一批高频输入件并把它们接入 docs 和 worklist 场景。

| Priority | ID | Task | Owner | Deliverable | Exit Check |
| --- | --- | --- | --- | --- | --- |
| P0 | S2-05 | MultiInput | Form | token 输入控件 | token 创建、删除、焦点稳定 |
| P0 | S2-07 | DatePicker | Form | DatePicker 初版 | 输入解析和面板选择可用 |
| P0 | S2-08 | Form integration pass | Form | 新控件与 FormGrid/FilterBar 协作 | 不出现 grid 溢出和控件干涉 |
| P1 | S2-09 | Form Lab and worklist demo | Docs | Form Lab 与 worklist 筛选示例 | 新控件在真实场景里可见 |
| P1 | S2-10 | A11y and smoke tests | QA | 输入类和 Popover 测试 | 键盘路径和主交互 smoke 跑通 |

### 本周风险

- 新控件放入 FormGrid 后再次出现空间冲突
- DatePicker locale 与格式化行为不稳定

### 周会检查点

- Form Lab 是否能作为 Sprint 2 主验收页
- FilterBar 中的控件混排是否稳定
- Smoke tests 是否覆盖 Select/ComboBox/MultiInput/DatePicker

## Week 5-10 Suggested Rhythm

下面这组节奏仍然是对 `Sprint 3-5` 推进方式的历史总结，可继续作为后续排班参考，但不表示当前 live board。

### Week 5-6

- 推进 Sprint 3：MultiComboBox、DateRangePicker、TimePicker、ResponsivePopover、Menu、MessagePopover
- 主验收页：Advanced Filter Worklist

### Week 7-8

- 推进 Sprint 4：NavigationList、SideNavigation、ToolPage、FlexibleColumnLayout、ObjectPageHeader、ObjectPageLayout
- 主验收页：Shell Lab / Object Page Lab

### Week 9-10

- 推进 Sprint 5：chart primitives、microchart 家族、KPI Card、Chart Lab
- 主验收页：Chart Lab

## Weekly Review Template

每周 review 建议固定记录：

- 本周完成
- 本周未完成
- 当前阻塞
- API 变化
- 风险升级项
- 下周重点

## 关联文档

- [Current Status](./current-status.md)
- [Roadmap Overview](../01-roadmap.md)
- [Sprint Checklists](../04-sprint-checklists.md)
- [Backlog Board](../backlog/master-backlog-board.md)
- [Owner Board](../backlog/owner-backlog-board.md)
