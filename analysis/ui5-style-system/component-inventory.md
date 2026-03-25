# UI5 样式系统导航清单

## 目的

这份清单用于把“现有 UI5 风格里到底有哪些主题、布局、组件需要看”梳理成一张导航图，避免后续查资料时在大量 `library.less` 和 `library.css` 之间来回跳。

## 执行规格

| 文档 | 说明 | 对应文档 |
| --- | --- | --- |
| 执行规格 | 把主题、布局、组件分析收束成可实施的交付物、状态矩阵、实现顺序和验收清单 | `implementation-spec.md` |
| 核心状态矩阵 | 把 Button、Field、List、Dialog 四组核心组件落成可直接实现的状态矩阵与验收项 | `core-component-state-matrices.md` |
| 第二批状态矩阵 | 把 Card、Toolbar/Header、Tabs/Navigation、Message/Feedback 四组组件继续压成可直接实现的状态矩阵与验收项 | `secondary-component-state-matrices.md` |

## 主题清单

| 主题主题域 | 说明 | 对应文档 |
| --- | --- | --- |
| 主题架构 | 解释 `base.less -> global.less -> library.*` 的链路 | `themes/theme-architecture.md` |
| Horizon 基准 | 提炼现代主题的核心颜色、字体、圆角、阴影、间距 | `themes/horizon-baseline.md` |
| Token 映射 | 说明 `@sap*`、`@sapUi*`、`--sap*` 三层关系 | `themes/token-mapping.md` |
| 密度模式 | Cozy / Compact / Condensed 的高度、内边距、节奏 | `themes/density-modes.md` |
| 无障碍与响应式 | Focus、高对比、断点、RTL | `themes/accessibility-responsive-rtl.md` |

## 布局清单

| 布局域 | 说明 | 对应文档 |
| --- | --- | --- |
| App Shell / Shell Bar | 应用壳层、顶部工具条、搜索与导航行为 | `layouts/app-shell-and-shellbar.md` |
| Page / Dynamic Page | 页面头、标题区、内容区、浮动页脚 | `layouts/page-and-dynamic-page.md` |
| Form / Responsive Grid | 表单栅格、标签列、断点与密度变化 | `layouts/form-and-responsive-grid.md` |
| Card / Split Layout | 卡片面板、看板、双栏/三栏布局 | `layouts/card-and-split-layouts.md` |

## 组件清单

| 组件族 | 说明 | 对应文档 |
| --- | --- | --- |
| Button | 默认、强调、语义按钮、透明按钮、选择态 | `components/button-system.md` |
| Field / Input | 输入框、带图标字段、状态字段、只读字段 | `components/field-and-input-system.md` |
| Select / Search / Picker | Select、SearchField、Popover、Picker 类交互 | `components/select-search-picker-system.md` |
| List / Table | 列表项、表格行、hover/selected/active/focus 规则 | `components/list-table-system.md` |
| Dialog / Popover | 对话框、操作表、弹层、滚动与分层 | `components/dialog-and-popover-system.md` |
| Card | 卡片、Header、交互卡片、卡片内容态 | `components/card-system.md` |
| Toolbar / Header | 工具栏、页头、壳层动作条和标题动作区 | `components/toolbar-header-system.md` |
| Tabs / Navigation | IconTabBar、页内二级导航、溢出与状态徽章 | `components/tabs-navigation-system.md` |
| Message / Feedback | MessageStrip、MessagePage、反馈输入和通知反馈 | `components/message-feedback-system.md` |

## 复刻优先级建议

如果你是从零创建新项目，建议按下面优先级推进：

### 第一阶段

- `themes/horizon-baseline.md`
- `themes/token-mapping.md`
- `themes/density-modes.md`
- `layouts/page-and-dynamic-page.md`
- `components/button-system.md`
- `components/field-and-input-system.md`

### 第二阶段

- `components/list-table-system.md`
- `components/dialog-and-popover-system.md`
- `layouts/form-and-responsive-grid.md`
- `layouts/app-shell-and-shellbar.md`

### 第三阶段

- `components/card-system.md`
- `components/select-search-picker-system.md`
- `components/toolbar-header-system.md`
- `components/tabs-navigation-system.md`
- `components/message-feedback-system.md`
- `layouts/card-and-split-layouts.md`

## 对应实现来源

本清单主要基于以下发布资产和参数文件整理：

- `resources/sap/ui/core/themes/sap_horizon/base.less`
- `resources/sap/ui/core/themes/sap_horizon/global.less`
- `resources/sap/ui/core/themes/sap_horizon/library-parameters.json`
- `resources/sap/m/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library.css`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
- `resources/sap/f/themes/base/library.less`
- `resources/sap/f/themes/base/library-parameters.json`
- `resources/sap/tnt/themes/base/library.less`
- `resources/sap/ui/layout/themes/base/library.less`

## 实用说明

如果你后续还想继续把文档细化到单一控件，例如只拆 `SearchField` 或只拆 `DynamicPageTitle`，可以在现有目录结构上继续扩展，但建议仍然保留“组件族”视角，因为这样更接近 UI5 真实的设计复用方式。
