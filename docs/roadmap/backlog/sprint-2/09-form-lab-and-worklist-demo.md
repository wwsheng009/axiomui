# S2-09 Form Lab And Worklist Demo

## Type

- Docs Or QA Task

## Summary

在 docs 中建立 Form Lab，并把第一批输入控件接入现有 worklist/filter 语境。

## Goal

- 让新控件不只是孤立 demo
- 提供 Sprint 2 的主要验收场

## Scope

- In scope:
  - Form Lab
  - Select demo
  - ComboBox demo
  - MultiInput demo
  - DatePicker demo
  - Worklist 筛选集成
- Out of scope:
  - 真实 API

## Planned File Areas

- `apps/docs/src/app.tsx`
- `apps/docs/src/form-lab/*`
- `apps/docs/src/worklist-*/*`

## Walkthrough

1. 切换 theme、density、locale、RTL
2. 在 Form Lab 中完成一组输入
3. 在 worklist 中应用筛选
4. 检查表格与筛选联动

## Acceptance Criteria

- [ ] docs 有独立 Form Lab
- [ ] worklist 中至少有一组真实筛选接入
- [ ] 所有 demo 可在主题和语言切换下验证

## Dependencies

- S2-03
- S2-04
- S2-05
- S2-07

## Suggested Owner

- Docs
