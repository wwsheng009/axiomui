# SAPUI5 SDK 样式设计体系分析

## 1. 扫描范围与结论概览

本次扫描覆盖仓库中全部 `*.css`、`*.less` 与 `.theme` 文件，共 **4024** 个样式文件。

| 指标 | 数值 |
| --- | ---: |
| CSS 文件数 | 2380 |
| LESS 文件数 | 1630 |
| `.theme` 清单文件数 | 14 |
| 样式文本总量 | 约 207.8 MB |
| 样式总行数 | 1,023,881 行 |

按顶层目录划分：

| 目录 | 文件数 | 说明 |
| --- | ---: | --- |
| `resources` | 3620 | 主体 UI5 库、主题和内置组件样式 |
| `test-resources` | 390 | 测试数据、样式回归、示例样式 |
| `docs` | 12 | 文档站和可视化文档的静态样式 |
| `theme` | 1 | 默认主题入口样式 |
| `versioninfo` | 1 | 版本信息相关样式 |

核心判断如下：

- 这个仓库的样式系统并不是普通应用级 CSS，而是 **完整的 UI5 Theming Engine 产物与源码集合**。
- 主体样式语言是 **“主题令牌 + 组件库聚合 + 编译产物”** 的三层结构，而不是组件内零散手写 CSS。
- 设计语言是明显的 **企业级设计系统**：强调语义色、可访问性、密度模式、RTL、响应式和多主题兼容。
- 样式体系正处于 **LESS 变量体系与 CSS Custom Properties 并行** 的阶段，旧体系没有被直接抛弃，而是通过映射层兼容。

## 2. 目录结构与样式资产分层

### 2.1 主体样式集中在 `resources/**/themes/**`

本次扫描中，传统主题体系相关文件约 **3291** 个，涉及 **71** 个库目录，其中 **42** 个库具备完整的 17 套以上主题覆盖。

典型的完整主题库目录结构如下：

```text
resources/<library>/themes/<theme-name>/
  library.source.less
  library.less
  library.css
  library-RTL.css
  global.less          (部分库依赖 core)
  base.less            (主要在 sap/ui/core/themes/*)
  .theme               (主要在 sap/ui/core/themes/*)
```

高频样式产物角色统计如下：

| 文件角色 | 数量 | 作用 |
| --- | ---: | --- |
| `library.css` | 847 | 编译后主样式 |
| `library-RTL.css` | 801 | RTL 方向编译产物 |
| `library.source.less` | 801 | 更接近源码的聚合入口 |
| `library.less` | 785 | 编译前中间层，带路径重写 |
| `global.less` | 26 | 全局语义映射 |
| `base.less` | 15 | 主题令牌定义或主题基座 |
| `.theme` | 14 | 主题元数据清单 |

### 2.2 主题家族不是单一主题，而是长期兼容矩阵

仓库内主流内置主题家族基本覆盖以下 17 组：

- `base`
- `sap_horizon`
- `sap_horizon_dark`
- `sap_horizon_hcb`
- `sap_horizon_hcw`
- `sap_fiori_3`
- `sap_fiori_3_dark`
- `sap_fiori_3_hcb`
- `sap_fiori_3_hcw`
- `sap_belize_base`
- `sap_belize`
- `sap_belize_plus`
- `sap_belize_hcb`
- `sap_belize_hcw`
- `sap_bluecrystal_base`
- `sap_bluecrystal`
- `sap_hcb`

除此之外，仓库中还存在少量兼容或测试主题，例如 `sap_platinum`、`customcss`、`customTheme`、`test_theme`、`legacy` 等，它们更多用于测试、向后兼容或主题参数验证，而不是当前主设计语言的中心。

### 2.3 非主题样式是少量旁支系统

非传统主题类样式主要分为 4 类：

- `resources/sap/ui/webc/**/thirdparty/css/**`：UI5 Web Components 的 Shadow DOM 样式。
- `docs/**`：文档站静态页面样式。
- `test-resources/**`：测试和样例页面样式。
- 少量业务组件内嵌样式，如 `loadingIndicator.css` 等。

这些目录存在自己的样式风格，但它们不是整个仓库主样式语言的决定因素。真正的主体仍然是 `resources/**/themes/**`。

## 3. 样式体系的核心逻辑

### 3.1 第一层：`base.less` 定义设计令牌与参数元数据

在 `resources/sap/ui/core/themes/base/base.less` 中，可以看到这套系统并不是单纯声明颜色，而是在定义一套完整的主题参数模型：

- 每个参数带有 `Label`、`Description`、`Tags`、`Category`、`Type`、`Protected` 等注释元数据。
- 参数按用途划分为品牌色、背景色、文字、交互、语义色、图片、字体等类别。
- 命名以 `@sap...` 为核心，例如 `@sapBrandColor`、`@sapBackgroundColor`、`@sapFontFamily`、`@sapNegativeColor`。

这说明样式设计的最底层不是控件，而是 **设计令牌（design tokens）**。

这一层的特征是：

- 先定义抽象语义，再由上层控件消费。
- 把“什么是品牌色、什么是警告色、什么是标题字体”作为系统级输入。
- 参数可被主题工具读取，因此具备主题编辑器与构建链兼容性。

### 3.2 第二层：主题 `base.less` 为令牌赋具体值

例如 `resources/sap/ui/core/themes/sap_horizon/base.less` 中：

- 品牌蓝使用 `#0070f2`。
- 字体明确指定 `"72", "72full", Arial, Helvetica, sans-serif`。
- 主背景、文字、语义色、对比阈值等均给出具体值。
- 大量使用 `darken(...)`、`lighten(...)`、`contrast(...)` 对派生色进行计算。

这说明每个主题家族不是重写全部控件样式，而是优先在 **令牌层** 指定自己的色彩、字体、尺寸和语义系统，然后由控件层继承。

换句话说：

- `base/base.less` 决定“有哪些主题参数”
- `sap_horizon/base.less` 决定“这些参数在 Horizon 主题下具体是多少”

### 3.3 第三层：`global.less` 做旧参数与新语义的映射桥接

`resources/sap/ui/core/themes/base/global.less` 和 `resources/sap/ui/core/themes/sap_horizon/global.less` 的结构非常明确：

- 把 `@sapBrandColor` 映射到 `@sapUiBrand`
- 把 `@sapBackgroundColor` 映射到 `@sapUiBaseBG`
- 把新的语义参数映射到历史上广泛使用的 `@sapUi*` 命名
- 同时覆盖内容、边框、阴影、空间、字体、语义背景、语义边框等大量参数

这层的意义非常大：

- 老控件仍然可以继续使用 `@sapUi*`
- 新主题令牌仍然可以往下兼容
- 整个仓库不必在一次大版本中完全切断历史变量命名

因此，`global.less` 实际上是 **旧 UI5 主题变量体系与新设计令牌体系之间的兼容桥**。

### 3.4 第四层：`library.source.less` 聚合控件库源码

每个控件库都有自己的 `library.source.less`。例如：

- `resources/sap/m/themes/base/library.source.less`
- `resources/sap/m/themes/sap_horizon/library.source.less`
- `resources/sap/ui/layout/themes/base/library.source.less`

其规律非常稳定：

1. 先导入 `sap/ui/core` 的 `base.less` 和 `global.less`
2. 再导入库自己的 `shared.less`
3. 最后导入每个控件的局部样式文件，如 `Button.less`、`Dialog.less`、`Table.less`

主题专属库入口的逻辑则是：

1. 先导入 `../base/library.source.less`
2. 再导入当前主题对应的 `sap/ui/core/themes/<theme>/base.less`
3. 再导入当前主题对应的 `global.less`
4. 最后导入当前主题下需要覆盖的控件局部样式

这说明控件库样式不是独立存在，而是运行在一条非常明确的继承链上：

```text
抽象参数定义
  -> 主题具体取值
  -> 全局语义桥接
  -> 控件库聚合
  -> 控件级局部覆盖
```

### 3.5 第五层：`library.less`、`library.css` 与 `library-RTL.css` 是构建产物

从大量 `library.less` 文件可见：

- 导入路径会被改写到 `Base/baseLib/...`
- 文件头带有 Theming Engine 版本与构建时间信息
- 说明这层已经进入构建中间态，而不是源码语义层

`library.css` 则是最终发布样式，主要特征：

- 已经编译成普通 CSS
- 内嵌 `Inline theming parameters`
- 大量主题参数会被编码进 `data:text/plain;utf-8,...` 的 `background-image` 中

这类文件数量非常高：

- 含 `Inline theming parameters` 的文件：**1624**
- 含主题参数 `data URI` 负载的文件：**1646**

`library-RTL.css` 则对应从逻辑方向到 RTL 方向的输出，总数 **801**，说明 RTL 不是补丁，而是构建时的一级产物。

结论很明确：**最终交付样式不是手工维护的单层 CSS，而是由主题引擎编译得到的发布资产。**

## 4. 项目的样式设计语言

### 4.1 令牌优先，而不是颜色优先

整个仓库最鲜明的设计语言，不是“蓝色按钮”或“灰色边框”，而是：

- 品牌色
- 语义状态色
- 内容色
- 控件状态色
- 容器边框色
- 间距与密度
- 阴影与焦点

也就是说，仓库在样式层面表达的是 **可主题化的设计语义**，而不是视觉值本身。

这让一套控件可以在 Horizon、Fiori 3、Belize、BlueCrystal、高对比主题之间切换，而不用重写结构。

### 4.2 企业级 UI 的视觉取向非常稳定

从 Horizon、Fiori 3、Belize 等主题看，整个设计语言长期保持以下取向：

- 以中性灰、蓝色品牌色、语义状态色为核心
- 大量使用 1px 边框、轻阴影、层次化背景
- 字体以 `"72"` 体系为主，兼容 Arial/Helvetica
- 视觉表达偏企业工作台，而不是营销页面
- 强调信息密度和状态可辨识，而不是高度装饰化

这意味着项目样式风格的本质是：

**企业应用设计系统 + 长周期兼容主题演进**

### 4.3 命名体系高度规则化

选择器命名有很强的库前缀规律：

- `sapUi*`：核心框架级样式
- `sapM*`：`sap.m` 移动/通用控件库
- `sapF*`：Fiori 布局与页面容器
- `sapTnt*`：工具导航等壳层组件

高频类名前缀统计中，出现最多的是：

- `sapUiSizeCompact`
- `sapContrast`
- `sapContrastPlus`
- `sapUiRespGridMedia`
- `sapUiIcon`
- `sapMBtn`

变量命名也有明显层级：

- `@sap...`：抽象主题令牌
- `@sapUi...`：兼容历史 API 的全局主题变量
- `@_sap_...`：库内部私有变量
- `--sap...`：CSS 自定义属性
- `--_ui5-...`：Web Components 内部私有变量

### 4.4 混合式变量体系：LESS 与 CSS Variables 并存

扫描结果显示：

- 唯一 LESS 变量声明约 **5745** 个
- 唯一 CSS 自定义属性声明约 **1732** 个
- 使用 CSS 变量的样式文件约 **1045** 个

按库观察，这不是“已经完全 CSS Variables 化”的系统，而是明显的过渡结构：

- `sap/tnt` 同时使用 LESS token 与 CSS variables 的文件较多
- `sap/m`、`sap/f` 也有较明显的双栈并存
- `sap/ui/webc/main/thirdparty/css` 有 **104** 个样式文件，其中 **79** 个使用 CSS 变量，**0** 个直接使用 LESS token

这说明项目当前存在两条并行样式路线：

- 传统 UI5 控件主题链：以 LESS 为主，向 CSS Variables 迁移
- Web Components 样式链：以 CSS Custom Properties 为主，偏 Shadow DOM 组件模型

### 4.5 可访问性是主干能力，不是附加能力

整个仓库对可访问性的投入非常深：

- 出现 `sapContrast` 的文件：**324**
- 出现 `sapContrastPlus` 的文件：**224**
- 高对比主题家族：`sap_horizon_hcb`、`sap_horizon_hcw`、`sap_fiori_3_hcb`、`sap_fiori_3_hcw`、`sap_hcb`
- 语义色与焦点样式在 `global.less` 中被系统化定义

这表明样式设计语言天然把以下能力纳入标准输出：

- 高对比主题
- 焦点可见性
- 语义状态颜色
- 对比阈值计算

### 4.6 密度模式是系统级规则

这套样式语言不仅区分主题，还区分交互密度：

- 包含 `sapUiSizeCompact` 的文件：**1094**
- 包含 `sapUiSizeCozy` 的文件：**550**
- 包含 `sapUiSizeCondensed` 的文件：**203**

这说明控件在设计时就考虑了：

- 桌面高密度工作场景
- 常规舒适模式
- 更紧凑的表格/信息布局模式

也就是说，这不是“换肤”，而是连布局、内边距、控件高度都可切换的设计系统。

### 4.7 响应式与方向性属于底层约束

扫描中：

- 含 `@media` 的文件：**789**
- `library-RTL.css`：**801**

大量文件还出现：

- `sapUiRespGridMedia-Std-Phone`
- `sapUiRespGridMedia-Std-Tablet`
- `sapUiRespGridMedia-Std-Desktop`
- `sapUiRespGridMedia-Std-LargeDesktop`

这说明项目样式逻辑不是简单的响应式断点，而是：

- 控件级断点
- 栅格级断点
- 布局容器级断点
- 方向级输出（LTR / RTL）

因此，响应式和 RTL 都是主题体系内部的一部分，而不是业务项目再额外补写。

## 5. 代表性子系统分析

### 5.1 `sap/ui/core/themes/*`：主题内核

这是整个样式系统的源头，职责包括：

- 定义设计令牌
- 定义语义映射
- 发布主题元数据 `.theme`
- 提供所有库都依赖的 core 主题参数

如果要改变全局品牌色、语义色、字体体系、焦点颜色、全局空间尺度，首先要看这里。

### 5.2 `sap/m/themes/*`：最典型的控件库实现

`sap.m` 的 `library.source.less` 展示了 UI5 控件库的标准写法：

- 入口文件统一导入 core 主题
- 再导入大量控件局部 LESS
- 文件顺序并非纯字母序，必要时明确注释“必须在某文件后导入”

这说明样式组织不仅是“目录拆分”，还存在明确的 **依赖顺序逻辑**。

### 5.3 `sap/ui/webc/**/thirdparty/css/**`：新式组件样式路线

这一支与传统主题库不同，特点是：

- 使用 `:host`
- 大量依赖 `var(--sap...)`
- 更接近 Shadow DOM / Web Components 的样式组织方式

因此它的设计语言更像“令牌驱动的组件局部样式”，而不是传统 UI5 的库级大聚合 LESS。

### 5.4 `docs/**`：文档站的传统静态样式

例如 `docs/guide/css/documentation.css`：

- 大量使用硬编码颜色与字号
- 字体以 Arial/Helvetica 为主
- 使用背景图标和传统内容页面布局
- 视觉风格与 UI5 主题系统不是同一层级

这部分应视为文档站点皮肤，不应和产品主题系统混为一谈。

## 6. 样式修改建议与落点判断

如果后续要在这个仓库中修改样式，建议按以下层级判断修改入口：

### 6.1 要改“设计语言”本身

例如：

- 品牌主色
- 语义状态色
- 全局字体
- 焦点样式
- 主题级背景与边框规则

应优先检查：

- `resources/sap/ui/core/themes/base/base.less`
- `resources/sap/ui/core/themes/<theme>/base.less`
- `resources/sap/ui/core/themes/<theme>/global.less`

### 6.2 要改某个控件库的共性样式

例如：

- `sap.m` 的按钮、输入框、对话框整体风格
- `sap.f` 的页面容器
- `sap.ui.layout` 的布局容器

应优先检查：

- `resources/<library>/themes/base/library.source.less`
- `resources/<library>/themes/<theme>/library.source.less`
- 对应控件的局部 `*.less`

### 6.3 不建议直接改最终发布 CSS

一般不建议直接手改：

- `library.css`
- `library-RTL.css`
- 大多数带 Theming Engine 头注释的中间产物

原因很简单：

- 这些文件明显是构建输出
- 含路径重写、内联主题参数、RTL 专用产物
- 人工修改很容易在下次构建中被覆盖

### 6.4 文档与测试样式应单独看待

对于以下目录，应按“站点静态样式”或“测试样式”处理，而不是当作主题系统主干：

- `docs/**`
- `test-resources/**`
- 少数 demo 或 thirdparty 子目录

## 7. 总结

这个仓库的样式设计语言可以概括为：

**以主题令牌为核心、通过 core 层统一映射、由各控件库聚合输出、同时兼容多主题、多密度、可访问性、响应式与 RTL 的企业级设计系统。**

从工程角度看，它不是一套“CSS 文件集合”，而是一套完整的样式平台：

- 上层是主题参数和语义模型
- 中层是控件库聚合和主题覆盖
- 下层是编译后的 CSS、RTL 和内联主题参数输出

从设计角度看，它的长期主线也很清楚：

- 视觉上持续服务企业业务应用
- 技术上持续兼容历史变量体系
- 架构上逐步向 CSS Custom Properties 与 Web Components 靠拢

## 8. 已保存文件

本次分析已保存到以下目录：

- `docs/analysis/style-design-analysis.md`
- `docs/analysis/style-scan-summary.json`
- `docs/analysis/ui5-style-recreation-guide.md`

其中：

- `style-design-analysis.md` 适合人工阅读
- `style-scan-summary.json` 适合后续脚本复查、统计对比和自动化分析
- `ui5-style-recreation-guide.md` 面向新项目复刻与实施指导
