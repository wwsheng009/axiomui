# S3-10 A11y And Regression Tests

## Type

- Docs Or QA Task

## Summary

为 Sprint 3 的复杂输入控件和自适应弹层补齐回归测试、键盘测试和基础无障碍验证。

## Goal

- 稳住复杂组合控件和弹层的交互质量
- 防止在 Sprint 4 继续扩壳层时回归

## Scope

- In scope:
  - MultiComboBox 测试
  - DateRangePicker 测试
  - TimePicker 测试
  - ResponsivePopover 测试
  - Menu 测试
  - MessagePopover 测试
- Out of scope:
  - 全量视觉回归平台

## Planned File Areas

- `packages/react/src/**/*.test.*`
- test configuration files

## Verification Plan

- `pnpm typecheck`
- `pnpm build`
- Advanced Filter Worklist walkthrough
- keyboard walkthrough

## Acceptance Criteria

- [ ] 复杂组合控件有关键路径测试
- [ ] 弹层切换与焦点回收有测试
- [ ] docs walkthrough 可作为人工验收脚本

## Dependencies

- S3-01
- S3-02
- S3-03
- S3-04
- S3-05
- S3-06

## Suggested Owner

- QA
