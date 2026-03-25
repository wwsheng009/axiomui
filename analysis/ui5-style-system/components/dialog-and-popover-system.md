# Dialog 与 Popover 系统

## 角色定位

Dialog 和 Popover 共同承担 UI5 的浮层体系。前者强调重浮层、模态流程和结构化内容，后者强调上下文就地展开。两者共享相近的表面、圆角、阴影和焦点规则，但在布局和设备适配上分工明确。

## 关键尺寸与实现信号

- Dialog 垂直留白约 `3%`。
- Dialog 标题栏高度约 `2.75rem`，compact 下约 `2.5rem`。
- Dialog 子标题栏高度约 `3rem`，compact 下约 `2.25rem`。
- Dialog 内容区标准 padding 约 `1rem`。
- Dialog 头部根据 `success / error / warning / information` 切换不同 header shadow。
- Popover 箭头偏移量约 `.5rem`，显隐过渡时长约 `.2s`。

这些信号说明 UI5 的弹层不是“一个白盒子加阴影”，而是有明确头部层级、状态语义和设备策略的系统级容器。

## 结构建议

```text
overlay
  -> dialog / popover shell
  -> header
  -> sub header
  -> scroll content
  -> footer / actions
```

重点是 header、content、footer 三层必须清晰，不要把按钮直接塞进滚动内容里。

## 设备与变体规则

- 桌面上的 Popover 更适合小型上下文操作。
- 手机上很多 picker 和 action sheet 会退化为 Dialog。
- `ActionSheet` 在手机上明显更接近 bottom sheet。
- `BusyDialog`、`MessageDialog` 这类特化弹层仍复用同一 dialog 外壳，只是内容组织不同。

## 复刻建议

- 统一 `modal / non-modal / popover / action-sheet` 的基础浮层框架。
- 用同一套 surface、radius、shadow 和 focus token 驱动所有弹层。
- 把语义状态落在 header shadow 或 state accent 上，不要重新发明一套整屏配色。
- 桌面和手机不要只缩放同一弹层，应允许切换成不同布局策略。

## 主要实现来源

- `resources/sap/m/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
