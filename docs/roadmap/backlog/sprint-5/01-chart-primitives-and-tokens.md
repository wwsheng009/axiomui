# S5-01 Chart Primitives And Tokens

## Type

- Foundation Task

## Summary

建立图形组件的共享基元和图表语义 token，避免每个 microchart 各自实现颜色、标签和尺寸约束。

## Goal

- 统一图形语义色和状态映射
- 为所有 microchart 提供共享布局与 a11y 辅助工具

## Scope

- In scope:
  - chart surface primitive
  - legend item primitive
  - semantic chart color mapping
  - chart spacing and sizing tokens
  - a11y label helpers
- Out of scope:
  - 具体业务图形实现

## Planned File Areas

- `packages/react/src/components/microchart/_shared/*`
- `packages/tokens/src/*`
- `packages/react/src/index.ts`

## Docs Impact

- Chart Lab 需要能展示基础色板、尺寸和状态矩阵

## Testing

- 主题切换
- 小尺寸渲染
- 语义状态映射
- compact/cozy

## Acceptance Criteria

- [ ] 所有 microchart 可共享同一套图形基元
- [ ] 图表状态色通过 semantic tokens 管理
- [ ] 为后续 KPI Card 提供稳定底座

## Dependencies

- Sprint 1 theme foundation

## Suggested Owner

- Chart Foundation
