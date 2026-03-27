# S6-01 Upload Primitives And File Model

## Type

- Component Task

## Summary

先建立上传域的共享 file item contract、状态语义和拖拽基础能力，为 FileUploader 和后续上传场景打底。

## Goal

- 给上传域提供稳定的共享基础
- 避免 FileUploader 和后续上传场景各自定义不兼容的数据模型

## Scope

- In scope:
  - file item model
  - upload state mapping
  - drag and drop zone primitives
  - shared aria or status copy helpers
  - remove or retry action contract
- Out of scope:
  - 真实网络传输实现
  - 最终 FileUploader 容器编排

## Current Snapshot

- 截至 `2026-03-27`，`upload` 组件域已在 React 包中落地，包含共享类型、状态 helper、copy helper、dropzone primitive、file item primitive 和对应测试。
- 当前这层基础已经被 `S6-02 FileUploader` 直接复用，没有再次分叉 file model、dropzone 文案或 remove/retry 语义。

## Current Codebase Context

- 当前仓库已经有独立的 `upload` 组件域，位于 `packages/react/src/components/upload`；这说明 `S6-01` 的共享基础层已经完成，后续任务应复用，而不是回退到各自定义模型。
- React 包的公共导出统一从 [packages/react/src/index.ts](/E:/projects/axiomui/packages/react/src/index.ts) 进入，因此 upload primitives 的类型和共享组件需要在这里统一导出。
- 组件样式统一从 [packages/react/src/styles/index.css](/E:/projects/axiomui/packages/react/src/styles/index.css) 收口；当前 upload primitives 已完成 `@import` 和根类名接入。
- 多语言辅助文案目前采用集中 helper 的方式，例如 [packages/react/src/components/overlay/overlay-copy.ts](/E:/projects/axiomui/packages/react/src/components/overlay/overlay-copy.ts)；upload 域建议沿用同样模式，不要把 aria label 和状态文案散落在多个组件里。
- 可移除项和按钮 aria 文案的既有交互模式可参考 `MultiInput` 与 `MultiComboBox`，不要在 upload 域重新发明一套 remove 语义。

## Planned File Areas

- `packages/react/src/components/upload/*`
- `packages/react/src/index.ts`
- `packages/react/src/styles/index.css`

## 推荐文件清单

当前 `S6-01` 已落成下面这组共享文件，并已作为完整上传容器 `S6-02` 的直接基座：

- `packages/react/src/components/upload/upload-types.ts`
  定义 upload 域的核心类型，例如 `UploadFileStatus`、`UploadFileItem`、`UploadDropOperation`、`UploadRetryAction`。
- `packages/react/src/components/upload/upload-state.ts`
  放上传状态映射与轻量 helper，例如状态顺序、tone 映射、是否允许 retry/remove、是否视为 terminal state。
- `packages/react/src/components/upload/upload-copy.ts`
  统一维护中英文 copy，包括 dropzone label、drop target hint、retry/remove 按钮 aria 文案、文件状态描述。
- `packages/react/src/components/upload/upload-dropzone.tsx`
  实现最小 dropzone primitive，负责 drag enter/leave/drop 的状态和语义，不负责真实上传队列编排。
- `packages/react/src/components/upload/upload-dropzone.css`
  dropzone 的视觉壳层、drag active 态、disabled/readOnly 态样式。
- `packages/react/src/components/upload/upload-file-item.tsx`
  实现单条文件项 primitive，负责文件名、大小、状态、错误文案、remove/retry action 插槽。
- `packages/react/src/components/upload/upload-file-item.css`
  单条文件项样式。
- `packages/react/src/components/upload/upload-state.test.ts`
  覆盖状态映射、terminal state、retry/remove 规则。
- `packages/react/src/components/upload/upload-dropzone.test.tsx`
  覆盖 drag enter/leave/drop、disabled 态和 aria 文案。
- `packages/react/src/components/upload/upload-file-item.test.tsx`
  覆盖状态渲染、retry/remove aria label 和错误文案。
- `packages/react/src/index.ts`
  补齐 upload primitives 的导出和类型导出。
- `packages/react/src/styles/index.css`
  注册新增 upload CSS，并把 `.ax-upload-dropzone`、`.ax-upload-file-item` 加入根类名列表。

## 文件级实施顺序

1. 先冻结类型与状态语义。
   先实现 `upload-types.ts` 和 `upload-state.ts`，把 `queued / uploading / success / error / canceled` 这类最小状态集定下来，避免后面 `FileUploader` 和 docs demo 再各自扩展。
2. 再抽本地化 copy helper。
   在 `upload-copy.ts` 中统一中英文 copy，保持和 `overlay-copy.ts` 相同的集中式模式。
3. 再做 dropzone primitive。
   `upload-dropzone.tsx` 只处理拖拽状态、视觉壳层、提示文案和 drop 事件，不在这一层接管隐藏文件输入和完整队列。
4. 再做 file item primitive。
   `upload-file-item.tsx` 只聚焦单项展示与动作语义，避免在 `S6-01` 里提前做完整列表管理。
5. 最后做 barrel export 与样式接入。
   只有类型、copy、primitives 定下来后，再改 `index.ts` 和 `styles/index.css`，避免导出面反复变动。

## 对 S6-02 的明确交接边界

`S6-01` 完成后，`S6-02 FileUploader` 应直接复用以下内容：

- `UploadFileItem` 类型和状态枚举
- 状态到 tone 或 copy 的映射 helper
- `UploadDropzone` primitive
- `UploadFileItemView` 或等价的单条文件项展示 primitive

`S6-02` 不应再重复定义：

- 文件项数据模型
- remove/retry 的动作语义
- drag active 的壳层样式
- 上传状态的可读文案

## Docs Impact

- Workflow Lab 需要展示空态、上传中、成功、失败和拖拽待放置状态
- `S6-01` 本身不需要把主 docs 页面接满，只需要保证 primitives 的状态足够稳定，能被 `S6-09` 直接嵌入
- 若需要临时验证，优先用测试夹具或局部示例，不要在这一阶段直接把大量 upload demo 塞进 `apps/docs/src/app.tsx`

## Testing

- `upload-state.test.ts`
  覆盖状态映射、terminal state、retry/remove 规则和非法状态输入保护。
- `upload-dropzone.test.tsx`
  覆盖 drag enter、drag leave、drop、disabled、readOnly 和 aria label。
- `upload-file-item.test.tsx`
  覆盖文件名、大小、状态文案、错误态、retry/remove action 以及 locale copy。

## Verification Plan

- `pnpm --filter @axiomui/react typecheck`
- `pnpm --filter @axiomui/react test -- src/components/upload/upload-state.test.ts src/components/upload/upload-dropzone.test.tsx src/components/upload/upload-file-item.test.tsx`
- 检查 `packages/react/src/index.ts` 导出是否完整
- 检查 `packages/react/src/styles/index.css` 是否已注册 upload primitives 样式

## Acceptance Criteria

- [ ] 上传域的共享 file item contract 已冻结
- [ ] FileUploader 可直接复用，不需要重复定义模型
- [ ] 上传状态具备清晰的语义和可读文案
- [ ] upload primitives 已通过 barrel export 和全局样式入口接入
- [ ] `S6-02` 已在不返工共享模型的前提下完成实现

## Dependencies

- S1 foundation exit

## Suggested Owner

- Foundation
