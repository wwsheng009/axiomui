# S6-05 Tree Primitives

## Type

- Component Task

## Summary

实现通用 `Tree` primitives，提供层级数据浏览、展开收起和键盘导航基础，为 `HierarchicalSelect` 和后续组织/分类树场景打底。

## Goal

- 提供稳定的层级结构基础组件
- 为 HierarchicalSelect 等复合组件提供共享能力
- 明确与现有 `NavigationList`、`Menu` 的职责边界，避免把导航树、菜单 drill-in 和通用数据树混成一套实现

## Scope

- In scope:
  - nested items
  - expand or collapse
  - selected or active item
  - icons
  - disabled state
  - keyboard navigation
- Out of scope:
  - virtualization
  - 远程增量加载
  - overlay / field shell
  - 搜索和过滤输入框

## Current Snapshot

- 截至 `2026-03-27`，React 包中还没有独立的 `Tree` 组件，也没有 `packages/react/src/components/tree` 目录。
- 当前仓库里最接近 tree 的现有实现是 `NavigationList`：它已经具备 `role="tree"`、嵌套项、展开收起、RTL 下左右键镜像和焦点移动。
- 但 `NavigationList` 是导航场景专用实现，内建了 `aria-current`、active branch、group label、collapsed icon rail 和 `SideNavigation` 组合模式，因此不能直接当作通用数据树 primitive 暴露给 `HierarchicalSelect`。

## Current Codebase Context

- [packages/react/src/components/navigation-list/navigation-list.tsx](/E:/projects/axiomui/packages/react/src/components/navigation-list/navigation-list.tsx) 已证明仓库里有一套可工作的 tree-like roving focus 和 expand/collapse 模式，但它把“导航语义”和“tree 语义”耦合在一起。`S6-05` 应复用其经验，而不是直接复用它的 API。
- [packages/react/src/components/navigation-list/navigation-list.test.tsx](/E:/projects/axiomui/packages/react/src/components/navigation-list/navigation-list.test.tsx) 已覆盖 LTR/RTL 下的左右键展开/收起、上下移动和 collapsed 模式，这些可以作为 `Tree` 键盘规则的现有参考基线。
- [packages/react/src/components/menu/menu.tsx](/E:/projects/axiomui/packages/react/src/components/menu/menu.tsx) 也支持层级 items，但它是 `role="menu"` 的 drill-in overlay 模式，适用于临时动作列表，不适合作为持久层级数据树的语义基座。
- [packages/react/src/components/multi-combo-box/multi-combo-box.tsx](/E:/projects/axiomui/packages/react/src/components/multi-combo-box/multi-combo-box.tsx) 体现了现有表单组件的受控/非受控边界、描述文案和 `valueState` 模式；`S6-06 HierarchicalSelect` 后续应沿用这些字段语义，但这不属于 `S6-05 Tree` 本体范围。
- [docs/roadmap/backlog/sprint-6/06-hierarchical-select.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-6/06-hierarchical-select.md) 已明确声明它会依赖 `tree + popover + field`，因此 `S6-05` 的 contract 需要先把多层级浏览、选中和展开状态稳定下来。

## Planned File Areas

- `packages/react/src/components/tree/*`
- `packages/react/src/styles/index.css`
- `packages/react/src/index.ts`

## 推荐文件清单

建议把 `S6-05` 先拆成下面这组文件：

- `packages/react/src/components/tree/tree-types.ts`
  定义 `TreeItem`、`TreeSelectionMode`、`TreeExpandedState`、`TreeActiveItem`、`TreeItemAction` 等通用 tree contract，明确通用数据树和导航树 API 的分界。
- `packages/react/src/components/tree/tree-state.ts`
  抽取 item meta map、visible item flatten、parent/ancestor 查询、expand/collapse、roving focus 和 RTL 键位映射等状态 helper。
- `packages/react/src/components/tree/tree-item.tsx`
  负责单个 tree item row、缩进、expander、icon、selected/active/disabled 态和 aria 属性。
- `packages/react/src/components/tree/tree.tsx`
  主组件，负责 tree root、items 渲染、controlled/uncontrolled expanded keys 与 selected keys、键盘导航和事件回调。
- `packages/react/src/components/tree/tree.css`
  缩进、expander、行态、层级线索和紧凑/舒适密度样式。
- `packages/react/src/components/tree/tree-copy.ts`
  若需要 expand/collapse aria label、层级状态描述或屏幕阅读器辅助文案，继续沿用集中 helper 模式，避免文案散落到 `tree.tsx`。
- `packages/react/src/components/tree/tree.test.tsx`
  覆盖展开收起、键盘导航、RTL、disabled item、aria tree semantics 与受控/非受控模式。
- `packages/react/src/index.ts`
  暴露 `Tree` 及其类型。
- `packages/react/src/styles/index.css`
  注册 `tree.css`，并将 `.ax-tree` 纳入根类名列表。

## 文件级实施顺序

1. 先冻结通用 tree 数据模型。
   在 `tree-types.ts` 中先定清 item 结构、`selectedKeys`/`expandedKeys` 的受控边界，以及 `single` 还是 `multiple` selection mode 的 contract，避免 `HierarchicalSelect` 和未来 docs demo 各自扩展出不同树模型。
2. 再抽共享状态层。
   把 `NavigationList` 已验证过的 meta map、visible flatten、ancestor 查询、focus item 和 RTL 左右键规则沉淀到 `tree-state.ts`，但要去掉导航专属的 `active branch`、`aria-current` 和 collapsed rail 逻辑。
3. 再实现最小 tree item primitive。
   `tree-item.tsx` 只负责一行的缩进、expander、icon、label 和 aria 语义，不在这里绑定外层 field、popover 或搜索框。
4. 再实现主容器。
   `tree.tsx` 负责 root role、item 递归渲染、键盘导航、expand/collapse 和 selection 回调，保持它能独立用于组织树、分类树和权限树，而不是只服务某一个业务场景。
5. 最后补 copy、样式和回归测试。
   在 API 稳定后再加 `tree-copy.ts`、`tree.css`、`index.ts` 和 `styles/index.css`，并对照 `NavigationList` 的既有键盘行为回归。

## 与 NavigationList / Menu / HierarchicalSelect 的明确边界

`S6-05 Tree` 应复用 `NavigationList` 已验证过的以下经验：

- 嵌套项 flatten 与焦点顺序
- 展开收起状态切换
- RTL 下左右键镜像
- disabled item 的跳过策略

但 `S6-05 Tree` 不应直接继承 `NavigationList` 的以下导航专属语义：

- `aria-current="page"`
- active branch / collapsed rail 视觉语义
- group label 和工作台导航结构
- 与 `SideNavigation` 的壳层耦合

`S6-05 Tree` 也不应直接复用 `Menu` 的以下模式：

- `role="menu"` / `menuitem` 语义
- 临时 overlay 打开/关闭生命周期
- drill-in pathbar 导航模式

`S6-06 HierarchicalSelect` 后续应直接消费的能力应包括：

- 通用 tree item 数据模型
- expanded / selected / active item 状态 contract
- 键盘导航和 aria tree 语义
- disabled item 与层级展开行为

但 `S6-06` 自己负责：

- trigger field
- popover shell
- selected summary
- `valueState`、description、message 集成

## Docs Impact

- `Workflow Lab` 需要展示分类树或组织树场景，至少覆盖展开收起、选中态、disabled 节点和深层焦点移动。
- `S6-05` 本身不需要提前把 Tree 包到字段或弹层里；优先保证 tree primitive 可独立验证、可被 `HierarchicalSelect` 直接消费。

## Testing

- `tree.test.tsx`
  覆盖展开/收起、上下/左右导航、RTL、nested disabled state、aria tree semantics、受控/非受控 expanded keys。
- 对照 [navigation-list.test.tsx](/E:/projects/axiomui/packages/react/src/components/navigation-list/navigation-list.test.tsx)
  确认抽取 tree 规则时不会反向破坏既有导航树的键盘行为假设。

## Verification Plan

- `pnpm --filter @axiomui/react typecheck`
- `pnpm --filter @axiomui/react test -- src/components/tree/tree.test.tsx src/components/navigation-list/navigation-list.test.tsx`
- 检查 [packages/react/src/index.ts](/E:/projects/axiomui/packages/react/src/index.ts) 是否已导出 `Tree`
- 检查 [packages/react/src/styles/index.css](/E:/projects/axiomui/packages/react/src/styles/index.css) 是否已注册 `tree.css`

## Acceptance Criteria

- [ ] Tree 具备稳定的层级浏览和焦点路径
- [ ] 层级语义和展开收起状态可读
- [ ] 与 `NavigationList`、`Menu` 的职责边界清晰
- [ ] HierarchicalSelect 可以直接复用 Tree 基础

## Dependencies

- S1 theme or icon foundation

## Suggested Owner

- Shell
