# 核心组件状态矩阵

## 文档定位

这份文档是 `implementation-spec.md` 的下一层补充，专门把四组最关键的核心组件族收束成可直接指导实现和验收的状态矩阵：

- Button
- Field / Input
- List / Table Row
- Dialog / Popover

它不再重复解释“为什么这样设计”，重点回答的是：

- 这些组件最少必须实现哪些状态。
- 每个状态应该通过哪些视觉信号表达。
- 状态背后优先对应哪些 token 族。
- 实现和验收时最容易犯什么错。

## 使用方式

建议把这份文档和以下文档配合阅读：

- 组件族边界与结构说明：`components/*.md`
- 实现顺序、范围和验收总则：`implementation-spec.md`
- 颜色、圆角、阴影、密度和焦点基线：`themes/*.md`

阅读顺序建议如下：

1. 先看组件族文档，理解结构与变体。
2. 再看本文，明确状态矩阵与最小实现面。
3. 最后回到 `implementation-spec.md`，将矩阵转成开发任务和验收项。

## 矩阵约定

本文中“状态矩阵”的字段按下面的规则理解：

| 字段 | 含义 |
| --- | --- |
| 状态 | 组件实际需要覆盖的交互或语义状态 |
| 视觉信号 | 用户能感知到的背景、边框、文字、阴影、焦点、图标变化 |
| 主要 token 族 | 实现时优先对齐的 token 族，不等于完整 token 清单 |
| 实现备注 | 最容易被误做或漏做的细节 |

有一个重要前提要先说清楚：

- `sap/m/themes/sap_horizon/library-parameters.json` 并不会把所有 `sapButton_*`、`sapField_*`、`sapList_*` 变量完整展开在同一个文件里。
- 一部分 token 来自 `sap/ui/core/themes/sap_horizon/base.less`、`global.less` 和 core 侧参数映射。
- 所以本文里的 token 族应理解为“实现入口和命名对照”，而不是“只看一个 JSON 就能拿全所有值”。

## Button

### 状态矩阵

| 状态 | 视觉信号 | 主要 token 族 | 实现备注 |
| --- | --- | --- | --- |
| `default` | 明确背景、边框、文字色，形成完整命中区域 | `sapButton_Background`、`sapButton_BorderColor`、`sapButton_TextColor`、`sapButton_IconColor` | 不要把按钮做成只有文字和点击事件的裸文本 |
| `hover` | 背景与边框增强，默认/ghost 类文本与图标同步提亮 | `sapButton_Hover_Background`、`sapButton_Hover_BorderColor`、`sapButton_Hover_TextColor` | hover 应该可见，但不能变成高饱和大色块 |
| `active / pressed` | 背景、边框、文字同时切到按下态，文字阴影移除 | `sapButton_Active_Background`、`sapButton_Active_BorderColor`、`sapButton_Active_TextColor` | active 强度必须高于 hover，不能只靠微弱阴影 |
| `focus-visible` | 系统级 focus ring，部分场景切对比焦点色 | `sapContent_FocusWidth`、`sapContent_FocusStyle`、`sapContent_FocusColor`、`sapContent_ContrastFocusColor` | 焦点不能只留浏览器默认 outline；选中/壳层语境下要注意对比焦点色 |
| `disabled` | 取消阴影语气，鼠标语义退化，仍保留占位 | `sapContent_DisabledOpacity` 及按钮禁用规则 | 禁用不等于删除边框或塌缩高度 |
| `selected / toggled` | 使用独立 selected 背景、边框、文字色，图标同步切换 | `sapButton_Selected_Background`、`sapButton_Selected_BorderColor`、`sapButton_Selected_TextColor` | selected 不是 default 的深一点版本，而是系统级状态 |
| `selected + hover` | 在 selected 基础上再进入 hover 叠加态 | `sapButton_Selected_Hover_Background`、`sapButton_Selected_Hover_BorderColor` | 不能退化成普通 hover，也不能丢 selected 语义 |
| `transparent / ghost` | 与普通按钮共结构，但更轻，更适合 header / toolbar / shell | `sapButton_Lite_*` 或透明上下文规则 | 不要单独再发明“工具栏按钮组件” |

### 语义变体补充

| 变体 | 默认态重点 | active / selected 重点 | 实现备注 |
| --- | --- | --- | --- |
| `emphasized` | 主强调按钮，品牌色承担主操作 | active 仍优先保证文字可读性，不应只保持纯品牌蓝 | 主操作应在同一页面中数量受控 |
| `accept / success / positive` | 明确确认语义 | selected 有独立 `Accept_Selected_*` 或成功语义 token | 不要拿普通绿色背景临时替代 |
| `reject / negative` | 明确危险或拒绝语义 | selected 也有独立 reject 选中态 | 删除类操作需与普通主按钮显著区分 |
| `attention / critical` | 警示但不等于 destructive | active / selected 需要保持对比度 | 警告态不能和 reject 态混色 |
| `neutral / information` | 较弱语义强调 | active 仍复用系统按下态逻辑 | 适合对象级操作，不适合主 CTA |

### 尺寸与密度

| 项 | Cozy | Compact | 说明 |
| --- | --- | --- | --- |
| 外层命中高度 | `3rem` | `2rem` | 外层 `sapMBtn` 负责命中面积 |
| 可见内核高度 | `var(--sapElement_Height)` | `var(--sapElement_Compact_Height)` | 内层 `sapMBtnInner` 是视觉主体 |
| 最小宽度 | `2.5rem` | `2rem` | 图标按钮也要保留最小命中范围 |
| 文本左右 padding | `0.75rem` | 更紧 | 文本型按钮不要把 padding 压没 |
| 图标槽宽 | `2.375rem` | `1rem` 级别图标布局 | 图标对齐要跟命中盒同步缩放 |

### 实现红线

- `toolbar / header / shell` 场景复用同一按钮系统，只做语境轻量化。
- `selected`、`hover`、`active` 三者要能叠加推导，不能写成互相打架的特例。
- 图标颜色必须跟文本颜色同源切换，不能出现“文本已进入 active，图标仍停在 default”。

### 主要来源

- `resources/sap/m/themes/base/library.less` 中的 `Button.less`、`ToggleButton.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/ui/core/themes/sap_horizon/base.less`

## Field / Input

### 状态矩阵

| 状态 | 视觉信号 | 主要 token 族 | 实现备注 |
| --- | --- | --- | --- |
| `default` | wrapper 承担背景、边框、阴影，inner 承担文字和 placeholder | `sapField_Background*`、`sapField_Border*`、`sapField_TextColor`、`sapField_Shadow` | 真正的视觉边界在 wrapper，不在原生 input |
| `hover` | 背景、边框、阴影轻量增强 | `sapField_Hover_Background*`、`sapField_Hover_BorderColor`、`sapField_Hover_Shadow` | hover 主要强化边界感，不应破坏输入内容可读性 |
| `active / icon pressed` | 边框切到 active 语义，图标槽可同步带 active / hover 阴影 | `sapField_Active_BorderColor` | 有图标时，图标按下态不能脱离 field wrapper 单独处理 |
| `focus-visible` | wrapper 上绘制系统 focus ring，inner 边框同步切 focus 色 | `sapContent_Focus*`、`sapField_Focus_BorderColor` | focus 不是把整块背景刷成品牌色，而是在边界上表达 |
| `disabled` | 控件整体降噪，图标变禁用色，placeholder 隐藏 | `sapContent_DisabledOpacity`、`sapContent_DisabledTextColor` | disabled 仍保留结构占位，不能因为禁用而让布局跳动 |
| `readonly` | 使用只读边框与背景，placeholder 隐藏，focus ring offset/radius 收缩 | `sapField_ReadOnly_Background`、`sapField_ReadOnly_BorderColor` | readonly 要保留字段感，只是去掉可编辑语气 |
| `error` | 独立无效背景、边框、阴影 | `sapField_InvalidBackground`、`sapField_InvalidColor`、`sapField_InvalidShadow` | 不能只改边框红色而忽略背景与阴影 |
| `warning` | 独立警告背景、边框、阴影 | `sapField_WarningBackground`、`sapField_WarningColor`、`sapField_WarningShadow` | warning 与 error 不应只差一档透明度 |
| `success` | 独立成功背景、边框、阴影 | `sapField_SuccessBackground`、`sapField_SuccessColor`、`sapField_SuccessShadow` | success 不要做成纯绿色大底块 |
| `information` | 独立信息背景、边框、阴影 | `sapField_InformationBackground`、`sapField_InformationColor`、`sapField_InformationShadow` | 信息态通常更克制，但不能退化成 default |
| `value state + hover` | 状态阴影在 hover 下继续保持语义化 | `sapField_Hover_InvalidShadow`、`sapField_Hover_WarningShadow`、`sapField_Hover_SuccessShadow`、`sapField_Hover_InformationShadow` | 最容易漏做，结果会导致错误态 hover 后“失去状态感” |

### 结构约束

```text
field
  -> content wrapper
  -> input / textarea inner
  -> begin icon slot
  -> end icon slot
  -> value-state treatment
```

实现时要保证：

- `inner` 只处理文字、placeholder、caret 和内容溢出。
- `wrapper` 处理背景、边框、阴影、focus ring 和 value state。
- 图标槽是布局一级能力，而不是绝对定位补丁。

### 尺寸与密度

| 项 | Cozy | Compact | 说明 |
| --- | --- | --- | --- |
| 内部最小宽度 | `2.75rem` | `2rem` | 不能因为空间紧就直接压穿 |
| 单图标最小宽度 | `5rem` | `4rem` | 有图标时要确保内容区仍有呼吸空间 |
| 双图标最小宽度 | `7.25rem` | `6rem` | 选择器、值帮助类控件依赖这个底座 |
| 内容 padding | `0 .625rem` | `0 .5rem` | padding 缩小必须跟高度一起做 |
| 图标槽宽 | `2.25rem` | `2rem` | 前后图标统一宽度更利于复用 |
| focus 圆角 | `.25rem` | 同语义 | readonly focus 会进一步收紧 offset 与 radius |

### 额外规则

- placeholder 在 `disabled` 和 `readonly` 下会被隐藏，不应继续维持输入提示语气。
- `TextArea` 虽然 padding 不同，但仍然应复用 field token 与 value-state 模型。
- `SearchField`、`Select`、`ComboBoxBase` 等字段衍生控件应共享同一个 wrapper 语言。

### 主要来源

- `resources/sap/m/themes/base/library.less` 中的 `InputBase.less`、`TextArea.less`、`DatePicker.less`、`TimePicker.less`、`StepInput.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/ui/core/themes/sap_horizon/base.less`

## List / Table Row

### 状态矩阵

| 状态 | 视觉信号 | 主要 token 族 | 实现备注 |
| --- | --- | --- | --- |
| `default` | 行背景、底部分隔线、左右 padding 构成基础骨架 | `sapList_Background`、`sapList_BorderColor`、`sapList_TextColor` | 列表和表格的“行”应先统一，再派生不同容器 |
| `hover` | 整行切入中性 hover 背景 | `sapList_Hover_Background` | hover 必须作用于整行交互单元，而不是只作用单元格文字 |
| `selected` | 独立选中背景，必要时叠加选中边框 | `sapList_SelectionBackgroundColor`、`sapList_SelectionBorderColor` | selected 不能退化成 hover，也不能只给左侧打勾 |
| `selected + hover` | 选中行进入 hover 后，仍保持选中语义背景 | `sapList_Hover_SelectionBackground` | 这类叠加态最容易被漏写 |
| `active / pressed` | 背景与文字同步切 active 态，图标与附属动作同步切换 | `sapList_Active_Background`、`sapList_Active_TextColor` | active 反馈强于 hover，且必须覆盖行内图标与说明文本 |
| `focus-visible` | 整行用系统 outline，focus offset 需给 highlight / navigated 留空间 | `sapContent_Focus*`、`_sap_m_ListItemBase_Focus_Outline`、`_sap_m_ListItemBase_Focus_OffsetWithGap` | focus 不能被左侧 highlight 条吞掉 |
| `unread` | 行级加粗或更强文字权重 | 基于 row unread 规则 | unread 是信息层，不等同于 selected |
| `highlight` | 左侧语义条表达 `information / success / warning / error / indication` | `sapInformationBorderColor`、`sapSuccessBorderColor`、`sapWarningBorderColor`、`sapErrorBorderColor`、`sapIndicationColor_*` | highlight 条必须与 focus、selected 协同存在 |
| `navigated` | 导航态左侧或边界强调 | `sapList_SelectionBorderColor`、`_sap_m_ListItemBase_Navigated` | navigated 不是 active 的替身，而是“已进入对象上下文” |

### 结构与布局要点

| 项 | 规则 | 说明 |
| --- | --- | --- |
| 行内骨架 | `highlight / selection control / content / counter / nav` | 左右槽位应标准化，避免每种列表重写 |
| 选择列宽 | `2.75rem` 级别 | 表格、多选列表、选择器要统一 |
| unread | 使用字重，不改整行底色 | unread 是信息强调，不应抢 selected 的语义 |
| alternating row | 仅作为数据密集增强 | `sapList_AlternatingBackground` 不能替代 hover/selected |
| group header | 独立 header 背景与文字色 | 使用 `sapList_GroupHeaderBackground`、`sapList_TableGroupHeaderTextColor` |

### 复用边界

- `SelectList`、`SuggestionsPopover`、`NotificationList`、许多 picker 展开项，本质上都应复用 row 状态语言。
- `popin` 不是另一套组件，而是同一行在窄屏下的重排。
- 表格 header 自己也有 `hover / active / focus` 规则，但不要把 header 状态和 body row 状态混写。

### 实现红线

- 行 hover、selected、active 必须覆盖整行背景，而不是只覆盖某个文本容器。
- 选中边框在 popin、合并单元格、子行场景下仍要闭合。
- 行内链接、图标、次级文本在 active 态下要同步切色，否则会出现“背景已按下，内容却像 default”的割裂感。

### 主要来源

- `resources/sap/m/themes/base/library.less` 中的 `ListItemBase.less`、`Table.less`、`SelectList.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/ui/core/themes/sap_horizon/base.less`

## Dialog / Popover

### 状态矩阵

| 状态 / 变体 | 视觉信号 | 主要 token 族 | 实现备注 |
| --- | --- | --- | --- |
| `default dialog` | 重浮层阴影、标准圆角、header / content / footer 三层清晰 | `sapContent_Shadow3`、`sapElement_BorderCornerRadius`、`_sap_m_Dialog_Padding` | dialog 不是一个白盒子，而是系统级容器 |
| `open / close` | 透明度显隐过渡 | `sapMDialogOpen` 规则与过渡时长 | 动效应该克制，不需要营销式位移动画 |
| `content focus` | dialog section 自身可获得系统 focus outline | `sapContent_Focus*` | 内容区 focus 与 header focus 要分开处理 |
| `header focus` | title group 自带独立 focus 边界，且只覆盖头部 | `_sap_m_Dialog_HeaderFocusBorderRadius`、`_sap_m_Dialog_HeaderFocusBorder*Offset`、`sapContent_Focus*` | 头部 focus 不能沿用内容区 outline 直接套上 |
| `warning` | header icon 与 header 阴影切警告语义 | `_sap_m_Dialog_WarningHeaderShadow`、`sapCriticalElementColor` | 语义主要落在 header，而不是整屏换大底色 |
| `error` | header icon 与 header 阴影切错误语义 | `_sap_m_Dialog_ErrorHeaderShadow`、`sapNegativeElementColor` | 错误 dialog 重点是边界与标题信息，而不是红色大面铺底 |
| `success` | header icon 与 header 阴影切成功语义 | `_sap_m_Dialog_SuccessHeaderShadow`、`sapPositiveElementColor` | success 同样保持克制，不做满屏绿色 |
| `information` | header icon 与 header 阴影切信息语义 | `_sap_m_Dialog_InformationHeaderShadow`、`sapInformativeElementColor` | 信息态应继续与默认态区分，但不能太吵 |
| `message dialog` | 固定内容 padding，更偏结构化反馈 | `sapMMessageDialog` 与 `MessageBox` 系列阴影 | MessageDialog 仍复用 dialog 外壳 |
| `action sheet` | 内容区无标准 dialog padding，更接近操作列表面板 | `sapMActionSheetDialog` 规则 | 手机上应允许更接近 bottom sheet |
| `stretched / phone fullscreen` | 手机全屏下去掉边框、阴影和圆角 | `sapMDialogStretched` 规则 | 不能简单把桌面 dialog 按比例放大到手机 |
| `popover` | 保留 surface 与阴影语言，但多了箭头与更短显隐过渡 | `_sap_m_Popover_ArrowOffset`、`_sap_m_Popover_OpacityTransitionDuration` | popover 是轻上下文展开，不是缩小版 dialog |

### 尺寸与密度

| 项 | Cozy / 默认 | Compact | 说明 |
| --- | --- | --- | --- |
| 垂直留白 | `3%` | 同策略 | 用于避免重浮层贴满屏幕 |
| 标题栏高度 | `2.75rem` | `2.5rem` | 头部是独立层级 |
| 子标题栏高度 | `3rem` | `2.25rem` | subheader 与主 header 不同高度 |
| 内容 padding | `1rem` | 同语义 | MessageDialog 固定保留 |
| Popover 箭头偏移 | `.5rem` | `.5rem` | 关系到箭头与圆角安全距离 |
| Popover 显隐时长 | `.2s` | `.2s` | 保持轻快，不拖泥带水 |

### 实现红线

- dialog、message dialog、action sheet、popover 必须共用同一套 surface、radius、shadow 语言。
- 头部语义优先通过 header 阴影和图标色表达，不要为每种语义再设计一套完全不同的弹层皮肤。
- 手机端允许切换成全屏或不同布局策略，而不是强行缩放桌面版本。
- 头部、内容区、footer 必须分层，按钮不要直接塞进滚动内容里。

### 主要来源

- `resources/sap/m/themes/base/library.less` 中的 `Dialog.less`、`Popover.less`、`ActionSheet.less`、`MessageBox.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/ui/core/themes/sap_horizon/base.less`

## 最小验收集

如果你只做第一轮实现，至少要保证下面这些场景可用：

### Button

- 默认按钮、强调按钮、透明按钮都具备 `hover / active / focus / disabled`。
- 至少一个 toggle / selected 场景可用，且 `selected + hover` 不丢状态。
- 语义按钮至少覆盖 `accept / reject / attention` 三类。

### Field / Input

- 标准输入框覆盖 `default / hover / focus / disabled / readonly / error / warning / success / information`。
- 至少一个带前后图标的字段实现完整状态切换。
- `TextArea` 与普通字段共享同一套 value-state 语义。

### List / Table Row

- 行项覆盖 `default / hover / selected / selected+hover / active / focus / unread`。
- 至少一类表格行或选择列表项能证明 row 状态可以跨容器复用。
- 左侧 highlight 条和 focus outline 不互相覆盖。

### Dialog / Popover

- 标准 dialog 覆盖 `open / close / header focus / content focus / footer action`。
- 至少实现 `warning / error / success / information` 四类 header 语义。
- 同时实现一个 popover 或 action sheet，证明不是所有浮层都被粗暴做成同一种 dialog。

## 扩写方式

第二批状态矩阵已经拆到 `secondary-component-state-matrices.md`，覆盖：

1. `card`
2. `toolbar / header / shellbar`
3. `tabs / navigation`
4. `message / feedback`

后续如果继续扩写第三批，不建议改写法，仍然沿用“状态矩阵 + token 族 + 实现红线 + 最小验收集”这一套结构。这样前后文档的阅读方式、实现入口和验收口径都会保持统一。
