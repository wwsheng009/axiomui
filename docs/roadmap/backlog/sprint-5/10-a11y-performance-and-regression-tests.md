# S5-10 A11y Performance And Regression Tests

## Type

- Docs Or QA Task

## Summary

为微图表和 KPI 展示层补齐 a11y、性能与回归测试，防止图形组件成为后期质量黑洞。

## Goal

- 稳住图形组件质量
- 在 Sprint 5 结束时建立图形层的最小工程保障

## Scope

- In scope:
  - aria labels or summary text
  - 小尺寸和极值场景
  - hover/focus 主路径
  - 多图同时渲染性能基线
  - 核心图形回归测试
- Out of scope:
  - 全量视觉回归平台

## Planned File Areas

- `packages/react/src/**/*.test.*`
- test configuration files

## Verification Plan

- `pnpm typecheck`
- `pnpm build`
- Chart Lab walkthrough
- 性能和小尺寸场景检查

## Acceptance Criteria

- [ ] 图形组件具备基础 a11y 文案
- [ ] 关键 hover/focus 或 active path 有测试
- [ ] 多图同时渲染有最小性能基线
- [ ] docs walkthrough 可作为验收脚本

## Dependencies

- S5-02
- S5-03
- S5-04
- S5-05
- S5-06
- S5-07
- S5-08

## Suggested Owner

- QA
