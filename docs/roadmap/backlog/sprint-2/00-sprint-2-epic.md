# Sprint 2 Epic

## Type

- Sprint Epic

## Goal

把 AxiomUI 从 foundation 阶段推进到可实际支撑企业表单和筛选场景的组件层，重点交付第一批高频输入控件和通用 Popover。

## Target Deliverables

- Shared field primitives
- Popover
- Select
- ComboBox
- MultiInput
- Calendar panel primitive
- DatePicker
- Form Lab

## Planned Task Breakdown

- [ ] 01 Shared field primitives
- [ ] 02 Popover
- [ ] 03 Select
- [ ] 04 ComboBox
- [ ] 05 MultiInput
- [ ] 06 Calendar panel primitive
- [ ] 07 DatePicker
- [ ] 08 Form integration pass
- [ ] 09 Form Lab 与 worklist demo
- [ ] 10 A11y 与 smoke tests

## Exit Criteria

- [ ] Popover、Select、ComboBox、MultiInput、DatePicker 已导出
- [ ] 新控件可在 `FormGrid`、`FormField`、`FilterBar` 中稳定协作
- [ ] docs 有独立 Form Lab
- [ ] 支持 `theme`、`density`、`RTL`、`locale`、`valueState`
- [ ] 核心键盘路径已覆盖

## Main Demo

- Form Lab
- Worklist filter demo

## Main Risks

- 共享 field primitives 不足，导致组件行为碎片化
- Popover 定位与关闭行为不稳定
- 新控件在 FormGrid 中再次出现空间冲突

## References

- [01-roadmap.md](../../01-roadmap.md)
- [04-sprint-checklists.md](../../04-sprint-checklists.md)
- [05-demo-scenarios.md](../../05-demo-scenarios.md)
