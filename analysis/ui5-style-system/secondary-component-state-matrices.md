# 第二批组件状态矩阵

## 文档定位

这份文档延续 `core-component-state-matrices.md` 的写法，把第二批四组组件族继续压到可直接实现和验收的状态规格：

- Card
- Toolbar / Header / ShellBar
- Tabs / Navigation
- Message / Feedback

它不再重复解释“为什么这些组件重要”，重点还是回答同样四个问题：

- 这些组件最少要覆盖到哪些状态或语境。
- 每个状态主要靠什么视觉信号表达。
- 实现时优先对齐哪些 token 族。
- 哪些地方最容易被误做成看起来像、但系统语言已经跑偏。

## 使用方式

建议把这份文档和以下资料配合阅读：

- 第一批状态矩阵：`core-component-state-matrices.md`
- 组件族边界与结构说明：`components/*.md`
- 实现顺序、范围和验收总则：`implementation-spec.md`
- 颜色、阴影、圆角、密度和焦点基线：`themes/*.md`

阅读顺序建议如下：

1. 先看对应组件族文档，理解结构、变体和上下文。
2. 再看 `core-component-state-matrices.md`，建立第一批核心状态基线。
3. 然后看本文，把第二批 surface、顶部区、导航和反馈系统收束成可实现矩阵。
4. 最后回到 `implementation-spec.md`，把矩阵拆成开发任务和验收项。

## 矩阵约定

本文字段含义与第一份状态矩阵文档保持一致：

| 字段 | 含义 |
| --- | --- |
| 状态 | 组件必须覆盖的交互、语义或布局状态 |
| 视觉信号 | 用户能直接感知到的背景、边框、阴影、焦点、图标、文字、层级变化 |
| 主要 token 族 | 实现时优先对齐的 token 族，不等于完整 token 清单 |
| 实现备注 | 最容易漏做或误做的地方 |

这里还有一个第二批组件特有的前提：

- 这四组组件的 token 来源分散在 `sap/m`、`sap/f`、`sap/tnt` 和 `sap/ui/core`。
- 尤其是 shell、navigation、message 和 card 的一部分颜色与焦点语义，既不只在一个 `library-parameters.json`，也不只在某一个组件 less 里。
- 所以本文中的 token 族应理解为“主要实现入口和对照入口”，不是“把这些变量抄出来就能独立完成全部实现”。

## Card

### 状态矩阵

| 状态 / 变体 | 视觉信号 | 主要 token 族 | 实现备注 |
| --- | --- | --- | --- |
| `default` | 卡片表面有明确背景、边框、圆角和基础阴影，header / content / footer 分层清晰 | `sapTile_Background`、`sapTile_BorderColor`、`sapTile_BorderCornerRadius`、`sapContent_Shadow0`、`_sap_f_Card_ContentPadding`、`_sap_f_Card_HeaderBorder` | card 是 surface 组件，不是一个随手包内容的白色容器 |
| `interactive hover` | 整卡抬升为更强阴影，文字与标题沿用同一内容层，不额外加粗描边 | `_sap_f_Card_HoverBoxShadow`、`sapContent_Shadow2` | hover 主要靠 elevation 变化，不应把边框厚度做成按钮化反馈 |
| `section hover` | 可点击 section 在卡片内部局部刷入 hover 背景 | `sapTile_Hover_Background` | section interactive 是卡片内部状态，不应误做成整卡 hover 的重复实现 |
| `section active` | 可点击 section 切到 active 背景，反馈强于 hover | `sapTile_Active_Background` | active 要落在局部可点击区域，不要把全卡都压成按下态 |
| `focus-visible` | 卡片外壳绘制系统 focus ring，offset 与圆角贴合外轮廓 | `_sap_f_Card_FocusBorderWidth`、`_sap_f_Card_FocusBorderRadius`、`_sap_f_Card_FocusBorder*Offset`、`sapContent_Focus*` | 焦点不能只给浏览器默认 outline，也不能因为交互卡片用了 hover 阴影就不画 focus |
| `header focus` | header top row 单独出现 focus 边界，不与全卡 focus 重叠 | `_sap_f_CardHeaders_HeaderFocusBorder*Offset`、`sapContent_Focus*` | header toolbar 已聚焦时要避免双重描边 |
| `loading / placeholder` | 保留原卡片骨架，在 header / content 内显示 shimmer 与占位块 | `_sap_f_Card_Background_Placeholder_Color`、`_sap_f_Card_Placeholder_Gradient` | loading 不是把整张卡替换成 spinner，骨架必须保留 |
| `content message` | 内容区内部出现绝对定位的消息层，消息本身有独立阴影 | `sapContent_Shadow*`、`_sap_f_Card_ContentPadding` | 消息层应留在 card 内部解决，不要弹出成独立页面级反馈 |
| `transparent` | 去掉背景、边框、圆角和阴影，退化成布局级卡片骨架 | 透明语境规则、`sapTile_*` 卡片基线 | transparent 是合法变体，不是“临时把样式清空” |
| `no header / bottom header` | 圆角与分隔线重新分配到 content 和 header，上下顺序可切换 | `_sap_f_Card_BorderRadius`、`_sap_f_Card_HeaderBorder` | 这只是同一外壳的结构变体，不要再拆一套 bottom-card 组件 |

### 结构与分层

```text
card
  -> header / filter bar
  -> content surface
  -> footer
  -> loading placeholder
  -> content message overlay
```

实现时要保证：

- header、filter bar、content、footer 共享同一张 surface 语言。
- `sapFCardContentMessageContainer` 是覆盖在内容区内部的消息层，不是额外包裹外层容器。
- interactive card 与 section interactive 共享同一套圆角和 tile 背景语义。
- `transparent`、`no header`、`bottom header` 只是壳层重排，不是另一套视觉皮肤。

### 尺寸与骨架

| 项 | 主要值 | 说明 |
| --- | --- | --- |
| 外层圆角 | `var(--sapTile_BorderCornerRadius)` | surface 轮廓基线 |
| 默认阴影 | `var(--sapContent_Shadow0)` | 静态卡片基线 |
| hover 阴影 | `var(--sapContent_Shadow2)` | 交互卡片抬升层级 |
| 内容 padding | `1rem` | 卡片内层通用呼吸空间 |
| Filter Bar padding | `.5rem 1rem` | 过滤区与内容区节奏一致 |
| Header 标题字号 | `.875rem` | 与 card header 字气保持一致 |
| Focus border 宽度 | `1px` | 贴合系统 focus ring |
| Message overlay padding | `1rem` | 内容消息层不应贴边 |

### 实现红线

- 静态 card、交互 card、透明 card 必须共用一套 surface token，而不是三套近似样式。
- loading、message、empty state 都应在 card 内部解决，不能靠外层容器再包一层补丁。
- header focus 与 full-card focus 要能互相避让，避免双 focus ring。
- section hover / active 必须和整卡 hover 区分开，否则交互层级会混乱。

### 主要来源

- `resources/sap/f/themes/base/library.less` 中的 `Card.less`、`CardHeaders.less`
- `resources/sap/f/themes/sap_horizon/library-parameters.json`
- `resources/sap/ui/core/themes/sap_horizon/base.less`

## Toolbar / Header / ShellBar

### 状态 / 语境矩阵

| 状态 / 语境 | 视觉信号 | 主要 token 族 | 实现备注 |
| --- | --- | --- | --- |
| `default toolbar` | 统一高度、标准左右 padding、动作项按固定间距排列 | `sapToolbar_Background`、`_sap_m_Toolbar_Height`、`_sap_m_Toolbar_ShrinkItem_MinWidth` | toolbar 是动作轨道，不是结构性页面头 |
| `transparent toolbar` | 去掉自身背景，保留原有高度、间距和 overflow 规则 | `sapMTB-Transparent-CTX` 与透明语境规则 | transparent 只改变 surface，不改变布局骨架 |
| `solid / header toolbar` | 保留底部分隔线或 list header 背景，形成结构边界 | `sapGroup_TitleBorderColor`、`sapList_HeaderBackground` | toolbar 的分隔线不能被业务页面随意删掉 |
| `info toolbar` | 背景切到 infobar 语义，高度收束到轻量信息条节奏 | `sapInfobar_Background`、`_sap_m_Toolbar_Height` | info toolbar 是语义条，不是普通 toolbar 换一个颜色 |
| `info toolbar + hover / active` | 只有可点击的信息条才进入 hover / active 背景 | `sapInfobar_Hover_Background`、`sapInfobar_Active_Background` | 非交互 info toolbar 不应表现得像按钮 |
| `page header / structural bar` | 页头有明确背景、文字色和 header shadow，left / middle / right 三段容器完整 | `sapPageHeader_Background`、`sapPageHeader_TextColor`、`sapContent_HeaderShadow` | 结构性 header 不要被简化成一个无语义 flex 容器 |
| `focus-visible` | bar 内图标、按钮或标题区使用系统 focus ring；DynamicPageTitle 自带独立 focus 边界 | `sapContent_Focus*` | bar 自身 focus 与子控件 focus 不能互相覆盖 |
| `shell context` | 背景切到 shell navigation，阴影和标题字气更壳层化 | `sapShell_Navigation_Background`、`sapShell_Shadow`、`_sap_f_ShellBar_PaddingDesktop`、`_sap_tnt_ToolHeader_Height`、`_sap_tnt_ToolHeader_Padding` | shell 是同一动作语言的上层语境，不要另造一套 header 组件 |
| `shell item hover / active` | profile、assistant、overflow 等项在 shell 中使用更轻的 hover / active surface | `sapShell_Hover_Background`、`sapShell_Active_Background`、`sapShell_Assistant_ForegroundColor` | 壳层按钮仍应复用按钮系统，只是切 shell token |
| `search open / full search` | 搜索区扩展占据 shellbar 主空间，其余项隐藏，取消按钮显现 | `_sap_f_ShellBar_SearchHalfMaxWidth`、`_sap_f_ShellBar_PaddingDesktop`、`_sap_f_ShellBar_PaddingTablet`、`_sap_f_ShellBar_PaddingPhone` | full search 是布局状态，不是另一种搜索组件 |
| `overflow / shrink` | shrink item 到最小宽度后进入 overflow，而不是持续挤压标题与搜索区 | `_sap_m_Toolbar_ShrinkItem_MinWidth` | overflow 是 toolbar 一级能力，不能靠 CSS `display:none` 临时藏按钮 |

### 结构约束

```text
header shell
  -> start / navigation
  -> title / middle content
  -> actions / overflow
  -> contextual search / profile / assistant
```

实现时要保证：

- `Toolbar` 负责动作组织和溢出。
- `Bar / Header` 负责 left / middle / right 三段结构。
- `ShellBar / ToolHeader` 负责壳层语境和响应式收缩。
- `DynamicPageTitle` 负责标题、摘要内容和动作区，不应退化成普通 toolbar。

### 尺寸与密度

| 项 | Cozy / 默认 | Compact / 其他语境 | 说明 |
| --- | --- | --- | --- |
| Toolbar 高度 | `3rem` | `2rem` | 默认 toolbar 与 compact toolbar 节奏不同 |
| Info Toolbar 高度 | `2rem` | `2rem` | 语义条本身更轻 |
| Bar / Page Header 高度 | `3rem` | `2rem` | 结构性 header 与 toolbar 共语法、不同职责 |
| Toolbar shrink 最小宽度 | `2.5rem` | `2rem` | 防止溢出前被挤穿 |
| ShellBar 左右 padding | Desktop `3rem` / Tablet `2rem` / Phone `1rem` | 同语义 | 壳层的横向节奏差异必须保留 |
| ShellBar 主标题字号 | `.875rem` | 同语义 | 与第二标题形成明确层级 |
| ToolHeader 高度 | `3.25rem` | shell toolheader `2.75rem` | `sap.tnt` 与 shell 语境不同高 |
| DynamicPageTitle padding | Desktop `0.5rem 2rem 0.5rem 3rem` | Tablet `0.5rem 1rem 0.5rem 2rem` / Phone `0.5rem 0 0.5rem 1rem` | 标题区响应式节奏应与页面边距一起变化 |

### 复用边界

- 页头按钮、壳层按钮、toolbar 按钮应复用按钮系统的 transparent / lite 语境。
- `ToolHeader` 中内嵌的 `IconTabHeader` 会去掉额外 header shadow 和 border，不是重新设计一套 tab。
- `DynamicPageTitle` 的 actions bar 应继续使用 toolbar / button 语言，而不是独立标题动作组件。
- `ShellBar` 搜索区仍应延续 field 和 button 语言，不应做成新搜索框皮肤。

### 实现红线

- 不要把 toolbar、page header、shellbar、toolheader 全部做成一层 flex；三段结构必须保留。
- transparent toolbar 只改变背景，不要顺手改掉高度、overflow 和按钮语义。
- shell context 必须切到 shell token，而不是继续沿用 page header token。
- full search / overflow / shrink 是布局状态，不应通过删 DOM 或写业务特例来“伪实现”。

### 主要来源

- `resources/sap/m/themes/base/library.less` 中的 `Bar.less`、`Toolbar.less`
- `resources/sap/f/themes/base/library.less` 中的 `ShellBar.less`、`DynamicPageTitle.less`
- `resources/sap/tnt/themes/base/library.less` 中的 `ToolHeader.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/f/themes/sap_horizon/library-parameters.json`
- `resources/sap/tnt/themes/sap_horizon/library-parameters.json`

## Tabs / Navigation

### 状态 / 变体矩阵

| 状态 / 变体 | 视觉信号 | 主要 token 族 | 实现备注 |
| --- | --- | --- | --- |
| `default` | tab / nav item 有稳定文字、图标、计数和基准背景 | `sapTab_TextColor`、`_sap_m_IconTabBar_HeaderBackground`、`sapList_TextColor`、`_sap_tnt_NavigationList_IconColor` | tabs 和 side navigation 虽属不同容器，但都应有清晰的基准态 |
| `hover` | tab 文字朝 selected 语气靠近；navigation item 整项进入 row hover 背景 | `_sap_m_IconTabBar_TextHoverColor`、`sapList_Hover_Background`、`_sap_tnt_NavigationList_Collapsed_ItemHoverBoxShadow` | tab hover 不应突然刷满大背景，side nav hover 必须作用于整项 |
| `selected` | tab 通过 indicator / content arrow 明确选中；nav item 用选中背景和边界表达当前位置 | `sapTab_Selected_TextColor`、`sapTab_Selected_Indicator_Dimension`、`sapList_SelectionBackgroundColor`、`sapList_SelectionBorderColor`、`_sap_tnt_NavigationList_Collapsed_SelectedItemBackground` | selected 不能只靠文字变粗完成 |
| `selected + hover` | 已选 tab / nav 在 hover 下仍保留选中语义，不回退成普通 hover | `sapList_Hover_SelectionBackground`、`_sap_tnt_NavigationList_Collapsed_SelectedItemBackgroundHover` | 这是最容易漏写的叠加态 |
| `active / pressed` | navigation item 背景与文字同步进入 active；overflow trigger 走 button active 语义 | `sapList_Active_Background`、`sapList_Active_TextColor`、`sapButton_Active_*`、`_sap_m_IconTabBar_Overflow_*Pressed` | active 必须强于 hover，且图标和文字一起切换 |
| `focus-visible` | tab header item、overflow item、select list item、navigation item 都有独立 focus ring | `sapContent_Focus*`、`_sap_m_IconTabBar_HeaderFocusBorder*`、`_sap_m_IconTabBar_List_Focus_Offset`、`_sap_tnt_NavigationList_ItemFocusBorderOffset`、`_sap_tnt_NavigationList_ItemFocusBorderRadius` | focus ring 不能被选中指示器或折叠态遮住 |
| `disabled / unselectable` | 整项透明度下降，cursor 退化，但几何与间距保留 | `_sap_m_IconTabBar_DisabledOpacity`、`sapContent_DisabledOpacity` | disabled 不应导致 tab 宽度或 nav 槽位塌缩 |
| `overflow trigger` | overflow 按钮延续 button 胶囊、hover、active、focus 语言 | `_sap_m_IconTabBar_Overflow_BorderRadius`、`_sap_m_IconTabBar_Overflow_BackgroundColor`、`_sap_m_IconTabBar_Overflow_BorderColorHover`、`_sap_m_IconTabBar_Overflow_BorderColorPressed` | overflow trigger 是 tab 系统一部分，不是旁路菜单按钮 |
| `badge / semantic count` | badge 附着在 text / icon / count 上，用 neutral / positive / critical / negative 色表达 | `_sap_m_IconTabBar_Badge_*`、`sapNeutralElementColor`、`sapPositiveElementColor`、`sapCriticalElementColor`、`sapNegativeElementColor` | badge 要内建到布局里，不能靠业务绝对定位补丁 |
| `shell context` | tab 头和 overflow 切到 shell 导航背景、文字和选中指示器语义 | `_sap_m_IconTabBar_Shell*`、`sapShell_Navigation_*` | shell tabs 是同一套组件换语境，不应另做“shell tabs” |
| `collapsed navigation` | side nav 收到窄宽度后默认只留图标，hover / focus 时展开浮现文字与阴影 | `_sap_tnt_NavigationList_CollapsedWidth`、`_sap_tnt_NavigationList_Collapsed_HoverOrFocus*`、`_sap_tnt_NavigationList_Collapsed_SelectedItemBackground` | collapsed 是状态化布局，不是切换到另一套 icon rail 组件 |

### 结构与复用边界

```text
tab bar
  -> header strip
  -> item (icon / text / count / badge)
  -> selected indicator / content arrow
  -> overflow trigger
  -> content container

navigation list
  -> group / item
  -> child item
  -> expander / external link
  -> selection indicator
```

实现时要保证：

- `IconTabBar` 的 text only、no text、horizontal、vertical 是同一导航系统的模式切换。
- `NavigationList` 的 expanded、collapsed、popup overflow 是同一项导航的不同布局状态。
- overflow 按钮、expander、external link icon 都要纳入同一 focus 与 selected 语言。
- select list / overflow list 仍应复用 row 状态系统，而不是再造一套列表皮肤。

### 尺寸与密度

| 项 | Cozy / 默认 | Compact | 说明 |
| --- | --- | --- | --- |
| IconTabBar header 最小高度 | `2.75rem` | 同语义 | header 基线不能丢 |
| Text Only 垂直高度 | `3rem` | `3rem` | 纯文字模式也要保留 indicator 空间 |
| No Text 垂直高度 | `3.75rem` | `3rem` | 图标 tab 需要更高竖向空间 |
| Horizontal Tab 高度 | `2.75rem` | `3rem` 水平壳层语境 | 水平模式不是普通 text only 的压扁版 |
| Filter Icon 宽高 | `2.75rem` | `2rem` 级别 | 图标 tab 的命中区域不能太小 |
| Overflow 圆角 | `.75rem` | `.75rem` | 与 button 胶囊语气一致 |
| Navigation item 高度 | `2.75rem` | `2rem` | shell / side nav 的主行高 |
| Collapsed 宽度 | `4rem` | `4rem` | Horizon 下折叠态仍保留足够命中面 |
| Navigation item 圆角 | `.375rem` | `.375rem` | 选中、focus、hover 共用同一轮廓 |

### 实现红线

- 选中态必须有可见 indicator 或选中背景，不能只靠文字色变化。
- overflow trigger 要继承 button 的 hover / active / focus，不要另做一颗看起来不属于系统的胶囊。
- shell context 与 page context 应共结构、不同 token，不能拆成两套完全不同的 tabs。
- side navigation 折叠态下的 hover / focus 展开必须与 selected、focus 同时成立，不能互相覆盖。

### 主要来源

- `resources/sap/m/themes/base/library.less` 中的 `IconTabBar.less`、`IconTabBarSelectList.less`
- `resources/sap/tnt/themes/base/library.less` 中的 `NavigationList.less`、`SideNavigation.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/tnt/themes/sap_horizon/library-parameters.json`
- `resources/sap/ui/core/themes/sap_horizon/base.less`

## Message / Feedback

### 状态 / 反馈层级矩阵

| 状态 / 层级 | 视觉信号 | 主要 token 族 | 实现备注 |
| --- | --- | --- | --- |
| `inline information / success / warning / error` | MessageStrip 用独立背景、边框和图标色表达四类语义 | `sapMessage_BorderWidth`、`sapPopover_BorderCornerRadius`、`sapNeutralBackground`、`sapNeutralBorderColor`、`sapSuccessBackground`、`sapWarningBackground`、`sapErrorBackground`、`sapNeutralElementColor`、`sapPositiveElementColor`、`sapCriticalElementColor`、`sapNegativeElementColor` | 内联反馈不能只换一个图标，背景和边框语义必须一起到位 |
| `closable / dismissing` | 文本区给关闭按钮预留空间，关闭时组件淡出 | `sapMessage_Button_Hover_Background` 与 message strip 关闭过渡规则 | closable 不能让文本与关闭按钮重叠，关闭也不能瞬间抽走布局 |
| `indication color set` | ColorSet1 / ColorSet2 下，文字、链接、图标、按钮和 focus 会同步切对比色 | `sapIndicationColor_*`、`sapContent_ContrastTextColor`、`sapContent_ContrastIconColor`、`sapContent_ContrastFocusColor`、`sapLink_SubtleColor` | 这类彩色 strip 最容易只改背景，结果对比度崩掉 |
| `page feedback` | MessagePage 居中列布局、大图标、主标题、副说明和按钮区层次清晰 | `sapBackgroundColor`、`sapGroup_TitleTextColor`、`sapContent_LabelColor`、`sapContent_NonInteractiveIconColor` | page feedback 是页面级反馈，不应退化成一个超大 message strip |
| `feed input default` | 左侧头像槽、内容背景、输入区、发送按钮形成完整 composer | `sapGroup_ContentBackground`、`sapField_TextColor`、`sapField_PlaceholderTextColor`、`sapButton_Background`、`sapButton_BorderColor`、`sapButton_TextColor` | feed input 应延续 field + button 语言，而不是变成另一种编辑器皮肤 |
| `feed input disabled` | composer 整体降噪，交互退出，但结构和高度保留 | `sapContent_DisabledOpacity` | 禁用不能只关掉发送按钮，输入区和头像槽也应同步退化 |
| `notification item` | 复用 list surface，标题、描述、footer 和优先级图标形成信息层级 | `_sap_m_NotificationListBase_ItemBackground`、`sapList_Background`、`sapGroup_TitleTextColor`、`sapContent_LabelColor`、`sapSuccessBorderColor`、`sapWarningBorderColor`、`sapErrorBorderColor` | notification item 不是另一种 card，本质仍是 list item |
| `notification unread` | 标题字重加强，正文与 footer 不一起加粗 | 基于 notification unread 规则 | unread 是信息强调，不等于 selected |
| `notification group collapsed / focus` | group header 有独立背景、分隔线和 focus ring，折叠时 children 收起 | `_sap_m_NotificationListGroup_Background`、`_sap_m_NotificationListGroup_HeaderColor`、`sapList_GroupHeaderBorderColor`、`sapContent_Focus*` | group collapse 是结构状态，不应改变整体语义配色 |
| `message dialog / message box` | header shadow 依语义切换，但外壳仍沿用 dialog 系统 | `_sap_m_MessageBox_InformationShadow`、`_sap_m_MessageBox_WarningShadow`、`_sap_m_MessageBox_ErrorShadow`、`_sap_m_MessageBox_SuccessShadow`、`_sap_m_MessageBox_QuestionShadow`、`sapContent_HeaderShadow` | 模态反馈属于 dialog 体系，不能再额外发明一套“错误弹窗皮肤” |

### 结构分层

```text
feedback system
  -> inline message
  -> page feedback
  -> modal feedback
  -> feedback input
  -> notification list / notification group
```

实现时要保证：

- 语义颜色在 inline、page、modal、notification 之间保持同一来源。
- 打断级别要分层，`MessageStrip < MessagePage < MessageDialog / MessageBox`。
- `FeedInput` 使用 field 和 button 作为底座，不应出现单独设计的输入框与发送按钮。
- `NotificationList` 继续服从 list row 语言，而不是切换成 card / panel 语言。

### 尺寸与密度

| 项 | Cozy / 默认 | Compact | 说明 |
| --- | --- | --- | --- |
| MessageStrip padding | `.4375rem 1rem` | 同语义 | 内联反馈的基础呼吸空间 |
| MessageStrip 最小高度 | `2rem` | `2rem` | 过短会压坏图标和关闭按钮 |
| MessageStrip 图标槽宽 | `2.5rem` | `2.5rem` | 图标不能挤占正文行宽 |
| MessageStrip 文本区最大高度 | `10rem` | `10rem` | 超出后内部滚动 |
| MessagePage 内容宽度 | `30rem` | `30rem` | 页面级反馈保持可读列宽 |
| MessagePage 图标字号 | `6rem` | `6rem` | 与普通内联反馈明确分级 |
| FeedInput 左侧预留 | `5rem` | 同语义 | 头像槽是布局一级能力 |
| FeedInput 输入区最小高度 | `4rem` | `4rem` | 发送前的编辑区不能过浅 |
| FeedInput 发送按钮容器宽 | `4rem` | `4rem` | 与标准 button 命中区对齐 |
| Notification Group Header 最小高度 | `2.75rem` | `2.75rem` | 分组头部不能塌缩成普通列表项 |

### 实现红线

- message strip、message page、message dialog 要共享同一套语义色来源，但必须区分打断强度。
- closable strip、grouped notification、feed composer 都要先预留结构空间，再叠加按钮和交互。
- notification list 要继续复用 list 状态与分组语言，不要额外包成卡片式外壳。
- modal feedback 的语义 header 继续依附 dialog 系统，不要在第一份矩阵之外再另造一层 modal 规则。

### 主要来源

- `resources/sap/m/themes/base/library.less` 中的 `MessageStrip.less`、`MessagePage.less`、`MessageBox.less`、`FeedInput.less`、`NotificationListBase.less`、`NotificationListGroup.less`、`NotificationListItem.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/ui/core/themes/sap_horizon/base.less`

## 最小验收集

如果第二批组件只做第一轮实现，至少要保证下面这些场景可用：

### Card

- 标准 card、interactive card、transparent card 都能共用同一套 surface token。
- 至少一个 card 同时覆盖 `hover / focus / loading / content message`。
- `bottom header` 或 `no header` 至少实现一种，证明结构变体不是靠复制组件解决。

### Toolbar / Header / ShellBar

- 标准 toolbar、transparent toolbar、info toolbar 都能对齐同一套间距与溢出规则。
- 至少一个结构性 header 或 `DynamicPageTitle` 实现 `focus` 与三段结构布局。
- `ShellBar` 至少覆盖桌面和手机两档 padding，并证明 `full search` 或 overflow 状态可用。

### Tabs / Navigation

- `IconTabBar` 至少实现 text only、icon only 或 horizontal 其中两种模式，且都有 `hover / selected / focus / disabled`。
- overflow trigger 具备完整 `hover / active / focus`，不是静态图标。
- 至少一个 `NavigationList` 证明 expanded 与 collapsed 共享同一状态语言，且 `selected + hover + focus` 不冲突。

### Message / Feedback

- `MessageStrip` 覆盖 `information / success / warning / error` 四类语义，并支持 closable。
- `FeedInput` 覆盖 `default / disabled`，且发送按钮延续按钮系统语义。
- 至少实现一个 `MessagePage` 和一个 `NotificationList` 场景，证明页面反馈和列表反馈没有混成同一级样式。
- `MessageBox / MessageDialog` 的语义 header 能与第一份 dialog 矩阵对齐。

## 进一步扩写建议

现在状态矩阵已经覆盖两批共八组核心组件。继续往下补时，建议仍沿用“状态矩阵 + token 族 + 实现红线 + 最小验收集”这一套结构，下一步可以优先考虑：

1. `select / search / picker`
2. `page / dynamic page / form` 的布局状态矩阵
3. `table header / analytical / grid list / tree` 的复合行态
4. `message popover / message view / shell 异常态` 等更细分的反馈与壳层例外
