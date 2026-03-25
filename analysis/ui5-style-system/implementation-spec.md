# UI5 风格复刻执行规格

## 文档定位

这份文档把 `themes/`、`layouts/`、`components/` 目录中的分析结论收束成一份可执行规格，用来回答 4 个实际问题：

- 新项目如果要复刻 `sap_horizon` 风格，第一期到底该做哪些东西。
- 哪些底层文件是实现时的单一事实来源。
- 做到什么程度可以算“同风格”，做到什么程度才接近“同样式”。
- 组件、布局、密度、响应式、RTL 和无障碍应如何进入开发排期与验收清单。

这份文档不替代已有拆分文档，而是把它们变成开发、设计和验收都能直接使用的执行层说明。

## 目标等级

复刻目标建议分成 3 档，不要一开始把“风格接近”和“像素级一致”混在一起。

| 等级 | 目标 | 达标标准 |
| --- | --- | --- |
| L1 设计语言一致 | 做出明显属于 UI5 Horizon 体系的界面 | 颜色、字体、圆角、阴影、间距、密度、焦点、语义色、页面节奏一致 |
| L2 交互与状态一致 | 做出与 UI5 近似的组件与状态反馈 | hover、active、focus、selected、disabled、value state、popover/dialog 降级策略一致 |
| L3 像素与异常一致 | 尽量逼近 SDK 现状 | 需要逐状态 token 表、视觉基准截图、浏览器/设备例外、更多内部结构细节 |

按当前 `ui5-style-system` 文档的完成度，已经足以支持 L1，并且对 L2 有很强支撑；如果目标是 L3，还需要继续补截图、状态矩阵和异常规则。

## 单一事实来源

如果后续需要确认“文档怎么落到真实实现”，应优先沿着下面这条链路取证：

| 层级 | 主来源 | 作用 |
| --- | --- | --- |
| 抽象参数模型 | `resources/sap/ui/core/themes/base/base.less` | 定义系统支持哪些设计参数 |
| Horizon 主题取值 | `resources/sap/ui/core/themes/sap_horizon/base.less` | 给抽象参数赋现代主题的具体值 |
| 全局语义映射 | `resources/sap/ui/core/themes/base/global.less`、`resources/sap/ui/core/themes/sap_horizon/global.less` | 把 `sap*`、`sapUi*`、`--sap*` 语义链路接起来 |
| 组件库源码聚合 | `resources/sap/m/themes/base/library.less`、`resources/sap/f/themes/base/library.less`、`resources/sap/tnt/themes/base/library.less`、`resources/sap/ui/layout/themes/base/library.less` | 查看组件结构、状态与布局规则 |
| 最终 token 快照 | `resources/*/themes/*/library-parameters.json` | 查看当前主题最终落地的参数值 |
| 最终 CSS 交付 | `resources/*/themes/*/library.css`、`library-RTL.css` | 校对最终视觉结果，而不是作为第一开发入口 |

执行原则只有一条：

- 先复刻 token 与结构约束，再复刻组件样式，最后校对最终 CSS 表现。

## 必交付物

如果目标是做一套可维护的新项目样式系统，第一期至少应交付下面这些内容，而不是只产出零散组件 CSS。

### 1. 主题与 token 层

- 一套 foundation token，承载品牌色、表面色、文字色、语义色、焦点色、阴影、圆角、间距和断点。
- 一套 semantic token，把错误、警告、成功、信息、选中、禁用、聚焦等语义统一抽象。
- 一套 UI5 compatibility alias，用于保留 `sap*` / `sapUi*` / `--sap*` 的对照关系。
- 一套 component token，把按钮、字段、列表、弹层、卡片、导航、消息系统落到组件级变量。

### 2. 系统变体层

- `cozy` 与 `compact` 两种密度模式。
- `phone / tablet / desktop / xl` 四档断点。
- `ltr / rtl` 双方向支持。
- 高对比主题入口，第一期即便不完整，也要预留独立 token 覆盖点。

### 3. 组件族样式层

- 按组件族而不是单控件堆 CSS。
- 每个组件族要有基础结构、变体、状态和上下文语境。
- 页面壳层、工具栏、页头、弹层、卡片、消息区应作为系统层处理，而不是业务页面临时拼装。

### 4. 验证资产

- 一套组件状态展示页。
- 一套密度模式展示页。
- 一套响应式断点展示页。
- 一套 RTL 展示页。
- 至少一轮视觉回归截图或人工对照清单。

## 全局实现约束

以下约束是 UI5 风格能否“成立”的关键，不满足这些约束，即使颜色和圆角看起来接近，结果也只能算表面相似。

- 组件里不要直接写业务常量色，优先消费 foundation、semantic 和 component token。
- `focus` 必须是一级能力，不能用 hover 或浏览器默认 outline 代替。
- `selected`、`disabled`、`readonly`、`error / warning / success / information` 不能靠临时加一个类名补丁收尾。
- 字段系统必须把 wrapper 当成视觉边界，而不是把所有状态直接压到原生输入框上。
- 列表、表格、建议列表、通知列表必须共享行状态语言。
- 工具栏按钮、页头按钮、壳层按钮应该复用按钮系统，只通过语境调整轻重。
- Dialog、Popover、Action Sheet、Picker 共享浮层框架，但允许设备级降级。
- 密度模式必须联动高度、padding、图标槽、行高和页头高度，不能只改字体。
- RTL 要优先靠逻辑方向属性处理，避免把 `left / right` 当成默认开发方式。
- 响应式要同时作用于布局和组件，不能只有页面容器变而内部控件节奏不变。

## 全局状态矩阵

并不是每个组件都需要全部状态，但每个组件族至少要明确自己适用哪些状态，以及每个状态由什么表达。

| 状态 | 适用对象 | 最低要求 |
| --- | --- | --- |
| `default` | 全部组件 | 有稳定的基准表面、边框、文字和间距 |
| `hover` | 桌面交互组件 | 增强可感知，但不能破坏整体克制感 |
| `active / pressed` | 按钮、行项、导航项、可点击卡片 | 比 hover 更明确，文本、边框或背景至少一项可见变化 |
| `focus-visible` | 键盘可达组件 | 使用系统级 focus ring，浅底深底都要可见 |
| `selected / toggled` | 按钮、tab、row、navigation item、token | 不能只靠文字加粗表达 |
| `disabled` | 全部交互组件 | 保留空间占位，统一降噪，不破坏布局 |
| `readonly` | 字段与输入型控件 | 保留边界和对齐，只降低可编辑感 |
| `value state` | 字段、消息、对话框、反馈组件 | `error / warning / success / information` 各自独立 |
| `busy / loading` | 卡片、弹层、页面、复杂列表 | 不改变基础骨架，允许 shimmer 或占位层 |
| `shell context` | ShellBar、ToolHeader、壳层内 tab 与按钮 | 与页面语义一致，但语气更轻、更壳层化 |

## 组件族执行范围

下面这张表是第一期开发范围的推荐下限。只要项目目标是 L1 或 L2，就不建议继续往下缩。

| 组件族 | 第一批必须实现 | 关键 token / 参数信号 | 主来源 |
| --- | --- | --- | --- |
| Button | `default / emphasized / positive / negative / attention / transparent / icon-only / disabled / selected` | `sapButton_Background`、`sapButton_BorderColor`、`sapButton_Hover_Background`、`sapButton_Active_Background`、`sapButton_Active_TextColor` | `sap/m/themes/base/library.less` 的 `Button.less`，`sap/m/themes/sap_horizon/library-parameters.json` |
| Field / Input | 标准输入框、带前后图标字段、`TextArea`、只读、禁用、四类 value state | `sapField_TextColor`、`sapField_PlaceholderTextColor`、`_sap_m_InputBase_InnerPadding`、`_sap_m_InputBase_IconWidth`、`_sap_m_InputBase_FocusBorderRadius`、`_sapMTextAreaPadding` | `InputBase.less`、`TextArea.less`、`DatePicker.less`、`TimePicker.less`、`StepInput.less` |
| Select / Search / Picker | `Select`、`SearchField`、`ComboBoxBase`、建议列表、picker 展开层 | `_sap_m_SearchField_Height`、`_sap_m_SearchField_ButtonSize`、`_sap_m_SearchField_PlaceholderFontStyle`、`_sap_m_SelectList_ItemHeight`、`_sap_m_SuggestionsPopover_ItemMinHeight` | `SearchField.less`、`Select.less`、`SelectList.less`、`ComboBoxBase.less`、`SuggestionsPopover.less` |
| List / Table | 基础 row、单选/多选、hover、selected、active、navigated、popin | `sapList_Background`、`sapList_SelectionBorderColor`、`_sap_m_table_SelectionControlWidth`、`_sap_m_ListItemBase_Focus_Outline`、`_sap_m_ListItemBase_Navigated` | `ListItemBase.less`、`Table.less`，`sap/m/themes/sap_horizon/library-parameters.json` |
| Dialog / Popover | `dialog / message dialog / popover / action sheet` 基础壳层与 header/footer 结构 | `_sap_m_Dialog_BarHeight`、`_sap_m_Dialog_Padding`、`_sap_m_Dialog_SuccessHeaderShadow`、`_sap_m_Popover_ArrowOffset`、`_sap_m_Popover_OpacityTransitionDuration` | `Dialog.less`、`Popover.less`、`ActionSheet.less`、`MessageBox.less` |
| Card | 普通卡片、交互卡片、透明卡片、无头卡片、底部 header 卡片、消息/加载占位 | `sapTile_Background`、`sapTile_BorderColor`、`sapTile_BorderCornerRadius`、`sapContent_Shadow0`、`sapContent_Shadow2`、`_sap_f_Card_ContentPadding`、`_sap_f_Card_FocusBorderRadius` | `sap/f/themes/base/library.less` 的 `Card.less`，`sap/f/themes/base/library-parameters.json` |
| Toolbar / Header | 轻量 toolbar、结构性 bar/header、ShellBar、ToolHeader、DynamicPageTitle actions bar | `_sap_m_Toolbar_Height`、`_sap_m_Toolbar_ShrinkItem_MinWidth`、`_sap_f_ShellBar_PaddingDesktop`、`_sap_f_ShellBar_PaddingTablet`、`_sap_f_ShellBar_PaddingPhone`、`_sap_tnt_ToolHeader_Height`、`_sap_tnt_ToolHeader_Padding` | `Bar.less`、`Toolbar.less`、`OverflowToolbarAssociativePopover.less`、`ShellBar.less`、`DynamicPageTitle.less`、`ToolHeader.less` |
| Tabs / Navigation | `IconTabBar` 的 text only、icon only、horizontal、vertical、overflow、badge | `_sap_m_IconTabBar_HeaderMinHeight`、`_sap_m_IconTabBar_TextOnlyVerticalHeight`、`_sap_m_IconTabBar_NoTextVerticalHeight`、`_sap_m_IconTabBar_HorizontalTabHeight`、`_sap_m_IconTabBar_Overflow_BorderRadius`、`_sap_m_IconTabBar_Badge_*` | `IconTabBar.less`，必要时补 `sap/tnt` 导航相关实现 |
| Message / Feedback | `MessageStrip`、`MessagePage`、`MessageDialog / MessageBox`、`FeedInput`、`NotificationList` | `sapMessage_BorderWidth`、`sapPopover_BorderCornerRadius`、`_sap_m_MessageBox_InformationShadow`、`_sap_m_MessageBox_ErrorShadow`、`_sap_m_FeedInput_BackgroundColor`、`_sap_m_NotificationListBase_ItemBackground` | `MessageStrip.less`、`MessagePage.less`、`MessageBox.less`、`MessageView.less`、`FeedInput.less`、`NotificationListBase.less`、`NotificationListGroup.less`、`NotificationListItem.less` |

## 布局与壳层执行范围

组件复刻要落地，布局系统必须同时推进，否则组件会在页面层失真。

### App Shell 与顶部壳层

- 以 `sap.f.ShellBar` 为全局壳层基准。
- 桌面、平板、手机的左右 padding 明显不同，优先消费 `_sap_f_ShellBar_PaddingDesktop / Tablet / Phone`。
- 壳层按钮延续按钮系统，但语气比页面按钮更轻。
- 壳层搜索框延续字段语言，不要另做一套搜索组件。

### Page / Dynamic Page

- 页面统一拆成 `header / subheader / content / footer` 四层。
- `DynamicPageTitle` 与 `DynamicPageHeader` 必须保留结构区分。
- 浮动页脚必须有显式预留空间。
- 标题区应比内容区更高一层，不应和内容滚动区混成同一层。

### Form / Responsive Grid

- 表单布局必须由统一 grid 驱动，而不是页面自己写一层 flex。
- 至少兼容 `sapUiRespGridMedia-Std-Phone`、`Tablet`、`Desktop`、`LargeDesktop` 四档媒体类逻辑。
- 标签列、字段列、组标题、工具栏高度在密度切换时要同步变化。
- Compact 下不能只压缩字段高度而忽略标签与标题节奏。

## 推荐实施顺序

为了尽快得到“看起来就对”的结果，建议按下列顺序推进，而不是 9 个组件族并行开工。

### 第一阶段

- 主题基础：`theme-architecture.md`、`horizon-baseline.md`、`token-mapping.md`
- 系统变体：`density-modes.md`、`accessibility-responsive-rtl.md`
- 原子组件：按钮、字段
- 页面基本骨架：page、dynamic page

### 第二阶段

- 选择器与建议列表
- 列表与表格行状态系统
- dialog / popover 浮层框架
- 表单与 responsive grid

### 第三阶段

- card
- toolbar / header / shellbar / toolheader
- tabs / navigation
- message / feedback

### 第四阶段

- 高对比主题
- 更细的组件例外规则
- 视觉回归截图基线
- 浏览器与设备特例

## 验收清单

下面这份清单适合直接进入 PR 检查或交付评审。

### 主题与 token

- 组件样式没有直接写死品牌蓝、错误红、成功绿等业务常量色。
- 颜色、圆角、阴影、间距、焦点、断点都有统一 token。
- `sap*` 与项目自定义 token 之间存在清晰映射。

### 组件状态

- 所有一线交互组件都有 `default / hover / active / focus-visible / disabled`。
- 需要选中态的组件都实现了 `selected`，而且不是只靠文字加粗表达。
- 字段和反馈组件都有 `error / warning / success / information`。
- 列表、表格、建议列表、通知项共享同一行状态语言。

### 密度与响应式

- Cozy 与 Compact 切换后，按钮、字段、列表、toolbar、footer 明显一起收缩。
- 手机、平板、桌面页面 padding 明显不同。
- 表单标签与字段在不同断点下仍然对齐。

### 无障碍与方向

- 键盘 Tab 能完整走通主交互链。
- focus ring 在浅底与深底上都清晰可见。
- `dir='rtl'` 下图标、箭头、导航、标题区对齐仍然合理。
- 高对比即便未完整上线，也预留了覆盖入口。

### 页面级结果

- 顶部壳层、页面头部、内容区、浮层、卡片、反馈区在视觉层级上关系明确。
- 主操作、危险操作、信息提示、错误反馈的语义层次清晰。
- 页面整体气质仍然是克制的企业工作台，而不是营销站式装饰化界面。

## 如果目标升级到像素级复刻

当前文档体系已经足以支持“同风格”与大部分“交互接近”，但若项目目标升级到 L3，还应继续补以下资料：

- 每个组件族完整的 token 清单，而不是只保留关键 token。
- 每个组件变体在 `default / hover / active / focus / disabled / selected` 下的逐项颜色、边框、阴影与文字矩阵。
- Cozy、Compact、Phone、Tablet、Desktop、XL 的逐组件尺寸表。
- 典型页面与组件的视觉基准截图。
- 浏览器差异、设备降级、组合状态叠加规则。
- 更细的内部结构说明，例如 overflow、popin、shell context、message nesting、picker on phone 的特殊布局。

## 与现有文档的配合方式

建议按下面顺序使用这套资料：

1. 先看 `themes/` 目录，建立 token、密度、无障碍和 RTL 认知。
2. 再看 `layouts/` 目录，确定壳层、页面、表单、卡片布局骨架。
3. 然后看 `components/` 目录，理解组件族边界与关键状态。
4. 最后回到本文，把分析结论落成开发任务、实现顺序和验收清单。

如果团队后续要继续深化文档，优先补的不是“再拆更多组件名”，而是：

- 组件级 token 表
- 状态矩阵
- 视觉基准截图
- 例外与降级规则

