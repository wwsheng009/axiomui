# S5-07 InteractiveLineChart

## Type

- Component Task

## Summary

实现 InteractiveLineChart，为趋势摘要提供可聚焦、可查看点位的轻量趋势图。

## Goal

- 支撑趋势概览
- 提供比静态折线更强的可读性和探索性

## Scope

- In scope:
  - points
  - active point
  - min/max markers
  - optional axis labels
  - focus or hover details
- Out of scope:
  - 多序列分析图

## Planned File Areas

- `packages/react/src/components/microchart/interactive-line/*`
- `packages/react/src/index.ts`

## Docs Impact

- Chart Lab 需要展示趋势摘要与点位交互

## Testing

- 稀疏点与密集点
- 峰谷标记
- 键盘聚焦
- 极值与空态

## Acceptance Criteria

- [ ] 可稳定表达趋势信息
- [ ] 关键点位可交互
- [ ] 适合对象页与卡片摘要

## Dependencies

- S5-01

## Suggested Owner

- Chart
