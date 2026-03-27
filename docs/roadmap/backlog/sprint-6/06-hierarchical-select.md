# S6-06 HierarchicalSelect

## Type

- Component Task

## Summary

基于 `Tree`、popover 和字段基元实现 `HierarchicalSelect`，用于组织、成本中心、科目树等层级选择场景。

## Goal

- 让层级选择和现有表单输入语义保持一致
- 避免业务方自行拼接 tree plus popover plus field 的不稳定组合
- 复用现有 `Select` / `ComboBox` / `ResponsivePopover` 的表单与弹层语义，而不是再造一套字段壳层

## Scope

- In scope:
  - trigger field
  - popover tree
  - selected summary
  - valueState or helpText integration
  - compact or cozy support
- Out of scope:
  - 远程搜索
  - 无限层级虚拟滚动
  - 多选 tokenized 交互
  - 自定义 async loading contract

## Current Snapshot

- 截至 `2026-03-27`，React 包中还没有独立的 `HierarchicalSelect` 组件，也没有 `packages/react/src/components/hierarchical-select` 目录。
- 当前仓库中已经存在可复用的字段和弹层模式：`Select`、`ComboBox`、`MultiComboBox`、`Popover`、`ResponsivePopover`。
- `S6-05 Tree` 仍未落地，因此 `S6-06` 目前只能作为组合层规划；它的前提是先冻结 tree 的通用 item/expanded/selected/focus contract。

## Current Codebase Context

- [packages/react/src/components/select/select.tsx](/E:/projects/axiomui/packages/react/src/components/select/select.tsx) 已经定义了字段标签、description、message、`valueState`、trigger 和列表弹层的基本结构；`HierarchicalSelect` 应尽量沿用这套字段语义。
- [packages/react/src/components/combo-box/combo-box.tsx](/E:/projects/axiomui/packages/react/src/components/combo-box/combo-box.tsx) 展示了输入型字段在受控/非受控值、打开/关闭、描述文案和焦点恢复上的既有模式；即使 `HierarchicalSelect` 不需要自由文本输入，也应沿用类似的 control lifecycle。
- [packages/react/src/components/multi-combo-box/multi-combo-box.tsx](/E:/projects/axiomui/packages/react/src/components/multi-combo-box/multi-combo-box.tsx) 体现了选中摘要和溢出摘要的现有模式；`HierarchicalSelect` 后续需要在“字段收起态仍清晰可读”这点上与这类组件保持一致。
- [packages/react/src/components/responsive-popover/responsive-popover.tsx](/E:/projects/axiomui/packages/react/src/components/responsive-popover/responsive-popover.tsx) 已提供小屏下 sheet fallback，大屏下 anchored popover 的统一壳层，因此 `HierarchicalSelect` 应优先复用它，而不是直接绑定桌面 Popover。
- [docs/roadmap/backlog/sprint-6/05-tree-primitives.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-6/05-tree-primitives.md) 定义的 `Tree` contract 将是 `HierarchicalSelect` 的核心依赖；`S6-06` 不应反过来决定 tree 的基础模型。

## Planned File Areas

- `packages/react/src/components/hierarchical-select/*`
- `packages/react/src/components/tree/*`
- `packages/react/src/styles/index.css`
- `packages/react/src/index.ts`

## 推荐文件清单

建议把 `S6-06` 控制在下面这组文件和职责内：

- `packages/react/src/components/hierarchical-select/hierarchical-select.tsx`
  主组件，负责 trigger field、open/close、tree 挂载、value/summary 渲染和 `valueState` / description / message 编排。
- `packages/react/src/components/hierarchical-select/hierarchical-select-state.ts`
  抽取 selected item lookup、path summary、expanded ancestor 计算和 open 时 focus 目标等轻量状态 helper，避免这些逻辑散到 JSX。
- `packages/react/src/components/hierarchical-select/hierarchical-select-copy.ts`
  维护 trigger aria label、clear/remove 文案、空态文案和层级路径摘要文案，继续沿用集中 helper 模式。
- `packages/react/src/components/hierarchical-select/hierarchical-select.css`
  字段壳层内的 summary、placeholder、popover body 和小屏 sheet 内容样式。
- `packages/react/src/components/hierarchical-select/hierarchical-select.test.tsx`
  覆盖 open/close、键盘 tree 导航、selected summary、`valueState` / help text、小屏 fallback 和 RTL。
- `packages/react/src/components/tree/*`
  仅在 tree contract 不足时做最小共享扩展，例如受控 selected keys、focus target 或 path helper；不应把字段或弹层逻辑反向塞进 tree 基元。
- `packages/react/src/index.ts`
  暴露 `HierarchicalSelect` 及其类型。
- `packages/react/src/styles/index.css`
  注册 `hierarchical-select.css`，并将 `.ax-hierarchical-select` 纳入根类名列表。

## 文件级实施顺序

1. 先冻结 `HierarchicalSelect` 的值模型。
   建议 `v1` 先以单选层级节点为主，明确 `value`、`onValueChange`、`selected item summary` 和 `clearable` 等 contract，避免一开始就把多选树、token summary 和异步搜索一起卷进来。
2. 再接字段和弹层壳层。
   在 `hierarchical-select.tsx` 中先把 trigger field、description、message、`valueState` 和打开/关闭生命周期接好，保持与 `Select` / `ComboBox` 一致的表单语义。
3. 再挂 `Tree`。
   `HierarchicalSelect` 自己负责把 value 映射到 selected summary、expanded ancestors 和 focus target，但不应在这里重新实现 tree 的展开、焦点和层级导航规则。
4. 再补路径摘要与空态。
   `hierarchical-select-state.ts` 和 `hierarchical-select-copy.ts` 负责把选中节点路径转成收起态可读 summary，并定义无选择、禁用和无可选节点时的文案。
5. 最后补小屏退化和回归测试。
   使用 `ResponsivePopover` 处理小屏 sheet fallback，随后回归 `Tree` 键盘规则和字段 `aria-describedby` / `valueState` 语义。

## 与 Tree / Select / ResponsivePopover 的明确边界

`S6-06 HierarchicalSelect` 应直接复用以下能力：

- `Tree` 的 nested items、expanded/selected/focus contract
- `Select` / `ComboBox` 的字段标签、description、message 和 `valueState` 模式
- `ResponsivePopover` 的 anchored popover / small-screen sheet fallback
- 现有 overlay 焦点恢复与 dismiss 语义

`S6-06` 自己新增的范围应限定在：

- trigger field 与 tree 弹层的组合
- selected path summary
- 层级节点到字段值的映射
- field-level clear/open/close 交互

`S6-06` 不应再重复定义：

- Tree 的基础键盘导航
- Tree item 的缩进、expander 和 aria tree 语义
- Popover / sheet 的小屏切换规则
- 通用字段的 `valueState` / description / message 样式约定

## Docs Impact

- `Workflow Lab` 需要有成本中心或组织选择 demo，至少覆盖默认空态、展开选择、路径摘要、错误态和小屏 fallback。
- `S6-06` 本身不需要提前接远程搜索；先保证层级选择在本地静态数据上稳定可用。

## Testing

- `hierarchical-select.test.tsx`
  覆盖 open/close、keyboard tree navigation、selected summary rendering、`valueState` and helpText、小屏 sheet fallback。
- 回归 `tree.test.tsx`
  确认组合层不会倒逼 Tree 改写基础键盘或 aria 行为。
- 回归 `select` / `combo-box` 的字段语义基线
  确认 `HierarchicalSelect` 的 description、message、placeholder 和 `aria-describedby` 模式没有偏离现有字段系统。

## Verification Plan

- `pnpm --filter @axiomui/react typecheck`
- `pnpm --filter @axiomui/react test -- src/components/hierarchical-select/hierarchical-select.test.tsx src/components/tree/tree.test.tsx`
- 检查 [packages/react/src/index.ts](/E:/projects/axiomui/packages/react/src/index.ts) 是否已导出 `HierarchicalSelect`
- 检查 [packages/react/src/styles/index.css](/E:/projects/axiomui/packages/react/src/styles/index.css) 是否已注册 `hierarchical-select.css`

## Acceptance Criteria

- [ ] 字段与弹层语义和现有 Select 或 ComboBox 风格一致
- [ ] 选中结果在收起态下仍然清晰可读
- [ ] `Tree`、字段和弹层三层职责边界清晰
- [ ] compact、cozy、RTL 下可用

## Dependencies

- S6-05
- S2-04
- S3-04

## Suggested Owner

- Form
