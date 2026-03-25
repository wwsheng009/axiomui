# Horizon 视觉基准

## 为什么选 Horizon

如果要为新项目建立一套最接近当前 UI5 主流实现的视觉基准，`sap_horizon` 是最合适的起点。它比早期的 Belize、BlueCrystal 更现代，也比单纯看 `base` 更接近真实上线体验。

## 颜色基准

以下是新项目复刻时应优先保留的 Horizon 核心色：

| 角色 | 值 | 用途 |
| --- | --- | --- |
| 品牌主色 | `#0070f2` | 主操作、主强调 |
| 高亮色 | `#0064d9` | 选中、hover、信息态 |
| 页面背景 | `#f5f6f7` | 应用主背景 |
| 主表面 | `#ffffff` | 卡片、Dialog、字段内容面 |
| 主文字 | `#131e29` | 标题、正文 |
| 次级文字 | `#556b82` | 标签、说明、状态说明 |
| hover 面 | `#eaecee` | 中性 hover 背景 |
| active 面 | `#dee2e5` | 中性 active 背景 |
| 错误色 | `#aa0808` | 错误文字/边框/图标 |
| 警告色 | `#e76500` | 警告态 |
| 成功色 | `#256f3a` | 成功态 |
| 信息色 | `#0070f2` | 信息态 |
| 焦点色 | `#0032a5` | focus ring |

## 字体基准

字体栈：

- 默认：`"72", "72full", Arial, Helvetica, sans-serif`
- 标题：`"72-Bold", "72-Boldfull", "72", "72full", Arial, Helvetica, sans-serif`
- 等宽：`"72Mono", "72Monofull", lucida console, monospace`

常用字号：

| 层级 | 值 |
| --- | --- |
| 正文 | `0.875rem` |
| 小字 | `0.75rem` |
| 大正文 | `1rem` |
| H1 | `3rem` |
| H2 | `2rem` |
| H3 | `1.5rem` |
| H4 | `1.25rem` |
| H5 | `1rem` |
| H6 | `0.875rem` |

## 空间尺度

Horizon 的空间尺度可以直接作为新项目的 spacing token：

| token | 值 |
| --- | --- |
| Tiny | `0.5rem` |
| Small | `1rem` |
| Medium | `2rem` |
| Large | `3rem` |
| Gap | `1rem` |

实践建议：

- 控件内 padding 多落在 `0.5rem` 到 `0.75rem`
- 卡片、Dialog、表单分组内容 padding 以 `1rem` 为主
- 页面级横向 padding 在不同断点下切换为 `1rem / 2rem / 3rem`

## 圆角基准

Horizon 不是“统一所有元素一个圆角”，而是按角色区分：

| 场景 | 建议值 |
| --- | --- |
| 通用元素 | `0.75rem` |
| 按钮 | `0.5rem` |
| 字段 focus 边界 | `0.25rem` |
| token / chip | `0.375rem` |
| 圆形按钮 / 头像 | `50%` |

## 阴影基准

Horizon 用阴影表达层级，但保持克制：

| 层级 | 建议用途 |
| --- | --- |
| `Shadow0` | 普通卡片、轻浮层 |
| `Shadow1` | 中等级浮层、Focus 辅助 |
| `Shadow2` | hover 卡片、较强浮层 |
| `Shadow3` | Dialog、重浮层 |

复刻原则：

- 阴影应该服务层次，不服务装饰
- hover 阴影可增强，但不应让页面显得嘈杂

## 视觉性格

Horizon 的整体气质是：

- 明亮、克制、企业感强
- 强调可读性和长时间使用舒适度
- 蓝色主要用于强调，而不是铺满大面积背景
- 通过中性表面、清晰边框和统一状态色组织层级

## 新项目落地建议

如果你只做第一版视觉基线，可以直接建立一套 `theme-horizon.css`：

- 用本文中的颜色、字体、圆角、阴影和 spacing 作为基础 token
- 把所有组件都消费这些 token
- 不要在组件里再单独发明新的视觉主张

这样后续要扩展深色、高对比或者品牌替换时，会容易很多。
