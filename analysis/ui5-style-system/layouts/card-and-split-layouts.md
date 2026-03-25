# Card 与 Split Layout 布局

## 设计意图

UI5 的卡片布局和分栏布局服务的是典型企业工作台场景：

- 看板
- 摘要卡片
- 主从详情
- 双栏/三栏工作区

## Card 作为布局单元

Card 不只是一个组件，它在很多页面中承担布局块作用：

- 自带表面和边界
- 自带 header / content / footer 三段式结构
- 允许 hover / focus / interactive 状态

因此，新项目中 Card 既应作为组件，也应作为布局原子。

## 分栏布局的关键精神

从 `sap.f` 的相关实现和参数可以抽取出一个稳定思路：

- 主内容区和次级内容区不是完全对称
- 分栏分隔不是粗重边框，而是轻量分离
- 切换栏宽时，内容 padding 与标题布局需要同步调整

## 新项目复刻建议

### Card 布局层面

- 统一卡片宽度节奏
- 统一卡片间 gap，建议从 `1rem` 起步
- 卡片内容 padding 默认 `1rem`
- hover 仅做轻阴影提升，不做夸张动画

### Split Layout 层面

适合定义成：

```text
split-layout
  -> primary pane
  -> secondary pane
  -> optional tertiary pane
```

并使用：

- 固定分隔 token
- 统一 pane 内 padding
- 小屏幕下按优先级折叠或切换

## 复刻时要避免的问题

- 卡片与页面背景对比过低，导致层级不清
- 分栏之间留白过大，破坏信息连续性
- 手机端强行保留三栏结构

## 验收重点

- 卡片在列表、仪表板、摘要页中都能作为统一布局单元使用
- 分栏结构在桌面有层次，在手机能合理折叠
- 卡片与分栏都消费同一套 surface、shadow、padding token
