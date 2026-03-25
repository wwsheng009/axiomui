# S5-03 RadialMicroChart

## Type

- Component Task

## Summary

实现 RadialMicroChart，用于表达完成度、百分比和健康度。

## Goal

- 覆盖最常见的环形 KPI 语义
- 为对象页头部和小卡片提供紧凑型图形

## Scope

- In scope:
  - value/total
  - status
  - center label
  - size variants
- Out of scope:
  - 多环版本

## Planned File Areas

- `packages/react/src/components/microchart/radial/*`
- `packages/react/src/index.ts`

## Docs Impact

- Chart Lab 需要展示不同大小与状态的环形 KPI

## Testing

- 0/100 边界
- 中心标签
- 状态色
- 小尺寸渲染

## Acceptance Criteria

- [ ] 可嵌入 KPI Card 和 ObjectPageHeader
- [ ] 小尺寸下仍然可读
- [ ] 支持语义状态映射

## Dependencies

- S5-01

## Suggested Owner

- Chart
