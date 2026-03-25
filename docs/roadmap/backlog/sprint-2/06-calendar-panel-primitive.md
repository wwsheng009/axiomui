# S2-06 Calendar Panel Primitive

## Type

- Component Task

## Summary

实现日期面板基础层，为 DatePicker 提供独立的月视图、导航和选中逻辑。

## Goal

- 不把所有日期逻辑直接塞进 DatePicker
- 为 DateRangePicker 等后续控件复用日历面板

## Scope

- In scope:
  - month grid
  - visible month navigation
  - selected date
  - disabled range
  - locale-aware labels
- Out of scope:
  - 日期范围选择

## Planned File Areas

- `packages/react/src/components/calendar-panel/*`
- `packages/react/src/index.ts`

## Docs Impact

- Form Lab 可提供独立日历面板 demo 或嵌入式校验场景

## Testing

- 月份切换
- 周起始日
- locale 文案
- 禁用日期
- 键盘网格导航

## Acceptance Criteria

- [ ] Calendar panel 可独立渲染
- [ ] DatePicker 可直接复用
- [ ] locale 和 RTL 行为正常

## Dependencies

- Sprint 1 LocaleProvider
- S2-02

## Suggested Owner

- Form
