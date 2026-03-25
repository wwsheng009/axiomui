# List 与 Table 系统

## 角色定位

列表和表格是 UI5 企业工作台感最强的一组组件。真正稳定的核心不是某个表格 DOM，而是 `sapMLIB` 这套“行状态内核”：hover、selected、active、focus、highlight、navigated、separator 和 popin 都围绕它组织。

## 行状态模型

- hover 使用 `sapList_Hover_Background` 一类中性背景。
- selected 使用独立的选中背景，而不是简单复用 hover。
- `selected + hover` 有自己的叠加规则，不能退化成普通 hover。
- active 使用更强的背景和文本反差，强调行被按下或执行中。
- highlight / navigated 这类左侧状态条会随着 focus 和行状态一起变化。

这说明 UI5 把“行”视为一个完整交互单元，而不是若干独立单元格的集合。

## 关键尺寸与结构信号

- 表格选择列宽度约 `2.75rem`。
- popin 子内容常见 padding 约 `.5rem 1rem`。
- popin 行内标签使用 `sapContent_LabelColor`，值区使用 `sapList_TextColor`。
- 交替行背景使用 `sapList_AlternatingBackground`。
- 分隔线支持 `none / inner / all` 三种策略。

## 复刻约束

- 先建立行状态系统，再去实现具体列表、表格、网格列表。
- 多选、单选、导航、详情删除等左侧或右侧槽位必须统一宽度，不要每种列表自定义。
- popin 不应被当成另一套组件，它只是窄屏下的行内容重排。
- 紧凑模式要收缩高度和内边距，但不能丢掉 focus、selected 和 separator 逻辑。

## 新项目落地建议

- 把 list row 做成一个基础组件，表格行、通知项、选择列表项都从它派生。
- 统一 `hover / selected / active / focus / disabled / unread / navigated` 的 token。
- 先确定分隔线策略，再决定视觉密度，不要把 border 当成最终补丁。
- 如果要做移动端适配，优先实现 popin 样式，而不是直接删列。

## 主要实现来源

- `resources/sap/m/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
