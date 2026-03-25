# Page 与 Dynamic Page 布局

## 设计意图

Page 与 Dynamic Page 是 UI5 企业页面组织的核心。它们的设计目标不是做营销页，而是稳定承载：

- 标题区
- 筛选区或摘要区
- 主内容区
- 可选浮动页脚

## Dynamic Page 的关键规则

根据现有实现：

- 容器宽高占满
- 标题区和头部区可以独立悬浮在内容区之上
- 主内容区按设备切换 padding
- 页脚可浮起，并要求内容区为其预留空间

### 内容内边距

| 设备 | 建议值 |
| --- | --- |
| Desktop | `3rem 3rem 0 3rem` |
| Tablet | `2rem 2rem 0 2rem` |
| Phone | `2rem 1rem 0 1rem` |

### 页脚

| 项 | 值 |
| --- | --- |
| 默认高度 | `3rem` |
| Compact 高度 | `2.5rem` |
| 底部 margin | `0.5rem` |

## Page 的关键规则

从 `sap.m.Page` 相关样式可看到：

- Page 自己负责主容器和 section 滚动区
- Header、SubHeader、Footer 与 section 是明确分层
- Floating Footer 会改变内容区预留空间

## 新项目复刻建议

建议你把所有业务页面统一抽象成：

```text
page
  -> page header
  -> sub header / filter bar
  -> page content
  -> page footer
```

不要让每个业务页自行决定：

- 内容起始 padding
- header 与内容的关系
- footer 是否覆盖内容

## 推荐规则

- 标题区始终高于内容区一层
- 内容区以 token 管理 padding
- 浮动页脚必须显式预留空间
- 手机端不要沿用桌面 3rem 横向 padding

## 验收重点

- 标题区、内容区、页脚区层次明确
- 浮动页脚出现后内容不被压住
- 手机与桌面的页面节奏明显不同
