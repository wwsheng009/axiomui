# Sprint 5 Backlog

## Sprint 目标

补齐第一批微图表与 KPI 展示层，让 AxiomUI 在工作台、对象页和卡片场景里具备企业指标可视化能力。

## 当前状态

截至 `2026-03-27`，`Sprint 5` 目标已经落地完成：

- `Bullet`、`Radial`、`Delta`、`HarveyBall`、`StackedBar`、`InteractiveDonut`、`InteractiveLine` 均已实现并导出
- `KpiCard` 已作为组合层接入
- docs 已新增独立 `Chart Lab`
- `KPI cards wall`、`Object page summary`、`Table/list inline indicators` 三个业务场景已接入
- 图表层已具备基础 a11y 文案、交互路径回归测试和多图渲染性能基线

## 建议时间窗口

- Week 9-10

## Epic

- [00-sprint-5-epic.md](./00-sprint-5-epic.md)

## Task Drafts

- [01-chart-primitives-and-tokens.md](./01-chart-primitives-and-tokens.md)
- [02-bullet-microchart.md](./02-bullet-microchart.md)
- [03-radial-microchart.md](./03-radial-microchart.md)
- [04-delta-and-harvey-ball.md](./04-delta-and-harvey-ball.md)
- [05-stacked-bar-microchart.md](./05-stacked-bar-microchart.md)
- [06-interactive-donut-chart.md](./06-interactive-donut-chart.md)
- [07-interactive-line-chart.md](./07-interactive-line-chart.md)
- [08-kpi-card-composition.md](./08-kpi-card-composition.md)
- [09-chart-lab-and-business-demos.md](./09-chart-lab-and-business-demos.md)
- [10-a11y-performance-and-regression-tests.md](./10-a11y-performance-and-regression-tests.md)

## 建议并行分组

- `Track A`
  chart primitives、Bullet、Radial
- `Track B`
  Delta、HarveyBall、StackedBar
- `Track C`
  InteractiveDonut、InteractiveLine
- `Track D`
  KPI Card、Chart Lab、A11y/性能/回归测试

## Sprint 退出标准

- Bullet、Radial、Delta、HarveyBall、StackedBar、InteractiveDonut、InteractiveLine 已导出
- docs 有独立 Chart Lab
- 至少 3 个真实业务场景接入图形组件
- 图形组件支持 theme、density、semantic state
- 图形组件具备基础 a11y 文案与回归测试

当前这组退出标准已满足。
