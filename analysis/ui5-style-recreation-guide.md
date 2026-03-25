# 基于现有 SAPUI5 实现的新项目样式复刻指南

## 1. 文档目的

这份文档不是继续罗列样式文件，而是把当前仓库的现有实现提炼成一套可执行的复刻方法，用于指导你在**新项目**中重建相同或高度接近的视觉语言、交互密度、布局节奏和 UX 约束。

目标不是“复制 UI5 的所有类名”，而是回答下面几个实际问题：

- 如果我不用 UI5，只想复刻这一套风格，应该先搭什么层次？
- 什么是这套样式系统的核心设计思想？
- 复刻时哪些视觉和交互规则是不能丢的？
- 新项目里应该如何组织 token、组件样式、密度模式和响应式断点？
- 如果我只做现代化版本，应该以哪个主题为准？

## 2. 这套风格真正的核心

### 2.1 它不是“某个页面长什么样”，而是“一个企业级设计系统如何工作”

从现有实现看，UI5 的主样式体系有非常明确的结构：

```text
Theme tokens
  -> Global semantic aliases
  -> Library/component rules
  -> Density / responsive / RTL / accessibility variants
  -> Compiled delivery assets
```

也就是说，真正稳定的不是某个按钮类名，而是这些规则：

- 设计先从主题令牌开始
- 控件样式尽量消费语义 token，而不是直接写颜色值
- hover / active / focus / selected / disabled / semantic state 全部是系统级能力
- 密度模式、响应式断点、RTL、高对比主题不是补丁，而是主干

### 2.2 如果你要做新项目，应该以 `sap_horizon` 为主基准

这个仓库同时保留了 `sap_bluecrystal`、`sap_belize`、`sap_fiori_3`、`sap_horizon` 等多代主题。

如果目标是“复刻当前主流现代 UI5 风格”，建议直接以 **`sap_horizon`** 为基准主题，原因是：

- 它是当前仓库中最完整、最现代的一套默认主题之一
- 其 token 体系更系统，CSS variable 使用更成熟
- 它保留了企业应用的克制感，但比 Belize / BlueCrystal 更现代
- 它对可访问性、阴影、圆角、状态色和表面层级的处理更统一

如果未来要兼容深色或高对比：

- 优先再扩展 `sap_horizon_dark`
- 再考虑 `sap_horizon_hcb` / `sap_horizon_hcw`

不要一开始就把多代旧主题一起复刻，否则项目会被兼容成本拖垮。

## 3. 复刻时必须保留的设计思想

### 3.1 企业工作台风格，而不是营销站风格

这套实现不是追求强装饰性，而是强调：

- 清晰的信息层级
- 可持续使用的长时间工作界面
- 高密度但可读
- 语义状态明确
- 焦点、键盘、可访问性可用

因此，复刻时应坚持以下方向：

- 以中性底色为主，不用大面积高饱和背景铺满页面
- 品牌色主要用于强调、选中、主操作和信息态，不用于所有大块容器
- 大量卡片、表单、列表和页面容器都以浅色表面为主
- 视觉重点更多靠边框、阴影、间距、文字权重和状态色，而不是复杂渐变或重装饰

### 3.2 令牌先行，而不是组件里直接写死视觉值

UI5 的实现里，按钮、输入框、列表、Dialog、DynamicPage 并不是彼此独立设计，而是都通过统一 token 体系联动。

你在新项目中也应这样做：

- 先定义基础 token
- 再定义语义 token
- 最后定义组件 token 或组件样式

不建议直接做下面这种方式：

```css
.button-primary { background: #0070f2; border-radius: 8px; }
.input { border: 1px solid #bcc3ca; }
.dialog { box-shadow: 0 20px 80px rgba(...); }
```

建议改为：

```css
:root {
  --brand-primary: #0070f2;
  --surface-page: #f5f6f7;
  --surface-card: #ffffff;
  --focus-color: #0032a5;
  --button-primary-bg: var(--brand-primary);
  --field-border-color: #bcc3ca;
}
```

原因很简单：

- 后续切换深色、高对比、品牌色和密度模式时不需要重写组件
- 语义和视觉绑定更稳定
- 更接近 UI5 现有实现方式，迁移成本低

### 3.3 焦点、状态、密度、响应式必须是一级能力

这套设计语言的一个核心特征是：它不把“无障碍、紧凑模式、手机断点”视作后补能力。

在新项目中，应当从第一天就把以下系统作为主干：

- `focus`
- `hover`
- `active`
- `selected`
- `disabled`
- `error / warning / success / information`
- `cozy / compact / condensed`
- `phone / tablet / desktop / xl`
- `ltr / rtl`

如果你复刻了颜色和圆角，却没有把这些状态体系一起复刻，最终成品只会“像”，不会“对”。

## 4. 现代 Horizon 基准中的关键视觉约束

以下值来自当前仓库 `sap_horizon` 主题参数与聚合样式，可直接作为新项目的第一版基准。

### 4.1 色彩基准

| 角色 | 建议值 | 说明 |
| --- | --- | --- |
| 品牌主色 | `#0070f2` | 主操作、强调、信息态核心色 |
| 高亮色 | `#0064d9` | hover/selected/info 等经常复用 |
| 页面背景 | `#f5f6f7` | 应用主背景 |
| 主表面 | `#ffffff` | 卡片、表单、Dialog 主内容面 |
| 主文字 | `#131e29` | 核心正文与标题 |
| 次级文字 / 标签 | `#556b82` | label、说明、次级信息 |
| hover 灰底 | `#eaecee` | 中性 hover 背景 |
| active 灰底 | `#dee2e5` | 中性 active 背景 |
| 错误色 | `#aa0808` | 错误态文字、边框、图标 |
| 警告色 | `#e76500` | 警告态 |
| 成功色 | `#256f3a` | 成功态 |
| 信息色 | `#0070f2` | 信息态 |
| 焦点色 | `#0032a5` | 键盘 focus 主色 |

复刻时要注意一个原则：

- 页面/容器背景与主操作色必须明显分层
- 蓝色是强调色，不是全站底色
- 状态色优先表达语义，不要随意重新配色

### 4.2 字体与字号基准

当前实现的核心字体策略：

- 默认字体：`"72", "72full", Arial, Helvetica, sans-serif`
- 标题字体：`"72-Bold", "72-Boldfull", "72", "72full", Arial, Helvetica, sans-serif`
- 等宽字体：`"72Mono", "72Monofull", lucida console, monospace`

推荐在新项目中这样处理：

- 如果能使用 SAP 72 系列字体，就按 UI5 方案走
- 如果不能，至少保留 fallback 栈顺序与整体字重逻辑

常用字号基准：

| 角色 | 值 |
| --- | --- |
| 基础字体 | `0.875rem` |
| 小字 | `0.75rem` |
| 大字号正文 | `1rem` |
| H1 | `3rem` |
| H2 | `2rem` |
| H3 | `1.5rem` |
| H4 | `1.25rem` |
| H5 | `1rem` |
| H6 | `0.875rem` |

设计风格上要坚持：

- 正文不过分大
- 标题和正文差异明显
- 次级说明、状态说明、时间戳以小字体现
- 标题强调更多靠字族和粗细，而不是异常大的字号

### 4.3 空间与布局节奏

Horizon 的空间尺度非常清晰：

| token | 值 |
| --- | --- |
| `Space Tiny` | `0.5rem` |
| `Space Small` | `1rem` |
| `Space Medium` | `2rem` |
| `Space Large` | `3rem` |
| `Gap` | `1rem` |

如果你复刻布局，建议直接把这些值当作主尺度：

- 微小内补白：`0.25rem` / `0.5rem`
- 控件内水平 padding：`0.5rem` / `0.625rem` / `0.75rem`
- 卡片内容 padding：`1rem`
- 页面内容区 padding：桌面 `3rem`、平板 `2rem`、手机 `1rem`

### 4.4 圆角与阴影

Horizon 的圆角不是单一值，而是按组件角色区分：

| 场景 | 建议值 |
| --- | --- |
| 通用元素圆角 | `0.75rem` |
| 按钮圆角 | `0.5rem` |
| 输入框 focus 小圆角 | `0.25rem` |
| 小型 token/chip | `0.375rem` |
| 大圆形按钮/头像 | `50%` |

阴影层级也明显分层：

| 层级 | 建议用途 |
| --- | --- |
| `Shadow0` | 普通卡片、轻浮层 |
| `Shadow1` | Focus / 中等强调浮层 |
| `Shadow2` | Hover 卡片或中层弹层 |
| `Shadow3` | Dialog 等重浮层 |

一个关键 UX 约束是：

- 阴影用于层级和悬浮感，不用于装饰
- hover 时阴影可增强，但不应让界面显得“浮躁”

## 5. 非常重要的 UX 约束

### 5.1 焦点必须明确可见

现有实现中，focus 是明显且系统化的：

- 焦点主色约为 `#0032a5`
- 焦点宽度约为 `0.125rem`
- 很多控件会通过 `::before` / `::after` 绘制内部 focus ring
- 高对比模式会切换到 `sapContent_ContrastFocusColor`

新项目里必须保留：

- 键盘 Tab 时 focus ring 始终可见
- 不能完全依赖浏览器默认 outline
- 不要用 box-shadow 做成模糊弱焦点
- 对比度不足的组件必须换用高对比 focus 颜色

### 5.2 禁用态是“降噪”，不是“消失”

当前系统常用禁用透明度约为 `0.4`。

复刻时应遵循：

- 禁用组件仍然保持布局占位
- 文本和图标降低对比，但保持可辨识
- 禁用不是“隐藏”
- 禁用态仍应遵守语义边界，不要完全灰成一片

### 5.3 危险、警告、成功、信息状态必须统一

UI5 中这些状态并非按钮特例，而是字段、提示、标题、Header 阴影、图标、消息条共同消费的一套语义色。

新项目中必须建立统一语义层：

- `--color-negative-*`
- `--color-critical-*`
- `--color-positive-*`
- `--color-informative-*`

不要在不同组件里各写一套“红、黄、绿、蓝”。

### 5.4 密度模式必须通过 token 变化实现，不能靠缩放

当前实现中：

- Cozy / 标准元素高度：`2.25rem`
- Compact 元素高度：`1.625rem`
- Condensed 元素高度：`1.375rem`

正确做法：

- 通过高度、内边距、图标尺寸、行高、间距变化实现密度切换

错误做法：

- 用 `transform: scale(...)`
- 只缩字体不缩点击区
- 把整个页面压缩，导致可点击目标不合规

## 6. 组件复刻规则

## 6.1 按钮

### 设计意图

按钮是这套风格里最典型的“语义 + 状态”组件：

- 默认按钮：白底、蓝字、浅边框
- Emphasized：品牌蓝底、白字
- Accept / Success：绿色语义底
- Reject / Negative：红色语义底或粉底红字
- Attention / Critical：橙黄语义底
- Transparent / Lite：透明底，用于工具栏和次级操作

### 关键规则

- 默认高度跟随元素高度：现代基准约 `2.25rem`
- 最小宽度不能太小，避免只剩图标时视觉失衡
- hover 不大幅跳色，而是中性增强
- active 一般回到更明确的边框和文本颜色
- Emphasized 在 active 状态下不一定继续保持蓝底，很多场景会回到白底 + 蓝边，强调可读性和状态反馈

### 复刻建议

```css
.btn {
  height: var(--element-height);
  min-width: 2.5rem;
  padding-inline: 0.75rem;
  border: 1px solid var(--button-border);
  border-radius: 0.5rem;
  background: var(--button-bg);
  color: var(--button-text);
}
```

建议保留的状态组合：

- `default`
- `emphasized`
- `positive`
- `negative`
- `attention`
- `transparent`
- `selected`
- `disabled`

不要只实现 `primary / secondary / ghost` 三种就结束，那样会丢掉 UI5 的语义层。

## 6.2 输入框 / 表单字段

### 设计意图

输入框不是简单的矩形输入，而是非常强调：

- 可读性
- 状态边界
- 图标槽位
- placeholder 可辨识
- focus 明确
- 语义状态完整

### 关键规则

从现有实现中可提炼出这些复刻点：

- 字段容器是有边框、圆角和背景的“包装层”
- placeholder 使用 italic
- 带前后图标时会调整最小宽度和内边距
- focus 不是改变整个输入背景，而是在外层绘制清晰的 focus ring
- error / warning / success / information 都有各自背景、边框和阴影
- hover 态通常只轻微改变边框 / 阴影，不搞大幅动画

### 复刻建议

- 以 wrapper 作为真正的视觉边界，而不是 input 自身
- 前后图标容器作为标准布局，而不是临时 absolute 定位补丁
- 输入、搜索、日期、带图标字段共用同一套 field token

建议最少准备这些 token：

- `--field-bg`
- `--field-border-color`
- `--field-border-radius`
- `--field-hover-border-color`
- `--field-focus-ring`
- `--field-invalid-*`
- `--field-warning-*`
- `--field-success-*`
- `--field-information-*`
- `--field-placeholder-color`

## 6.3 列表 / 表格

### 设计意图

列表体系并不是“纯白表格线”，而是更偏工作台数据视图：

- 项有 hover
- 项有 selected
- 项有 active
- 分隔线和群组头单独处理
- table row 与 popin 行联动
- focus 不只落在文字，而会影响行高亮边

### 复刻时必须保留

- `hover` 行背景与 `selected` 行背景不同
- `selected + hover` 不能退化为普通 hover
- 分隔线可配置成 `none / inner / all`
- 列表项在紧凑模式下高度下降
- 多选、单选、可操作、导航型条目之间的左侧槽位必须统一宽度

如果新项目有数据表格，建议直接做一个“行状态系统”，而不是每个列表自己写 hover。

## 6.4 Dialog / 弹层

### 设计意图

Dialog 是重浮层，强调：

- 明显的悬浮层级
- 清晰的头部和内容区
- 在手机与桌面上的不同行为
- 可聚焦且可键盘操作

### 核心规则

- 大阴影，接近 `Shadow3`
- 圆角接近通用元素圆角
- 主内容区通常使用白色或 group content background
- 标题栏高度与页面 Header 一样有明确规格
- Compact 模式会下调 title bar / footer 高度
- 手机上允许接近全宽或 bottom sheet 式处理

### 复刻建议

- 统一 `modal / non-modal / side-sheet / action-sheet` 的基础弹层框架
- 标题区、内容区、页脚区明确分层
- 统一内容 padding：默认 `1rem`
- overlay 不宜过黑，保留企业应用的克制感

## 6.5 Dynamic Page / 页面容器

### 设计意图

`sap.f.DynamicPage` 非常能代表 UI5 的页面组织方式：

- 顶部是标题与头部区
- 中部是主内容
- 内容区按设备有稳定内边距
- 页脚可浮起并保留额外留白

### 可直接复刻的规则

默认内容内边距：

- Desktop：`3rem 3rem 0 3rem`
- Tablet：`2rem 2rem 0 2rem`
- Phone：`2rem 1rem 0 1rem`

页脚浮层：

- 高度：`3rem`
- Compact 高度：`2.5rem`
- 底部 margin：`0.5rem`

标题区：

- 最小高度约 `3rem`
- 左右 padding 不是对称的，常见为 `0.5rem 2rem 0.5rem 3rem`
- 背景通常落在对象头 / 容器头表面色上

### 新项目复刻建议

如果你有应用壳层、对象详情页、工作台页，请采用同类分层：

```text
App shell
  -> Top bar / shell bar
  -> Page title zone
  -> Optional header/filter/summary zone
  -> Main content zone
  -> Floating footer / action zone
```

不要直接做成：

- 一个大白盒子从上到下塞满
- 移动端和桌面端只缩放，不改 padding

## 6.6 Shell Bar / 顶部壳层

从现有实现可看到壳层是很重要的 UX 控件：

- 桌面 padding：`3rem`
- 普通 desktop：`2rem`
- phone：`1rem`
- 高度约 `3.25rem`
- 搜索框为圆角胶囊输入，内部按钮是短圆按钮

复刻时，建议保留：

- 顶栏作为独立表面层
- 顶栏按钮与普通按钮不同，用更轻的透明 / lite 风格
- 搜索框与普通输入框同 token 体系，但形态更偏胶囊

## 7. 响应式规则

当前实现的主断点可以直接沿用：

| 断点 | 值 |
| --- | --- |
| Phone 上限 | `599px` |
| Tablet 起点 | `600px` |
| Desktop 起点 | `1024px` |
| XL 起点 | `1440px` |

新项目里建议直接建立四段命名：

- `phone`
- `tablet`
- `desktop`
- `xl`

而不是把所有布局只用 `mobile / desktop` 两段粗暴处理。

### 响应式复刻原则

- 手机减小横向 padding，不要单纯缩小字体
- 平板和桌面主要差在内容宽度、壳层间距、卡片布局密度
- XL 更适合增加留白和并列信息，不应无限拉宽单列内容

## 8. 可访问性与高对比要求

即便新项目第一期只做 `sap_horizon` 风格，也建议保留以下结构能力：

- `focus-visible` 明确
- 语义色对比可达标
- 文字与背景对比优先，不要只看“好看”
- 保留高对比变量入口
- 组件不要依赖颜色唯一表达状态，尽量同时有 icon / border / shadow / label

建议预留这些 mode class：

- `.theme-horizon`
- `.theme-horizon-dark`
- `.theme-horizon-hcb`
- `.theme-horizon-hcw`

如果暂时不做高对比主题，至少先保证变量命名和覆盖点在。

## 9. 新项目的推荐样式架构

## 9.1 文件组织建议

```text
src/styles/
  tokens/
    foundation.css
    semantic.css
    theme-horizon.css
    theme-horizon-dark.css
  modes/
    density.css
    contrast.css
    rtl.css
  layout/
    shell.css
    page.css
    content.css
  components/
    button.css
    field.css
    list.css
    dialog.css
    card.css
    table.css
  utilities/
    spacing.css
    typography.css
    visibility.css
```

## 9.2 token 建议分层

推荐至少做三层：

### 第一层：基础 token

- 颜色原值
- 字体栈
- 尺寸尺度
- 阴影原值
- 圆角原值

### 第二层：语义 token

- `--color-surface-page`
- `--color-surface-card`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-border-default`
- `--color-focus`
- `--color-positive-*`
- `--color-negative-*`

### 第三层：组件 token

- `--button-default-bg`
- `--button-emphasized-bg`
- `--field-border-color`
- `--dialog-shadow`
- `--page-content-padding-desktop`

这样做的好处是：

- 组件样式更稳定
- 未来换主题只换 token，不改组件
- 更接近 UI5 的真实做法

## 9.3 建议保留 UI5 风格命名作为兼容层

如果你希望后续继续对照 UI5，建议在新项目里保留一层映射：

```css
:root {
  --sapBrandColor: var(--brand-primary);
  --sapBackgroundColor: var(--surface-page);
  --sapTextColor: var(--text-primary);
  --sapContent_FocusColor: var(--focus-color);
}
```

这样做的价值是：

- 你可以直接对照现有 `library-parameters.json`
- 遇到需要继续比对 UI5 行为时，成本很低
- 以后如果接入 UI5 Web Components，也更顺畅

## 10. 复刻实施顺序

建议按下面顺序推进，而不是一上来先抄组件：

1. 建立 `sap_horizon` 基础 token
2. 建立语义 token 和状态色体系
3. 建立密度模式 `cozy / compact / condensed`
4. 建立响应式断点和页面内容 padding 体系
5. 实现 Button / Field / List / Dialog 四个核心组件
6. 实现 Page / DynamicPage / Shell Bar / Card
7. 补齐可访问性、高对比和 RTL 钩子
8. 最后再做业务页面拼装

原因是：

- 前四步决定整体风格
- 中间几步决定“像不像 UI5”
- 最后一步才是页面复刻

## 11. 复刻时常见错误

### 11.1 只抄颜色，不抄状态

结果会像一张截图，但不像一个系统。

### 11.2 只做普通模式，不做 compact

这样一到企业列表、表单和工作台场景就会显得过于松散。

### 11.3 用单一圆角和单一阴影统一所有组件

UI5 实际上是“整体统一 + 局部差异”，不是所有盒子都一个 `8px` 圆角。

### 11.4 忽略焦点和高对比入口

这会让项目在键盘操作和企业无障碍验收上直接出问题。

### 11.5 直接复制 UI5 的最终 CSS

不建议这样做，原因有三点：

- 最终 CSS 是发布产物，包含大量构建逻辑和兼容逻辑
- 类名结构和 DOM 结构强绑定
- 一旦脱离 UI5 DOM，很多规则会失效

正确做法是：

- 提炼 token、状态和布局约束
- 在新框架下重写组件

## 12. 一个可执行的最小复刻基线

如果你需要一个最小可用版本，建议第一期至少做到：

- 主题：只做 `sap_horizon`
- 模式：做 `cozy + compact`
- 页面：实现 shell bar、page、dynamic page、card
- 组件：button、input、select、list、dialog、table
- 状态：hover、active、focus、selected、disabled、error、warning、success、info
- 断点：phone / tablet / desktop / xl

这是最小但不失真的 UI5 风格骨架。

## 13. 验收清单

新项目完成后，可按以下清单验收：

- 页面背景是否以浅中性面为主，而不是大面积品牌色？
- 主按钮、次按钮、透明按钮、语义按钮是否都有完整状态？
- 输入框是否具备 wrapper、focus ring、placeholder italic、语义状态？
- 列表 hover / selected / active / focus 是否明显区分？
- Dialog 是否有正确的层级阴影、圆角、内容表面和头部结构？
- 桌面 / 平板 / 手机的页面 padding 是否分别为 3rem / 2rem / 1rem 级别？
- compact 模式下控件高度是否真的下降到约 `1.625rem` 级别？
- disabled 是否通过 `0.4` 级别透明度降噪，而不是彻底消失？
- focus 是否在键盘操作下稳定、清晰、可见？
- 所有状态颜色是否来自统一 token，而不是各组件各写一套？

## 14. 本文档基于的现有实现来源

本次指导主要依据当前仓库中以下类型的现有实现抽取：

- `resources/sap/ui/core/themes/sap_horizon/base.less`
- `resources/sap/ui/core/themes/sap_horizon/global.less`
- `resources/sap/ui/core/themes/sap_horizon/library-parameters.json`
- `resources/sap/m/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library.css`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/f/themes/base/library.less`
- `resources/sap/f/themes/base/library-parameters.json`

需要特别说明的是：

- 当前 SDK 包中，很多控件级 LESS 源文件已经被聚合，不再以单独 `Button.less` / `InputBase.less` 文件存在
- 因此本指南更多依据“已发布的聚合样式”和“主题参数”来提炼规则
- 这恰好更适合复刻，因为我们看到的是**真实交付结果**而不是局部源码碎片

## 15. 建议结论

如果你要基于这套风格创建一个新项目，最稳妥的策略是：

- 只选 `sap_horizon` 做第一版视觉基线
- 完整复刻 token、密度、状态、断点和 focus 规则
- 组件层用你自己的实现，不直接抄 UI5 DOM 和最终 CSS
- 保留一层接近 `sap*` 命名的 token 映射，方便后续继续对照 UI5

这样做出来的新项目，既能在视觉和 UX 上贴近现有实现，又不会被旧框架结构绑死。
