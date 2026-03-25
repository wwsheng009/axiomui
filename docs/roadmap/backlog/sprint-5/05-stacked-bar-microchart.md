# S5-05 StackedBarMicroChart

## Type

- Component Task

## Summary

实现 StackedBarMicroChart，用于表达多段比例和构成型 KPI。

## Goal

- 支撑工作列表 summary 和对象页概览中的构成分析
- 提供比传统进度条更丰富的信息表达

## Scope

- In scope:
  - segments
  - total
  - optional legend
  - label modes
- Out of scope:
  - 复杂 tooltip 系统

## Planned File Areas

- `packages/react/src/components/microchart/stacked-bar/*`
- `packages/react/src/index.ts`

## Docs Impact

- Chart Lab 需要展示分段比例业务场景

## Testing

- 小比例分段
- 空数据态
- 标签截断
- 颜色冲突检查

## Acceptance Criteria

- [ ] 可稳定表达多段比例
- [ ] 小分段情况下布局仍稳定
- [ ] 适合在对象页和卡片中使用

## Dependencies

- S5-01

## Suggested Owner

- Chart
