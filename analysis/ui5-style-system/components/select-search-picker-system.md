# Select、Search 与 Picker 系统

## 角色定位

这组组件覆盖“闭合时像字段，展开后像选择面板”的交互族，包括 `Select`、`ComboBox`、`SearchField`、建议列表、日期时间选择器和值帮助类 picker。它们不是孤立控件，而是字段系统和弹层系统之间的桥梁。

## 关键尺寸与实现信号

- `SearchField` 高度约 `2.75rem`。
- `SearchField` 内部按钮尺寸约 `2.25rem`。
- `SearchField` 的 placeholder 明确走 italic 语气，而不是浏览器默认普通体。
- `SelectList` 条目高度约 `2.5rem`，compact 下约 `2rem`。
- `SuggestionsPopover` 普通项最小高度约 `2.5rem`，compact 下约 `2rem`。
- `SuggestionsPopover` 分组项高度约 `2.75rem`。

这些参数反映出 UI5 的基本判断：闭合态要延续 field 语言，展开态要立即切入 list row 语言。

## 交互模型

- 闭合态以 field wrapper 为主，箭头、搜索、清空等图标占据固定尾部槽位。
- 展开态通常进入 `SelectList`、建议列表或专用 picker 面板。
- `SearchField` 虽然看起来更轻，但仍消费 field token，只是边界处理更偏搜索语境。
- 手机上同一交互可能从 `Popover` 退化为 `Dialog`，但不改变字段和行项的基本视觉语言。

## 复刻约束

- 选择器闭合态和普通输入框必须共用一套 field token。
- 展开面板不要单独发明列表视觉，应直接复用列表/表格的 row state 系统。
- 搜索图标、清除图标、下拉箭头和值状态 icon 都应进入统一的尾部槽位模型。
- 不要把 `Select`、`SearchField`、`ComboBox` 做成三套完全不同的组件，它们在 UI5 中明显共享一套视觉骨架。

## 新项目落地建议

- 先实现一个标准 field wrapper。
- 在此基础上扩展 `search`、`select`、`suggestion`、`picker-trigger` 四类行为。
- 展开层直接复用 `Popover` 和 `Dialog` 基础框架。
- 列表项、键盘焦点、选中态全部走统一 row token。

## 主要实现来源

- `resources/sap/m/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
