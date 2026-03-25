# S5-02 BulletMicroChart

## Type

- Component Task

## Summary

实现 BulletMicroChart，用于表达目标值、实际值、预测值和区间范围。

## Goal

- 覆盖最典型的 KPI 目标对比场景
- 为对象页头部和 KPI card 提供高价值图形

## Scope

- In scope:
  - actual
  - target
  - forecast
  - ranges
  - optional labels
- Out of scope:
  - 复杂 drilldown

## Planned File Areas

- `packages/react/src/components/microchart/bullet/*`
- `packages/react/src/index.ts`

## Docs Impact

- Chart Lab 需要展示目标与实际对比的 KPI 场景

## Testing

- 目标线显示
- 区间色显示
- 极值与空值
- 文本省略

## Acceptance Criteria

- [ ] 可在卡片和对象页摘要中使用
- [ ] 目标线和实际值语义清晰
- [ ] 与 chart primitives/token 一致

## Dependencies

- S5-01

## Suggested Owner

- Chart
