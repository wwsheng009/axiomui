# S3-09 State And Help Text Unification

## Type

- Component Task

## Summary

统一复杂输入控件的 valueState、helpText、counter 和辅助反馈表现，让它们和已有 Input/FormField 风格一致。

## Goal

- 避免新老控件状态语义割裂
- 为后续更复杂组件提供统一状态基线

## Scope

- In scope:
  - valueState 表现
  - helpText
  - counter 或辅助文案
  - token 溢出反馈
- Out of scope:
  - 新状态类型设计

## Planned File Areas

- 新控件目录
- `packages/react/src/components/form-grid/*`
- 共享字段基元

## Docs Impact

- Form Lab 和 Advanced Filter Worklist 需要展示错误态、警告态和辅助文案

## Testing

- error/warning/information 状态
- helpText 与控件间距
- token 溢出

## Acceptance Criteria

- [ ] 新控件状态语义与现有 Input 一致
- [ ] helpText 不和布局或弹层冲突
- [ ] 复杂控件在错误态下仍然可操作和可读

## Dependencies

- S3-01
- S3-02
- S3-03

## Suggested Owner

- Form
