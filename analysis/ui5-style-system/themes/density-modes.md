# 密度模式说明

## 设计意图

UI5 的密度模式不是简单地“放大或缩小”，而是一整套工作场景适配机制。它决定：

- 控件高度
- 内边距
- 行高
- 图标槽位
- 页面可容纳的信息量

## 三种主要模式

### Cozy

适合：

- 普通表单
- 平板和触控场景
- 需要更舒适点击区的桌面场景

现代 Horizon 基准中，元素高度约为：

- `2.25rem`

### Compact

适合：

- 企业桌面工作台
- 数据密集界面
- 表格、筛选、表单等高频操作场景

现代 Horizon 基准中，元素高度约为：

- `1.625rem`

### Condensed

适合：

- 极高密度表格
- 只在特定场景使用

现代 Horizon 基准中，元素高度约为：

- `1.375rem`

## 当前实现中的证据

从现有参数和样式可看到：

- `sapElement_Height = 2.25rem`
- `sapElement_Compact_Height = 1.625rem`
- `sapElement_Condensed_Height = 1.375rem`
- 大量控件含 `sapUiSizeCompact`
- 部分密集场景使用 `sapUiSizeCondensed`

## 新项目实现建议

建议把密度模式设计成页面级或容器级 class：

```css
.density-cozy {}
.density-compact {}
.density-condensed {}
```

或兼容 UI5 命名：

```css
.sapUiSizeCompact {}
.sapUiSizeCondensed {}
```

## 必须联动变化的内容

密度切换时，至少要联动下面这些属性：

- 控件高度
- 水平 padding
- 垂直 padding
- 图标宽度
- 输入框内边距
- 列表项高度
- 页脚/工具栏高度

不要只改字体，否则会导致：

- 视觉比例失衡
- 点击区不合规
- 标签和输入框错位

## 复刻建议

第一版新项目建议至少实现：

- Cozy
- Compact

Condensed 可以预留 token，但不一定第一期必须做全覆盖。

## 验收标准

- Compact 模式下，按钮、字段、列表行都明显更紧凑
- 表单标签与输入区仍然对齐
- 焦点边界没有因为高度下降而溢出
- 图标与文字没有被压得过于拥挤
