# S3-07 FilterBar Advanced Integration

## Type

- Component Task

## Summary

把 MultiComboBox、DateRangePicker、TimePicker 真正接入现有 FilterBar，让复杂筛选在真实业务语境里稳定工作。

## Goal

- 验证高级输入控件在 FilterBar 中的协作关系
- 避免复杂控件混排时再次出现空间干涉

## Scope

- In scope:
  - FilterBar 混排
  - valueState/helpText 协作
  - 紧凑模式验证
  - 小宽度换行与布局稳定性
- Out of scope:
  - 服务端筛选

## Planned File Areas

- `packages/react/src/components/filter-bar/*`
- `packages/react/src/components/form-grid/*`
- 新控件相关样式

## Docs Impact

- Advanced Filter Worklist 需要以此为基础

## Testing

- 布局收缩
- label 与控件对齐
- compact/cozy
- RTL

## Acceptance Criteria

- [ ] 复杂控件可稳定混排在 FilterBar 中
- [ ] 不出现空间溢出或相互遮挡
- [ ] 筛选状态与帮助文案表现一致

## Dependencies

- S3-01
- S3-02
- S3-03

## Suggested Owner

- Form
