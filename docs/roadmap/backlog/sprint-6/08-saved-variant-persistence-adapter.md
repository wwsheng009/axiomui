# S6-08 Saved Variant Persistence Adapter

## Type

- Component Task

## Summary

把当前 VariantManager 和 VariantSync 的本地能力推进到可插拔 persistence adapter，为服务端 saved variant 的正式产品化做准备。

## Goal

- 把视图持久化从单一本地实现升级为稳定 contract
- 为未来接入服务端保存和共享视图打基础

## Scope

- In scope:
  - persistence adapter interface
  - local adapter normalization
  - async load or save hooks
  - loading or error state
  - mock remote adapter
- Out of scope:
  - 真实后端接口
  - 权限系统

## Current Snapshot

- 截至 `2026-03-27`，React 包已形成独立的 saved variant persistence 层：`VariantPersistenceAdapter` contract、`localStorage / sessionStorage / memory` adapter、latency wrapper、`useVariantSync` hook、`VariantSyncPanel` / `VariantSyncDialog` 等 UI 组件和公共导出均已落地。
- docs worklist 当前已支持 `localStorage`、`sessionStorage`、`memory` 三种 mock remote adapter 切换，并可演示 push / pull / refresh / clear、remote drift、冲突 review 和本地快照替换流程。
- 当前测试已覆盖 adapter 解析与读写、hook 冲突评审与 remote-only pull、variant sync 组件渲染，以及 docs 管理对话框层的 adapter 切换和 mock cloud 动作转发。

## Current Codebase Context

- [packages/react/src/lib/variant-persistence.ts](/E:/projects/axiomui/packages/react/src/lib/variant-persistence.ts) 已定义稳定的 persistence adapter contract，以及 local/session/memory adapter 与 latency wrapper；后续真实后端接入应直接适配这层接口，而不是绕开它重写 sync 状态机。
- [packages/react/src/hooks/use-variant-sync.ts](/E:/projects/axiomui/packages/react/src/hooks/use-variant-sync.ts) 已负责异步 read/write/clear、initial load、pending / error state、auto refresh、冲突 review 和 activity persistence，因此 `S6-08` 的异步交互 contract 已经不再停留在草稿层。
- [packages/react/src/components/variant-sync/variant-sync.tsx](/E:/projects/axiomui/packages/react/src/components/variant-sync/variant-sync.tsx) 已提供 panel、summary、activity list、snapshot list、review、dialog 等通用 UI 壳层，让 docs 或业务 demo 不需要重复拼装同步界面。
- [apps/docs/src/worklist-advanced/worklist-persistence.ts](/E:/projects/axiomui/apps/docs/src/worklist-advanced/worklist-persistence.ts) 已把 `localStorage`、`sessionStorage`、`memory` 三种 mock adapter 接到同一 contract，并统一加上模拟延迟，用于验证 adapter 可替换性。
- [apps/docs/src/use-docs-variant-sync-controller.ts](/E:/projects/axiomui/apps/docs/src/use-docs-variant-sync-controller.ts) 已负责 adapter mode 切换、remote drift 模拟、workspace replace 和 review dialog 编排，说明 docs 演示链路已经走通。
- [apps/docs/src/worklist-advanced/worklist-variant-dialogs.tsx](/E:/projects/axiomui/apps/docs/src/worklist-advanced/worklist-variant-dialogs.tsx) 已把 saved view 的保存、恢复、删除与 mock cloud sync 面板放在同一管理对话框里，可直接作为 `S6-09` 的 workflow 演示基座。

## Planned File Areas

- `packages/react/src/lib/variant-persistence.ts`
- `packages/react/src/hooks/use-variant-sync.ts`
- `packages/react/src/components/variant-sync/*`
- `apps/docs/src/worklist-advanced/*`
- `apps/docs/src/use-docs-variant-sync-controller.ts`
- `packages/react/src/index.ts`

## 主要文件清单

- `packages/react/src/lib/variant-persistence.ts`
  定义 `VariantPersistenceAdapter`、`parseVariantSyncSnapshot`、`createLocalStorageVariantPersistenceAdapter`、`createSessionStorageVariantPersistenceAdapter`、`createMemoryVariantPersistenceAdapter`、`withLatencyVariantPersistenceAdapter`。
- `packages/react/src/lib/variant-persistence.test.ts`
  覆盖 parse、read/write/clear、malformed storage、session adapter、memory adapter 和 latency wrapper。
- `packages/react/src/hooks/use-variant-sync.ts`
  负责 async read/write/clear、pending / error state、auto refresh、review state、activity persistence 和 remote snapshot 比较。
- `packages/react/src/hooks/use-variant-sync.test.tsx`
  覆盖 push 冲突 review 与 remote-only pull 两条关键 hook 流程。
- `packages/react/src/components/variant-sync/variant-sync.tsx`
  提供 sync panel、comparison summary、activity list、snapshot list、review 和 dialog 等 UI primitive。
- `packages/react/src/components/variant-sync/variant-sync.test.tsx`
  覆盖 summary、activity / snapshot list、review、dialog 默认行为和动作转发。
- `apps/docs/src/worklist-advanced/worklist-persistence.ts`
  组装三类 mock remote adapter，并通过 latency wrapper 模拟异步读写。
- `apps/docs/src/use-docs-variant-sync-controller.ts`
  连接本地 saved variants、remote adapter 切换、drift 模拟和 review dialog。
- `apps/docs/src/worklist-advanced/worklist-variant-dialogs.tsx`
  在 manage local views 对话框中演示保存、恢复、删除、本地/远端快照对比和 sync 操作。
- `apps/docs/src/worklist-advanced/worklist-variant-dialogs.test.tsx`
  覆盖 docs 对话框层的 adapter 切换、watch 按钮、push/pull/refresh/clear 和 saved variant 动作转发。
- `packages/react/src/index.ts`
  已统一导出 persistence adapter、`useVariantSync` 和 `VariantSyncPanel / VariantSyncDialog` 等 variant sync UI primitives。

## Docs Impact

- Workflow Lab 需要展示本地与异步 mock 持久化切换
- 当前高级 worklist docs 已经具备本地与异步 mock adapter 切换、保存/恢复/删除视图，以及 push / pull / clear / drift / review 演示，可直接作为 `S6-09` 的前置基座

## Testing

- `variant-persistence.test.ts`
  覆盖 parse、load、save、delete、malformed storage、session adapter、memory adapter 和 latency wrapper。
- `use-variant-sync.test.tsx`
  覆盖 pending / review / remote-only pull 路径。
- `variant-sync.test.tsx`
  覆盖 sync summary、activity list、snapshot list、review 和 dialog 组件。
- `worklist-variant-dialogs.test.tsx`
  覆盖 docs 层的 local / async mock adapter 切换和 mock cloud 操作编排。

## Verification Plan

- `pnpm --filter @axiomui/react test -- src/lib/variant-persistence.test.ts src/hooks/use-variant-sync.test.tsx src/components/variant-sync/variant-sync.test.tsx`
- `pnpm --filter @axiomui/docs test -- src/worklist-advanced/worklist-variant-dialogs.test.tsx`
- 检查 [packages/react/src/index.ts](/E:/projects/axiomui/packages/react/src/index.ts) 是否已导出 persistence adapter、`useVariantSync` 和 `VariantSyncPanel / VariantSyncDialog` 等 variant sync UI primitives
- 在 docs worklist 中切换 `localStorage / sessionStorage / memory` adapter，验证保存、恢复、删除、本地/远端快照对比与 push / pull / clear / drift 流程

## Acceptance Criteria

- [x] Saved Variant persistence 已形成稳定接口
- [x] local 和 async mock adapter 可互换
- [x] docs 能演示保存、恢复和删除视图

## Dependencies

- existing VariantManager and VariantSync foundation

## Suggested Owner

- Foundation
