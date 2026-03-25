# Tabs 与 Navigation 系统

## 角色定位

Tab 导航承担的是“页内二级导航”和“对象上下文切换”，最典型的实现是 `IconTabBar`。它既可以是纯文本 tab，也可以是图标、计数、状态徽章和溢出菜单的组合，因此本质上是一套导航框架，而不是单个 tab 样式。

## 关键尺寸与实现信号

- Header 最小高度约 `2.75rem`。
- 内容区默认 padding 约 `1rem`。
- Text Only 垂直高度约 `3rem`。
- No Text 垂直高度约 `3.75rem`。
- Horizontal 模式高度约 `2.75rem`。
- Vertical 模式高度约 `4.625rem`。
- Overflow 按钮圆角约 `.75rem`，并直接复用 button token。

这些参数说明 UI5 的 tab 系统不是固定一条线，而是根据文本、图标、计数和壳层语境切换成不同排版模式。

## 状态规则

- 文本和计数默认消费 `sapTab_TextColor`。
- hover 会把文本推向更接近 selected 的语气，而不是直接反转整块背景。
- selected 通过 content arrow / indicator 明确表达，不依赖字体变粗独立完成。
- Neutral / Positive / Critical / Negative badge 是标准能力，不需要业务自造标签。
- shell 语境下会切换到 `sapShell_Navigation_*` 一套颜色。

## 结构建议

```text
tab bar
  -> header strip
  -> filter item
  -> selected indicator / content arrow
  -> content container
  -> overflow trigger
```

内容区和 header 区必须分层，因为 UI5 会让它们在背景、阴影和选中指示器上各自承担不同职责。

## 复刻约束

- Text Only、No Text、Horizontal、Vertical 只是同一导航系统的模式，不要拆成几套不兼容组件。
- Overflow 按钮要延续按钮系统，不要设计成完全不同的菜单胶囊。
- 选中指示器必须可见，尤其不能只靠文字颜色表达当前页签。
- badge 和 count 应纳入系统布局，不要覆盖在任意位置。

## 主要实现来源

- `resources/sap/m/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/tnt/themes/base/library.less`
