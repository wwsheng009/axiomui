# S3-08 Advanced Filter Worklist Demo

## Type

- Docs Or QA Task

## Summary

在 docs 中建立高级筛选工作区，把复杂筛选件、VariantManager、DataTable 和 MessagePopover 串成真实业务示例。

## Goal

- 提供 Sprint 3 的主要验收场
- 展示复杂筛选和反馈交互的真实价值

## Scope

- In scope:
  - Advanced Filter Worklist
  - MultiComboBox、DateRangePicker、TimePicker demo
  - MessagePopover demo
  - VariantManager 与 DataTable 联动
- Out of scope:
  - 真实 API

## Planned File Areas

- `apps/docs/src/app.tsx`
- `apps/docs/src/worklist-advanced/*`

## Walkthrough

1. 设定多值筛选
2. 设定日期范围
3. 设定时间筛选
4. 应用到 worklist
5. 打开 MessagePopover 检查反馈

## Acceptance Criteria

- [ ] docs 中存在独立高级筛选工作区
- [ ] 多种复杂控件联动可见
- [ ] theme、density、RTL、locale 切换下仍可用

## Dependencies

- S3-01
- S3-02
- S3-03
- S3-06
- S3-07

## Suggested Owner

- Docs
