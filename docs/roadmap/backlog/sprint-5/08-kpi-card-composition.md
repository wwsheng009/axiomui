# S5-08 KPI Card Composition

## Type

- Component Task

## Summary

构建 KPI Card 组合层，让微图表进入真实业务卡片，而不是只作为孤立图形存在。

## Goal

- 把数值、状态、图形、侧指标组合成可复用 KPI 卡
- 让图形组件更容易在业务页面中落地

## Scope

- In scope:
  - title
  - main value
  - trend or status
  - embedded chart slot
  - side indicators
- Out of scope:
  - 远程数据绑定

## Planned File Areas

- `packages/react/src/components/kpi-card/*`
- `packages/react/src/components/card/*`
- `packages/react/src/index.ts`

## Docs Impact

- Chart Lab 需要有 KPI cards 墙

## Testing

- 不同图表嵌入
- 卡片倒角与图形布局
- 数值与标签对齐

## Acceptance Criteria

- [ ] 可承载至少 Bullet、Radial、Delta 三类图形
- [ ] 在卡片布局中信息层次清晰
- [ ] 可直接在业务示例中复用

## Dependencies

- S5-02
- S5-03
- S5-04
- S5-05

## Suggested Owner

- Chart
