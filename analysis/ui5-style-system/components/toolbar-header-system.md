# Toolbar 与 Header 系统

## 角色定位

Toolbar 和 Header 负责把动作、标题、过滤器和次级导航组织成可复用的顶部区域。UI5 在这一层不是只有一个组件，而是分成三种明显不同的密度与职责。

## 三个层级

- `sapMTB` / `sapMOverflowToolbar`：轻量动作条，强调收纳、溢出和次级操作。
- `sapMBar` / `sapMIBar`：结构性页头，负责 left / middle / right 三段布局。
- 专用 Header：如 `sapTnt.ToolHeader`、`sap.f.ShellBar` 的内部 OTB、`DynamicPageTitle` 的 actions bar。

## 关键尺寸与实现信号

- 普通 Toolbar 高度 token 约 `2rem`。
- Toolbar 收缩项最小宽度约 `2.5rem`。
- 结构性 `sapMBar` 在 base 中常见高度约 `3rem`，compact 下约 `2rem`。
- `sapMBar` 使用 left / middle / right 三段容器，并带统一 header shadow。
- `sapTnt.ToolHeader` 在 shell 语境下常见高度约 `2.75rem`。
- `sapFShellBar` 内部 overflow toolbar 常见高度约 `3rem`。

这些差异说明 UI5 很清楚地区分了“局部动作条”和“结构性页面头部”。

## 结构建议

```text
header
  -> start / navigation
  -> title / middle
  -> actions / overflow / profile
```

不要把所有东西都塞进一个无语义 flex 容器。页头、工具栏、壳层头部应该保留不同的布局职责。

## 复刻约束

- 页头按钮应复用按钮系统的透明或轻量变体，不应单独发明新按钮。
- Overflow 行为要作为 toolbar 一级能力，而不是页面宽度不够时临时隐藏按钮。
- 结构性 header 高度不要由业务页面任意决定。
- `DynamicPageTitle`、`ToolHeader`、`ShellBar` 可以共享排版语法，但不要强行用同一高度。

## 新项目落地建议

- 先实现一个轻量 toolbar 和一个结构性 header，再扩展 shell/tool header。
- 把 `start / middle / end` 三段容器做成标准 API。
- 允许 toolbar 内嵌搜索、筛选、分段按钮，但保持统一高度基线。
- 壳层头部和页面头部保持同语义、不同语气，不要混成一层。

## 主要实现来源

- `resources/sap/m/themes/base/library.less`
- `resources/sap/tnt/themes/base/library.less`
- `resources/sap/f/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
