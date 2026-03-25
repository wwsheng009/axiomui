# Chart Engineer Guide

## 这个角色负责什么

Chart 方向负责把企业 KPI、趋势和占比表达补到可复用层，而不是只做一张“示意图”。

主要范围包括：

- microchart shared primitives
- Bullet、Radial、Delta、HarveyBall、StackedBar
- InteractiveDonut、InteractiveLine
- KPI card 组合层
- 图形 a11y 文案与交互语义

## 先看哪些文档

1. [../../01-roadmap.md](../../01-roadmap.md)
2. [../../05-demo-scenarios.md](../../05-demo-scenarios.md)
3. [../../backlog/sprint-5/README.md](../../backlog/sprint-5/README.md)
4. [../../02-api-conventions.md](../../02-api-conventions.md)

## 最常改的目录

- `packages/react/src/components/microchart/*`
- `packages/react/src/components/kpi-card/*`
- `packages/tokens/src/*`
- `apps/docs/src/*` 里的 chart lab 和对象页摘要区

## 适合作为第一批承接的任务

- chart primitives
- BulletMicroChart
- RadialMicroChart
- KPI card
- chart lab 接线

## 这个角色的核心原则

- 先做 microchart，不直接跳到大图表框架
- 图形必须能嵌进 card、table、object page，而不是只在空白画布里存在
- 语义文本、状态色和尺寸系统要先于复杂交互
- 图形组件本质也是产品组件，不是视觉素材

## 最容易踩的坑

- 先追复杂交互，忽略基础可读性
- 颜色过多，脱离 semantic token
- 只在默认主题下看起来正常
- 图形进入表格或卡片后把布局撑坏

## 验收时至少看什么

- 深浅主题下标签和图形对比是否足够
- 小尺寸下是否仍可读
- 极端值、空态、单段数据是否稳定
- docs 是否展示了真实 KPI 卡片和对象页摘要场景

## 你最常协作的角色

- `Foundation Engineer`
- `Docs Engineer`
- `QA/Accessibility Engineer`
