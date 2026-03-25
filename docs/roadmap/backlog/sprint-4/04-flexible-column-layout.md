# S4-04 FlexibleColumnLayout

## Type

- Component Task

## Summary

实现 FlexibleColumnLayout，把当前较轻量的 SplitLayout 提升到更接近 UI5 的多列工作流布局。

## Goal

- 支撑 list-detail-detail 业务流
- 明确与现有 SplitLayout 的定位边界

## Scope

- In scope:
  - 1/2/3 列布局
  - layout state
  - 列显隐
  - 不同宽度比例
  - 窄屏退化
- Out of scope:
  - 路由编排

## Planned File Areas

- `packages/react/src/components/flexible-column-layout/*`
- `packages/react/src/index.ts`

## Docs Impact

- Shell Lab 需要有 list-detail-detail 示例

## Testing

- 不同 layout 切换
- 宽屏与窄屏
- 列显示与隐藏
- 键盘焦点稳定性

## Acceptance Criteria

- [ ] 可承载多列业务流
- [ ] 与 SplitLayout 分工清晰
- [ ] docs 可演示典型 list-detail-detail 场景

## Dependencies

- Sprint 1 theme foundation
- 现有 SplitLayout 经验

## Suggested Owner

- Shell
