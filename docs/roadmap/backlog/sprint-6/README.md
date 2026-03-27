# Sprint 6 Backlog

## Sprint 目标

补齐上传、日历规划、层级选择、向导流和视图持久化适配，让 AxiomUI 从“能搭页面和展示指标”推进到“能承载更长业务操作链路”的下一阶段。

## 当前状态

截至 `2026-03-27`，`Sprint 6` 已进入 `In Progress`：

- `S6-01 Upload primitives and file model` 已完成，React 包已新增 `UploadDropzone`、`UploadFileItemView`、upload state helpers 和 locale copy helpers
- `S6-02 FileUploader` 已完成，React 包已新增 `FileUploader`，支持 browse、drag and drop、queue、remove / retry 与 `valueState`/辅助文案联动
- `S6-08 Saved Variant persistence adapter` 已完成，React 包已新增 persistence adapter contract、`localStorage / sessionStorage / memory` adapter、`useVariantSync` 与 `VariantSyncPanel / VariantSyncDialog` 等 UI primitive；docs worklist 也已支持 mock cloud adapter 切换、异步 drift 和 sync review 演示
- 当前代码快照仍以已导出组件、样式接入和测试文件作为主要判断依据
- `S6-03` 到 `S6-07` 与 `S6-09`、`S6-10` 仍处于 backlog 阶段，下一步优先进入 `Calendar`

## 建议时间窗口

- `Week 11-12` 或下一阶段规划窗口

## Epic

- [00-sprint-6-epic.md](./00-sprint-6-epic.md)

## Task Drafts

- [01-upload-primitives-and-file-model.md](./01-upload-primitives-and-file-model.md)
- [02-file-uploader.md](./02-file-uploader.md)
- [03-calendar.md](./03-calendar.md)
- [04-planning-calendar.md](./04-planning-calendar.md)
- [05-tree-primitives.md](./05-tree-primitives.md)
- [06-hierarchical-select.md](./06-hierarchical-select.md)
- [07-wizard.md](./07-wizard.md)
- [08-saved-variant-persistence-adapter.md](./08-saved-variant-persistence-adapter.md)
- [09-workflow-lab-and-business-demos.md](./09-workflow-lab-and-business-demos.md)
- [10-a11y-and-regression-tests.md](./10-a11y-and-regression-tests.md)

## 建议并行分组

- `Track A`
  Upload primitives、FileUploader、Calendar
- `Track B`
  PlanningCalendar、Tree、HierarchicalSelect
- `Track C`
  Wizard、Saved Variant persistence adapter
- `Track D`
  Workflow Lab、A11y/回归测试

## Sprint 退出标准

- FileUploader、Calendar、PlanningCalendar、Tree、HierarchicalSelect、Wizard 已实现并导出
- Saved Variant persistence adapter 已形成可替换的持久化 contract
- docs 有独立 `Workflow Lab`
- 至少 `3` 个真实业务场景接入上传、规划、层级选择或向导流组件
- 关键上传、规划、树选择与步骤流具备基础 a11y 和 regression tests

当前这组退出标准尚未全部满足，但 `S6-01`、`S6-02` 与 `S6-08` 已落地，可作为 `Calendar`、`Workflow Lab` 和更复杂流程场景的直接基座。
