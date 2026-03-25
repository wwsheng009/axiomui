# S2-08 Form Integration Pass

## Type

- Component Task

## Summary

让第一批新控件与 FormGrid、FormField、FilterBar 完整协作，避免再次出现空间溢出和状态不一致。

## Goal

- 统一布局、标签、帮助文案和 valueState 体验
- 避免输入件在 grid 中出现宽度干涉

## Scope

- In scope:
  - FormGrid 协作
  - FormField 协作
  - FilterBar 混排
  - valueState/helpText 统一
- Out of scope:
  - 新控件的功能扩展

## Planned File Areas

- `packages/react/src/components/form-grid/*`
- `packages/react/src/components/filter-bar/*`
- 新控件相关样式文件

## Docs Impact

- Form Lab 需要有混排矩阵

## Testing

- 小宽度下不溢出
- label 对齐
- help text 与控件不冲突
- compact/cozy 对照

## Acceptance Criteria

- [ ] Select、ComboBox、MultiInput、DatePicker 放进表单网格后稳定
- [ ] 不出现控件超出 grid 空间的问题
- [ ] valueState 与 helpText 表现一致

## Dependencies

- S2-03
- S2-04
- S2-05
- S2-07

## Suggested Owner

- Form
