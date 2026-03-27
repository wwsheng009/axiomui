# S6-09 Workflow Lab And Business Demos

## Type

- Docs Or QA Task

## Summary

在 docs 中建立 Workflow Lab，把上传、规划、层级选择、向导流和视图持久化串成真实业务演示。

## Goal

- 提供 Sprint 6 的主要验收场
- 确保新组件进入真实工作流，而不是停留在孤立样例页

## Scope

- In scope:
  - Workflow Lab
  - upload queue demo
  - planning board demo
  - hierarchical select form demo
  - wizard flow demo
  - persisted variants demo
- Out of scope:
  - 真实后端接口

## Planned File Areas

- `apps/docs/src/app.tsx`
- `apps/docs/src/workflow-lab/*`

## Walkthrough

1. 查看 upload queue 和文件状态
2. 查看 Calendar 或 PlanningCalendar 场景
3. 使用 HierarchicalSelect 选择层级项
4. 走完整个 Wizard 流程
5. 保存并恢复视图
6. 切换 theme、density、RTL、locale

## Acceptance Criteria

- [ ] docs 有独立 Workflow Lab
- [ ] 至少 3 个真实业务场景接入 Sprint 6 组件
- [ ] 新 demo 在主题和布局切换下仍可用

## Dependencies

- S6-02
- S6-03
- S6-04
- S6-06
- S6-07
- S6-08

## Suggested Owner

- Docs
