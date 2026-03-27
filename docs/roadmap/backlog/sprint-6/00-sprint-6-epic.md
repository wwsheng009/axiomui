# Sprint 6 Epic

## Type

- Sprint Epic

## Goal

把 AxiomUI 从“已具备基础工作台、对象页和 KPI 展示能力”推进到“能承载上传、规划、层级选择和多步业务流”的下一阶段。

## Target Deliverables

- Upload primitives 与共享 file model
- FileUploader
- Calendar
- PlanningCalendar
- Tree primitives
- HierarchicalSelect
- Wizard
- Saved Variant persistence adapter
- Workflow Lab

## Planned Task Breakdown

- [x] 01 Upload primitives 与共享 file model
- [x] 02 FileUploader
- [ ] 03 Calendar
- [ ] 04 PlanningCalendar
- [ ] 05 Tree primitives
- [ ] 06 HierarchicalSelect
- [ ] 07 Wizard
- [x] 08 Saved Variant persistence adapter
- [ ] 09 Workflow Lab 与业务示例接入
- [ ] 10 A11y 与回归测试

## Exit Criteria

- [ ] 上传、日历、规划、树、层级选择、向导流组件已导出
- [x] Saved Variant persistence adapter 已有稳定 contract
- [ ] docs 有独立 Workflow Lab
- [ ] 至少 3 个真实业务场景串起新组件
- [ ] 关键键盘路径、a11y 文案和回归测试已补齐

## Main Demo

- Workflow Lab
- Upload queue
- Team planning board
- Hierarchical select form
- Wizard flow
- Persisted variants

## Main Risks

- 新组件面较广，若不先冻结边界，容易把 Sprint 6 做成松散拼盘
- PlanningCalendar 和 Tree 都带复杂键盘与焦点语义，若设计不统一，后续维护成本会明显上升
- Saved Variant persistence adapter 若过早绑死某一种存储方式，会限制后续产品化接入

## References

- [01-roadmap.md](../../01-roadmap.md)
- [04-sprint-checklists.md](../../04-sprint-checklists.md)
- [05-demo-scenarios.md](../../05-demo-scenarios.md)
