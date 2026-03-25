# Token 映射与命名策略

## 目标

这份文档解释 UI5 中三类常见 token 命名为什么会同时存在，以及在新项目中该如何保留这种映射关系。

## 三层命名结构

### 1. 抽象主题 token

常见命名：

- `sapBrandColor`
- `sapBackgroundColor`
- `sapTextColor`
- `sapNegativeColor`

这层的职责是表达“设计含义”，不是直接绑定某个控件。

### 2. UI5 兼容语义 token

常见命名：

- `sapUiBrand`
- `sapUiBaseBG`
- `sapUiBaseText`
- `sapUiContentFocusColor`

这层主要来自 `global.less`，作用是给历史 UI5 控件和库提供稳定语义入口。

### 3. CSS 自定义属性

常见命名：

- `--sapButton_Background`
- `--sapField_BorderColor`
- `--sapContent_FocusColor`
- `--sapGroup_ContentBackground`

这是现代主题和 Web Components 更容易直接消费的一层。

## 为什么这三层要同时保留

因为 UI5 的历史跨度很长：

- 老控件习惯用 `@sapUi*`
- 主题系统底层参数仍来自 `@sap*`
- 现代样式和运行时切换又越来越依赖 `--sap*`

因此它不是冗余，而是兼容链条。

## 新项目推荐的 token 组织方式

### 第一层：foundation

```css
:root {
  --brand-primary: #0070f2;
  --surface-page: #f5f6f7;
  --text-primary: #131e29;
  --focus-color: #0032a5;
}
```

### 第二层：semantic

```css
:root {
  --color-positive-text: #256f3a;
  --color-negative-text: #aa0808;
  --color-warning-text: #b44f00;
  --color-info-text: #0064d9;
}
```

### 第三层：UI5 compatibility alias

```css
:root {
  --sapBrandColor: var(--brand-primary);
  --sapBackgroundColor: var(--surface-page);
  --sapTextColor: var(--text-primary);
  --sapContent_FocusColor: var(--focus-color);
}
```

### 第四层：component tokens

```css
:root {
  --sapButton_Background: #ffffff;
  --sapButton_TextColor: #0064d9;
  --sapField_BorderColor: #bcc3ca;
}
```

## 推荐命名原则

- 基础 token 用更通用的项目命名
- 语义 token 用含义命名，不用具体颜色名
- 兼容映射层保留 `sap*` 命名，方便对照 UI5
- 组件 token 用 `component + role` 命名，例如 `button + background`

## 不建议的做法

- 组件里直接写 `#0070f2`
- 各组件各自定义自己的错误红色
- 跳过兼容映射层，导致以后难以继续对照 UI5

## 结论

如果要复刻 UI5 风格，最好的策略不是照搬 UI5 所有变量名，而是：

- 保留一层 `sap*` 兼容映射
- 让你自己的设计系统命名仍然清晰
- 把 UI5 token 当成参考接口，而不是唯一命名方式
