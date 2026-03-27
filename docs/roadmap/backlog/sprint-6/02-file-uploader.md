# S6-02 FileUploader

## Type

- Component Task

## Summary

在 `upload` primitives 基础上实现 `FileUploader` 容器层，让用户可以选择文件、拖拽导入、查看队列状态，并与现有表单语义协同工作。

## Goal

- 覆盖企业后台最常见的上传入口
- 让上传交互与现有表单和状态语义保持一致
- 复用 `S6-01` 已冻结的 file model、dropzone copy 和 remove/retry contract，避免容器层再次分叉

## Scope

- In scope:
  - hidden native file input + browse button trigger
  - drag and drop integration
  - upload queue rendering
  - controlled / uncontrolled items
  - remove or retry hooks
  - `valueState`、description、message integration
- Out of scope:
  - 真实后端传输协议
  - 分片上传
  - 断点续传
  - docs `Workflow Lab` 页面编排

## Current Snapshot

- 截至 `2026-03-27`，`FileUploader` 已在 React 包中实现、导出并接入全局样式入口。
- 当前实现已覆盖 browse、drag and drop、队列渲染、remove / retry、受控与非受控 items、以及 `valueState` 与辅助文案联动。
- 当前测试已覆盖 browse input、drop、retry / remove 流程，以及 `zh-CN` 下的队列摘要与 `aria-describedby` 关联。

## Current Codebase Context

- `FileUploader` 当前实现在 [packages/react/src/components/file-uploader/file-uploader.tsx](/E:/projects/axiomui/packages/react/src/components/file-uploader/file-uploader.tsx)，负责容器编排，而不是重新定义 upload 域基础类型。
- 它直接复用 [packages/react/src/components/upload/upload-dropzone.tsx](/E:/projects/axiomui/packages/react/src/components/upload/upload-dropzone.tsx)、[packages/react/src/components/upload/upload-file-item.tsx](/E:/projects/axiomui/packages/react/src/components/upload/upload-file-item.tsx) 与 upload copy helpers，因此 `S6-02` 的重点是编排，不是 primitives 再实现。
- 本地化队列摘要与空态文案来自 [packages/react/src/components/upload/upload-copy.ts](/E:/projects/axiomui/packages/react/src/components/upload/upload-copy.ts)，并通过 `LocaleProvider` 的 `locale`、`formatNumber` 输出，不应在 `FileUploader` 内散落新的 copy 分支。
- React 包的公共导出从 [packages/react/src/index.ts](/E:/projects/axiomui/packages/react/src/index.ts) 收口，全局样式入口从 [packages/react/src/styles/index.css](/E:/projects/axiomui/packages/react/src/styles/index.css) 收口，因此容器层新增或调整后需要同步检查 export 和 CSS import。
- 当前 `FileUploader` 采用隐藏原生 `input[type="file"]` + `Button` 触发的结构，保持可定制按钮样式，同时避免把浏览按钮能力耦合进 `UploadDropzone` primitive。

## Planned File Areas

- `packages/react/src/components/file-uploader/*`
- `packages/react/src/components/upload/*`
- `packages/react/src/index.ts`
- `packages/react/src/styles/index.css`

## 主要文件清单

- `packages/react/src/components/file-uploader/file-uploader.tsx`
  容器主实现，负责 browse、drop、queue、受控/非受控 items、remove / retry 与 `valueState` 编排。
- `packages/react/src/components/file-uploader/file-uploader.css`
  容器壳层、toolbar、empty state 与错误态 dropzone 边框增强样式。
- `packages/react/src/components/file-uploader/file-uploader.test.tsx`
  覆盖 browse、drop、retry / remove 和本地化文案、`aria-describedby` 关联。
- `packages/react/src/components/upload/upload-copy.ts`
  提供队列摘要、空态、dropzone hint 与 action label，不应在 `FileUploader` 中复制这层文案逻辑。
- `packages/react/src/index.ts`
  暴露 `FileUploader`、`FileUploaderProps`、`FileUploaderSource`。
- `packages/react/src/styles/index.css`
  注册 `file-uploader.css`，并将 `.ax-file-uploader` 纳入根类名列表。

## 文件级实施顺序

1. 先冻结容器 API 与数据流。
   在 `file-uploader.tsx` 中先定清 `items / defaultItems / onItemsChange / onFilesAdd / onItemRemove / onItemRetry / createItemFromFile` 这组入口，避免后续 docs demo 或业务接入时再改受控边界。
2. 再接浏览按钮与原生输入桥接。
   隐藏原生 `input[type="file"]`，通过 browse 按钮触发 `click()`，并在文件加入后清空原生 input value，保证连续选择同名文件时事件仍能重新触发。
3. 再接入 `UploadDropzone`。
   `FileUploader` 自己负责把 drop 事件转换为队列 append 行为，但不应改写 `UploadDropzone` 已定义好的拖拽态和 `acceptedFileTypes` 语义。
4. 再渲染上传队列。
   列表渲染统一走 `UploadFileItemView`，队列摘要、空态和单项 retry / remove 都复用 upload helpers，而不是在容器层重复拼装状态文案。
5. 再补表单状态和视觉层。
   `description`、`message`、`valueState` 与 browse button / dropzone 的 `aria-describedby`、错误边框和 support text 颜色在这一层统一收口。
6. 最后做测试、导出和样式入口检查。
   只有当 browse、drop、queue 和动作语义稳定后，再确认 `index.ts`、`styles/index.css` 与测试覆盖同步到位。

## 对后续任务的明确交接边界

`S6-02` 完成后，后续 `S6-09 Workflow Lab` 与真实业务 demo 应直接复用以下内容：

- `FileUploader` 的受控 / 非受控 items 容器能力
- `createItemFromFile` 作为业务侧注入自定义 file item 的入口
- `UploadDropzone`、`UploadFileItemView` 与 upload copy helpers
- `valueState`、description、message 与队列摘要的组合模式

`S6-02` 不应继续承担：

- 真实网络上传生命周期管理
- 服务端持久化或历史文件恢复
- docs 大型业务页面编排
- 与 `Calendar`、`Wizard` 等其他 Sprint 6 组件的跨域编排逻辑

## Docs Impact

- `Workflow Lab` 需要展示空态、已入队、失败可重试、只读态和拖拽激活态
- `S6-02` 本身不需要提前把完整业务 demo 挂进 docs 根应用，只需要保证容器 API 与共享 upload contract 稳定

## Testing

- `file-uploader.test.tsx`
  覆盖 browse input、drop、queue 渲染、retry / remove 与本地化摘要文案。
- 补充检查 `valueState="error"` 下 browse button 的 `aria-describedby` 与错误辅助文案关联。
- 检查 `UploadDropzone` 与 `UploadFileItemView` 在 `FileUploader` 场景中的编排边界未被破坏。

## Verification Plan

- `pnpm --filter @axiomui/react test -- src/components/file-uploader/file-uploader.test.tsx`
- 检查 [packages/react/src/index.ts](/E:/projects/axiomui/packages/react/src/index.ts) 是否已导出 `FileUploader`
- 检查 [packages/react/src/styles/index.css](/E:/projects/axiomui/packages/react/src/styles/index.css) 是否已注册 `file-uploader.css`

## Acceptance Criteria

- [ ] 可选择或拖拽多个文件
- [ ] 队列状态清晰且可操作
- [ ] remove / retry 语义与 upload primitives 保持一致
- [ ] 与表单类组件的错误态和辅助文案表现一致
- [ ] `Workflow Lab` 可以在不返工上传容器的前提下直接接入

## Dependencies

- S6-01
- S1-07

## Suggested Owner

- Form
