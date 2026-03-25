# 无障碍、响应式与 RTL 说明

## 这三者为什么必须一起看

在 UI5 的实现中，可访问性、响应式和 RTL 并不是三个孤立专题，而是共同决定控件和布局是否真正可用的基础约束。

## 无障碍

### Focus

当前实现中最重要的 focus 参数包括：

- 焦点色：`#0032a5`
- 焦点宽度：`0.125rem`
- 焦点样式：`solid`

很多输入框、按钮、卡片、标题栏都通过 `::before` 或 `::after` 明确绘制 focus ring。

新项目必须保留：

- 键盘导航下清晰的焦点边界
- 在浅色和深色表面上都可见的 focus 对比
- 不依赖 hover 替代 focus

### 高对比

当前仓库保留了多套高对比主题：

- `sap_horizon_hcb`
- `sap_horizon_hcw`
- `sap_fiori_3_hcb`
- `sap_fiori_3_hcw`
- `sap_hcb`

这说明高对比不是补丁，而是主设计链的一部分。

如果新项目第一期不实现高对比主题，也应预留：

- 独立主题 class
- 高对比焦点色 token
- 高对比文本和边框 token

## 响应式

当前 UI5 主断点为：

| 断点 | 值 |
| --- | --- |
| Phone | `0 - 599px` |
| Tablet | `600 - 1023px` |
| Desktop | `1024px+` |
| XL | `1440px+` |

这些断点并不是仅用于页面，而是贯穿：

- DynamicPage
- 表单栅格
- 响应式内容 padding
- 列表与表格展示行为

新项目实现建议：

- 把断点抽成全局 token
- 布局和组件都消费同一套断点
- 页面级 padding 与容器宽度在断点切换时联动变化

## RTL

现有样式体系中 `library-RTL.css` 是标准产物，而不是事后补丁。

这意味着复刻时要有一个清晰原则：

- 优先使用逻辑方向属性，如 `padding-inline-start`
- 避免在组件里写死 `left / right`
- 所有带图标、标题栏、导航按钮的控件都要考虑方向翻转

## 新项目建议

建议为新项目预留如下结构：

```css
.theme-horizon {}
.theme-horizon-dark {}
.theme-horizon-hcb {}
.theme-horizon-hcw {}

[dir='rtl'] {}
```

并且确保：

- focus 规则独立于 hover
- 响应式断点独立于组件实现
- RTL 独立于具体页面

## 验收重点

- 用键盘 Tab 可完整走通主交互链
- 手机上页面 padding 和内容区宽度明显收敛
- 在 `dir='rtl'` 下图标、按钮、标题区对齐仍然合理
- 高对比主题即便未上线，也具备 token 入口
