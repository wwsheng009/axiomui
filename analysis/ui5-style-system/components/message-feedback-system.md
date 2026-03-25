# Message 与 Feedback 系统

## 角色定位

UI5 的反馈系统不是单一的“弹个错误提示”，而是按上下文分成内联消息、页面级反馈、对话框反馈、通知列表和输入式反馈。它们共享同一套语义颜色，但在信息密度和打断程度上有明确层级。

## Inline Message

`MessageStrip` 是最典型的内联反馈容器：

- 外框使用 `sapMessage_BorderWidth`，圆角继承 `sapPopover_BorderCornerRadius`。
- 默认 padding 约 `.4375rem 1rem`，最小高度约 `2rem`。
- 图标槽宽约 `2.5rem`。
- 文本区最大高度约 `10rem`，超出后内部滚动。
- 可关闭版本会给文本区预留额外右侧空间。

它说明 UI5 期望内联消息能直接嵌入页面和列表，而不是总靠 toast 或 modal。

## Page 与 Dialog Feedback

`MessagePage` 和 `MessageDialog` 承担更高层级的反馈：

- `MessagePage` 内层 padding 约 `1rem`，主内容宽度约 `30rem`。
- `MessagePage` 图标常见字号约 `6rem`。
- `MessagePage` 主标题走 `Header2` 级别语气，说明文字走次级标题语气。
- `MessageDialog` 内容区固定带 `1rem` padding。
- `MessageBox` / `MessageDialog` 的 header shadow 会跟随 `information / warning / error / success / question` 语义变化。

这意味着 UI5 的高层反馈仍然遵循统一表面系统，而不是独立设计一套“错误页风格”。

## Feedback Input 与 Notification

反馈不只有展示，还包括输入和后续处理：

- `FeedInput` 左侧头像列占位明显，整体左 padding 约 `5rem`。
- `FeedInput` 输入区最小高度约 `4rem`。
- 发送按钮容器高度约 `3.75rem`，内部按钮保持标准 button 语言。
- `NotificationList` 仍复用 list group header 和 list background，而不是重新发明卡片表面。

## 复刻约束

- 语义颜色统一来自主题 token，不要为消息系统另起一套红黄绿蓝。
- 内联反馈、页面反馈、模态反馈要区分打断级别。
- 反馈输入区应延续 field 和 button 的标准语言，而不是变成另一种组件风格。
- 消息内容、链接、图标在高对比配色下都要同步调整对比度。

## 主要实现来源

- `resources/sap/m/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
