# S2-07 DatePicker

## Type

- Component Task

## Summary

实现 DatePicker，补齐表单和筛选场景里最基础的日期输入能力。

## Goal

- 支撑输入解析与面板选择双路径
- 为 DateRangePicker 提前验证日期格式和 locale 行为

## Scope

- In scope:
  - controlled/uncontrolled value
  - format
  - minDate/maxDate
  - placeholder
  - valueState
  - input parsing
  - panel selection
- Out of scope:
  - 日期范围
  - 时间选择

## Planned File Areas

- `packages/react/src/components/date-picker/*`
- `packages/react/src/index.ts`
- `apps/docs/src/form-lab/*`

## Docs Impact

- Form Lab 基础示例
- Worklist 中的一处筛选 demo

## Testing

- 输入解析
- 面板选择
- locale 格式化
- 非法输入处理
- 清空行为

## Acceptance Criteria

- [ ] 支持输入与面板双路径
- [ ] locale 与 RTL 协同正常
- [ ] 能稳定接入 FilterBar

## Dependencies

- S2-02
- S2-06

## Suggested Owner

- Form
