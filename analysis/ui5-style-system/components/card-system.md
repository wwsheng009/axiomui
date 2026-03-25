# Card 系统

## 角色定位

Card 在 UI5 里既是组件，也是布局原子。它承担信息分组、摘要展示、可交互面板、分析内容容器和小型仪表板单元的职责，因此它的样式规则同时影响内容组织和页面层次。

## 视觉基准

- 卡片背景使用 `sapTile_Background`。
- 默认阴影使用 `sapContent_Shadow0`。
- 边框为 `0.0625rem`，颜色来自 `sapTile_BorderColor`。
- 圆角来自 `sapTile_BorderCornerRadius`。
- 交互卡片 hover 时提升到 `sapContent_Shadow2`。
- 透明卡片会去掉边框、圆角和阴影，退化成布局容器。

## 结构信号

- Filter Bar 常见 padding 约 `.5rem 1rem`。
- Header 主内容区常见 padding 为 `1rem 1rem .25rem 1rem`。
- Footer 常见 padding 为 `.5rem 1rem .7rem`。
- Title 常用 `.875rem` 粗体语气，Subtitle 也是 `.875rem`，但改用次级文字色。
- Status / 时间戳一类次级信息常见字号约 `.75rem`。

这些结构信号说明 Card 不是简单的大白块，而是一套带 header、content、footer、filter 和交互边界的微型页面容器。

## 交互与状态规则

- `sapFCardInteractive` 在 hover 时增强阴影，但不会突然抬高边框厚度。
- 焦点通过覆盖整卡的 focus ring 或 header 内部 focus ring 表达。
- `NoHeader`、`BottomHeader`、`Transparent`、`NoContent` 都是同一张卡片外壳的变体。
- 内容区允许叠加消息层、加载占位和 shimmer，占位状态仍保持原有卡片骨架。

## 复刻建议

- 把 Card 当成“带标准分区的 surface 组件”，不要把 header、content、footer 写成三套自由盒子。
- 交互卡片和静态卡片应共用同一底座，只在 hover、focus、pointer 行为上分层。
- 透明卡片要作为合法变体保留，这对仪表盘和页面拼装很重要。
- 加载、消息、空态都应在卡片内部解决，而不是额外包一个外层容器。

## 主要实现来源

- `resources/sap/f/themes/base/library.less`
- `resources/sap/f/themes/sap_horizon/library.css`
