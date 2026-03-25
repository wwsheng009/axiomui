# UI5 样式系统拆分文档索引

## 文档目标

这套文档用于把当前仓库中的 UI5 样式实现拆成可独立阅读的说明文档，方便你在新项目中按“主题 / 布局 / 组件”三个层面理解和复刻。

建议阅读顺序：

1. 先看主题文档，建立 token、密度、响应式、无障碍的统一认知
2. 再看布局文档，理解应用壳层、页面容器和内容结构
3. 最后看组件文档，把按钮、字段、列表、Dialog 等落到具体实现

## 文档总览

### 总览与导航

- [component-inventory.md](component-inventory.md)
- [implementation-spec.md](implementation-spec.md)
- [core-component-state-matrices.md](core-component-state-matrices.md)
- [secondary-component-state-matrices.md](secondary-component-state-matrices.md)

### 主题

- [themes/theme-architecture.md](themes/theme-architecture.md)
- [themes/horizon-baseline.md](themes/horizon-baseline.md)
- [themes/token-mapping.md](themes/token-mapping.md)
- [themes/density-modes.md](themes/density-modes.md)
- [themes/accessibility-responsive-rtl.md](themes/accessibility-responsive-rtl.md)

### 布局

- [layouts/app-shell-and-shellbar.md](layouts/app-shell-and-shellbar.md)
- [layouts/page-and-dynamic-page.md](layouts/page-and-dynamic-page.md)
- [layouts/form-and-responsive-grid.md](layouts/form-and-responsive-grid.md)
- [layouts/card-and-split-layouts.md](layouts/card-and-split-layouts.md)

### 组件

- [components/button-system.md](components/button-system.md)
- [components/field-and-input-system.md](components/field-and-input-system.md)
- [components/select-search-picker-system.md](components/select-search-picker-system.md)
- [components/list-table-system.md](components/list-table-system.md)
- [components/dialog-and-popover-system.md](components/dialog-and-popover-system.md)
- [components/card-system.md](components/card-system.md)
- [components/toolbar-header-system.md](components/toolbar-header-system.md)
- [components/tabs-navigation-system.md](components/tabs-navigation-system.md)
- [components/message-feedback-system.md](components/message-feedback-system.md)

## 使用建议

如果你的目标是“基于现有 UI5 风格创建新项目”，推荐这样用：

- 主题层：直接把 `sap_horizon` 作为第一版视觉基线
- 布局层：优先复刻 app shell、page、dynamic page、form grid
- 组件层：先做 button、field、list、dialog、card，再做次级导航与消息组件
- 执行层：最后结合 `implementation-spec.md` 收敛实现顺序、状态矩阵和验收口径
- 状态层：如果开始进入实现与验收，先用 `core-component-state-matrices.md` 对齐 button、field、list、dialog，再用 `secondary-component-state-matrices.md` 对齐 card、header、navigation、feedback

如果你的目标是“分析当前 SDK 的样式设计语言”，建议配合以下已有文档一起看：

- `docs/analysis/style-design-analysis.md`
- `docs/analysis/ui5-style-recreation-guide.md`
- `docs/analysis/style-scan-summary.json`

## 约定

这套拆分文档不按 UI5 全部控件逐个写成百科，而是按“复刻时真正有设计意义的组件族和布局族”来拆。原因是 UI5 控件数很多，但大量控件在视觉和 UX 约束上继承自同一套 token 与状态模型。

因此，这套文档的拆分方式更适合：

- 新项目设计系统搭建
- 复刻现有 UI 规范
- 做组件库迁移或重写
