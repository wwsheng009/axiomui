# 主题架构说明

## 核心判断

当前仓库的样式体系本质上不是一组零散 CSS，而是一套完整的主题引擎体系。它的稳定主线是：

```text
base theme tokens
  -> theme-specific token values
  -> global semantic aliases
  -> library theme aggregation
  -> compiled css / rtl css / inline theme payload
```

## 结构分层

### 1. 参数定义层

来源主要在：

- `resources/sap/ui/core/themes/base/base.less`

这一层负责声明主题参数模型，例如：

- 品牌色
- 背景色
- 正文文字色
- 语义状态色
- 字体族
- 阴影、圆角、间距、边框宽度

这里最关键的不是具体视觉值，而是“系统支持哪些设计参数”。

### 2. 主题取值层

来源主要在：

- `resources/sap/ui/core/themes/sap_horizon/base.less`
- 其他主题的同名 `base.less`

这一层为同一套抽象参数赋具体值，例如：

- `sapBrandColor`
- `sapBackgroundColor`
- `sapTextColor`
- `sapContent_FocusColor`

它决定不同主题家族的视觉差异，但并不直接写控件结构。

### 3. 全局映射层

来源主要在：

- `resources/sap/ui/core/themes/base/global.less`
- `resources/sap/ui/core/themes/sap_horizon/global.less`

这一层负责把主题参数映射到更广泛使用的语义命名，例如：

- `@sapBrandColor -> @sapUiBrand`
- `@sapBackgroundColor -> @sapUiBaseBG`
- `@sapContent_* -> @sapUiContent*`

这层的意义是兼容历史变量体系，同时为各个控件库输出统一语义接口。

### 4. 控件库聚合层

来源主要在：

- `resources/sap/m/themes/*/library.source.less`
- `resources/sap/f/themes/*/library.source.less`
- `resources/sap/ui/layout/themes/*/library.source.less`

这里会先导入 core 主题，再导入库自己的共享样式和控件规则。

这说明 UI5 的控件设计逻辑是：

- 先拿到统一 token
- 再做库级聚合
- 最后做局部控件覆盖

### 5. 构建产物层

来源主要在：

- `library.less`
- `library.css`
- `library-RTL.css`
- `library-parameters.json`

这些文件是实际发布时最重要的交付层。其中：

- `library.less` 更接近中间产物
- `library.css` 是最终发布 CSS
- `library-RTL.css` 是方向变体
- `library-parameters.json` 是最终 token 取值快照

## 复刻时应如何使用这条链路

如果你是为新项目复刻样式，不建议直接改最终 `library.css`，而应采用下面的思路：

1. 从 `library-parameters.json` 抽取当前主题的最终 token
2. 按新项目框架建立自己的 token 层
3. 用主题 token 生成组件样式
4. 再根据密度、断点和高对比模式添加派生覆盖

原因是：

- 最终 CSS 强绑定 UI5 的 DOM 和类名结构
- 但 token 与语义规则可以迁移到任何新项目

## 新项目的推荐对应关系

| UI5 层 | 新项目建议层 |
| --- | --- |
| `base.less` | `foundation tokens` |
| `theme/base.less` | `theme tokens` |
| `global.less` | `semantic alias tokens` |
| `library.source.less` | `component family styles` |
| `library.css` | `compiled distribution styles` |

## 关键结论

如果你只记一个结论，那就是：

**复刻 UI5 风格时，应该复刻它的主题链路和约束，不应该直接照搬它的最终 CSS 结构。**
