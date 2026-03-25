# S5-04 Delta And HarveyBall

## Type

- Component Task

## Summary

实现 DeltaMicroChart 与 HarveyBallMicroChart，补齐趋势变化和占比表达两类高频微图形。

## Goal

- 支撑对象页摘要和行内状态可视化
- 提供极其紧凑但信息量高的图形组件

## Scope

- In scope:
  - Delta trend
  - status
  - HarveyBall segments
  - labels
- Out of scope:
  - 复杂交互

## Planned File Areas

- `packages/react/src/components/microchart/delta/*`
- `packages/react/src/components/microchart/harvey-ball/*`
- `packages/react/src/index.ts`

## Docs Impact

- Chart Lab 需要展示趋势和占比对照

## Testing

- 增减方向
- 状态色
- 分段占比
- 小尺寸标签

## Acceptance Criteria

- [ ] 可用于对象页摘要和行内指标
- [ ] 趋势与占比语义一眼可辨
- [ ] 与 chart primitives/token 保持一致

## Dependencies

- S5-01

## Suggested Owner

- Chart
