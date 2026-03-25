# App Shell 与 Shell Bar 布局

## 角色定位

App Shell 是企业应用最上层的壳。它负责：

- 应用标题与品牌识别
- 全局导航和入口按钮
- 搜索
- 用户、通知、产品切换等全局操作

在 UI5 中，这一层最有代表性的实现是 `sap.f.ShellBar`。

## 视觉基准

根据现有参数与样式：

- Shell Bar 高度约 `3.25rem`
- 大桌面 padding 约 `3rem`
- 常规桌面 padding 约 `2rem`
- 手机 padding 约 `1rem`

颜色逻辑上：

- 背景通常较浅
- 文本用壳层文字色
- hover / active 主要通过中性背景变化表达
- 搜索框嵌入在顶部壳层中，但仍消费统一 field token

## 结构建议

新项目中的 app shell 建议拆成以下区域：

```text
shell
  -> brand / home
  -> primary title
  -> optional second title
  -> global search
  -> action buttons
  -> profile / product menu
```

## 复刻约束

- 顶栏按钮应使用比普通页面按钮更轻的样式
- 顶栏搜索框应保留统一 field 语言，但形态可更偏胶囊
- 顶栏是全局层，不建议随业务页自由改变高度和间距
- 手机上的壳层必须明显收缩横向留白

## 新项目实现建议

- 统一定义 shell padding token
- 把壳层按钮和页面按钮分成两套 component variants
- 顶栏搜索只做一个标准版本，不要每个业务页自造一个

## 验收重点

- 桌面和手机的左右留白明显不同
- 顶栏按钮 hover / active 与页面按钮同语义、不同语气
- 搜索框与动作按钮在视觉上属于同一层
