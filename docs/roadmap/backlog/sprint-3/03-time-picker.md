# S3-03 TimePicker

## Type

- Component Task

## Summary

实现 TimePicker，补齐时间输入与时间筛选场景。

## Goal

- 支撑 12h/24h 输入和步进选择
- 为后续日期时间复合控件提供基础

## Scope

- In scope:
  - time parsing
  - minuteStep/secondStep
  - panel or list selection
  - valueState
- Out of scope:
  - 日期时间复合控件

## Planned File Areas

- `packages/react/src/components/time-picker/*`
- `packages/react/src/index.ts`

## Docs Impact

- 高级筛选 worklist 需要一组时间筛选示例

## Testing

- 输入解析
- 12h/24h 显示
- 步进选择
- 键盘路径

## Acceptance Criteria

- [ ] 支持 locale 相关时间格式
- [ ] 在表单和筛选栏中布局稳定
- [ ] 与 Popover/ResponsivePopover 协同正常

## Dependencies

- Sprint 1 LocaleProvider
- Sprint 2 Popover

## Suggested Owner

- Form
