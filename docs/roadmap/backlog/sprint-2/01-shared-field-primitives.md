# S2-01 Shared Field Primitives

## Type

- Foundation Task

## Summary

抽取输入触发器、列表容器、清空按钮、空态和加载态等字段基元，避免 Select、ComboBox 和 DatePicker 各自重复实现。

## Goal

- 保持第一批输入控件的交互一致
- 减少后续 DateRangePicker、TimePicker、MultiComboBox 的返工

## Scope

- In scope:
  - `FieldTrigger`
  - `ListBox`
  - `OptionRow`
  - `ClearButton`
  - `EmptyState`
  - `LoadingState`
- Out of scope:
  - 具体业务控件的完整行为

## Planned File Areas

- `packages/react/src/components/field-base/*`
- `packages/react/src/lib/collection/*`
- `packages/react/src/index.ts`

## Docs Impact

- Form Lab 需要展示共享字段壳在不同状态下的表现

## Testing

- 焦点态、禁用态、valueState
- icon slot 与 clear button
- compact/cozy 切换

## Acceptance Criteria

- [ ] Select、ComboBox、DatePicker 可复用同一套 trigger 和 list container
- [ ] 状态、尺寸和交互行为一致
- [ ] 为后续高级输入控件留出稳定基础

## Dependencies

- Sprint 1 Foundation 已完成

## Suggested Owner

- Form
