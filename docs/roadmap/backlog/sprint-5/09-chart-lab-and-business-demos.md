# S5-09 Chart Lab And Business Demos

## Type

- Docs Or QA Task

## Summary

在 docs 中建立 Chart Lab，并把微图表接入 KPI cards、对象页摘要和表格/列表行内指标场景。

## Goal

- 提供 Sprint 5 的主要验收场
- 确保图形组件进入真实业务语境，而不是停留在样例页

## Scope

- In scope:
  - Chart Lab
  - KPI cards wall
  - Object page summary demo
  - Table/list inline indicators
- Out of scope:
  - 真实数据接口

## Planned File Areas

- `apps/docs/src/app.tsx`
- `apps/docs/src/chart-lab/*`

## Walkthrough

1. 查看 KPI cards
2. 查看对象页摘要图形区
3. 查看表格或列表行内指标
4. 切换 theme、density、RTL
5. 检查图形交互和可读性

## Acceptance Criteria

- [ ] docs 有独立 Chart Lab
- [ ] 至少 3 个真实业务场景已接入图形组件
- [ ] 图形在主题切换下仍然保持语义清晰

## Dependencies

- S5-02
- S5-03
- S5-04
- S5-05
- S5-06
- S5-07
- S5-08

## Suggested Owner

- Docs
