# Button 按钮系统

## 角色定位

按钮是 UI5 组件层里最稳定的交互原子之一。它不是单一的 `primary / secondary` 二分法，而是围绕统一 token 派生出默认、强调、语义、透明、选中、禁用等一整套状态组合。

## 关键变体

- 默认按钮：浅底、边框清晰、文本可读，适合大部分页面动作。
- Emphasized：品牌主色强调，用于主操作。
- Positive / Accept：绿色语义动作，强调确认和通过。
- Negative / Reject：红色语义动作，强调删除、拒绝、危险操作。
- Attention：警告类动作，颜色更接近橙黄语义。
- Transparent / Lite：透明底或极轻底色，常用于工具栏、页头和壳层区域。
- Icon Only：保留按钮边界和焦点，但视觉重心转为图标槽。
- Selected / Disabled：不是独立组件，而是所有按钮变体都可能进入的状态层。

## 关键尺寸与实现信号

- `sapMBtn` 外层在 cozy 下是 `3rem` 交互盒高，compact 下是 `2rem`。
- 真正可见的 `sapMBtnInner` 高度跟随 `var(--sapElement_Height)`，最小宽度约 `2.5rem`。
- 文本型按钮左右内边距默认约 `0.75rem`。
- 图标按钮的图标槽在 cozy 下约 `2.375rem`，compact 下约 `1rem`。
- 焦点不依赖浏览器默认 outline，而是消费 `sapContent_FocusColor` 一套系统级焦点色。

这些信号说明按钮在 UI5 中始终被当作“有明确命中面积的状态容器”，而不是一段带点击事件的文字。

## 状态规则

- hover 通常只做中等强度增强，不会突然跳成强饱和色块。
- active 比 hover 更强调边框、文本和背景的反馈差异。
- Emphasized 按钮在 active 场景下不总是继续维持纯蓝底，而是更强调可读性和按下反馈。
- disabled 通过统一禁用透明度降噪，但仍保留原有空间占位。
- selected 是系统级状态，不应临时通过“多加一个深色背景”来模拟。

## 新项目复刻建议

- 用一套 button token 统一派生 `default / emphasized / positive / negative / attention / transparent / selected / disabled`。
- 把外层命中面积和内层视觉边界分开建模，这样图标按钮、分裂按钮、菜单按钮都能复用同一底座。
- 工具栏按钮不要另外发明一套组件，只给同一按钮系统增加 `toolbar` 或 `header` 语境变体。
- 不要只保留 `primary / secondary / ghost` 三种，否则会丢掉 UI5 的语义层。

## 主要实现来源

- `resources/sap/m/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
