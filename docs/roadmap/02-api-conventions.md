# 02 API Conventions

## 目标

在多人并行实现组件时，保持 API 风格、目录结构、token 使用方式和测试要求一致，减少返工和割裂感。

## 通用命名约定

### 输入类组件

推荐统一使用：

- `value`
- `defaultValue`
- `onValueChange`
- `disabled`
- `readOnly`
- `required`
- `placeholder`
- `valueState`
- `helpText`
- `name`
- `id`

避免同类组件混用：

- `onChange` 和 `onValueChange`
- `error` 和 `valueState`
- `hint` 和 `helpText`

### 弹层类组件

推荐统一使用：

- `open`
- `defaultOpen`
- `onOpenChange`
- `anchorRef`
- `placement`
- `disabled`

### 展示类组件

推荐统一使用：

- `title`
- `subtitle`
- `description`
- `status`
- `actions`
- `meta`

## Provider 约定

### ThemeProvider

- 主题名使用稳定枚举，不暴露内部 CSS 变量命名
- 统一管理 `theme`、`density`、`dir`
- 组件内部优先消费 context，而不是自己读 DOM attribute

### LocaleProvider

- 统一管理 `locale`
- 暴露基础格式化能力
- `locale` 与 `dir` 解耦，不要把语言和方向强行绑定

## valueState 约定

统一使用下列状态值：

- `none`
- `success`
- `warning`
- `error`
- `information`

组件至少需要处理：

- 文本颜色
- 边框颜色
- 图标颜色
- help text 颜色
- focus 态与 valueState 的叠加关系

## 图标约定

- 组件优先支持命名式图标，如 `iconName`
- 复杂自定义场景可额外保留 `icon` slot
- 图标颜色默认继承当前文本色，特殊状态由 semantic tokens 控制
- 可镜像图标要显式声明 RTL mirroring 行为

## token 约定

### 不允许

- 在组件 CSS 中新增裸色值
- 在组件层直接使用具体主题名
- 用布局值表达业务语义，如 `--ax-blue-border`

### 推荐

- 使用 semantic token，如 `--ax-color-border-strong`
- 把尺寸、密度、间距、状态色分开管理
- 在 `packages/tokens/src/themes/*` 中维护主题覆盖，而不是在组件 CSS 中分主题写死

## 目录约定

### 组件目录

每个组件目录建议包含：

- `component-name.tsx`
- `component-name.css`
- `component-name.test.tsx`
- `index.ts`，如果组件族较大时再加

### docs 目录

演示页不要长期堆积在单一入口文件里，建议拆分：

- `theme-lab`
- `form-lab`
- `worklist-advanced`
- `shell-lab`
- `object-page-lab`
- `chart-lab`

## 测试约定

每个组件至少覆盖：

- 正常渲染
- disabled/readOnly
- keyboard 主路径
- valueState
- RTL 或 locale 中至少一种跨环境用例

复杂组件额外覆盖：

- overlay 开关
- 焦点回收
- 空态
- 极值或边界值

## a11y 约定

- 所有可操作控件都需要明确 focus path
- 组合控件要有明确 role，如 `listbox`、`menu`、`dialog`
- 状态变更尽量提供可感知文案，不只依赖颜色
- 图表组件必须提供摘要文本或 aria label

## docs 约定

每个新组件至少提供两类示例：

- `基础示例`
- `真实业务示例`

真实业务示例优先放入：

- FilterBar
- Worklist
- ToolPage
- ObjectPage
- KPI Card

## 导出约定

- 所有公共组件和 hooks 必须通过 [packages/react/src/index.ts](../../packages/react/src/index.ts) 统一导出
- 不暴露明显临时性的内部 helper
- provider、hooks、types、components 的导出顺序保持稳定
