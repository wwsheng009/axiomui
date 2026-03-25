# S3-02 DateRangePicker

## Type

- Component Task

## Summary

实现 DateRangePicker，补齐企业筛选中最常见的起止日期输入。

## Goal

- 支撑范围筛选
- 复用 DatePicker 与 calendar panel 能力

## Scope

- In scope:
  - start/end value
  - 范围选择
  - 输入解析
  - minDate/maxDate
  - clear
- Out of scope:
  - 时间范围

## Planned File Areas

- `packages/react/src/components/date-range-picker/*`
- `packages/react/src/index.ts`

## Docs Impact

- 高级筛选 worklist 需要一组日期范围筛选示例

## Testing

- 范围选择
- 同月与跨月
- 输入解析
- 非法区间处理
- 清空行为

## Acceptance Criteria

- [ ] 可稳定选择与输入起止日期
- [ ] 与 locale、RTL 协同正常
- [ ] 可放入 FilterBar 与 FormGrid

## Dependencies

- Sprint 2 DatePicker
- Sprint 2 Calendar panel primitive

## Suggested Owner

- Form
