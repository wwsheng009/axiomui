# S5-06 InteractiveDonutChart

## Type

- Component Task

## Summary

实现 InteractiveDonutChart，为占比图形补齐 hover、focus 和 active state。

## Goal

- 提供可交互的占比视图
- 为图形组件引入更强的探索性体验

## Scope

- In scope:
  - segments
  - activeKey
  - onActiveChange
  - center label
  - segment click
- Out of scope:
  - 跨图联动

## Planned File Areas

- `packages/react/src/components/microchart/interactive-donut/*`
- `packages/react/src/index.ts`

## Docs Impact

- Chart Lab 需要有分段 hover/focus 示例

## Testing

- hover/focus
- 选中态
- 键盘遍历
- 空态与单分段场景

## Acceptance Criteria

- [ ] 可交互高亮分段
- [ ] 键盘和 focus 路径清晰
- [ ] 可嵌入 KPI Card 或摘要区

## Dependencies

- S5-01

## Suggested Owner

- Chart
