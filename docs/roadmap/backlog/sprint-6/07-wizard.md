# S6-07 Wizard

## Type

- Component Task

## Summary

实现 Wizard，支撑多步业务流程、步骤校验和向前或向后导航。

## Goal

- 覆盖更长表单流和任务流场景
- 提供比单页大表单更可控的流程化容器

## Scope

- In scope:
  - step header
  - next or previous navigation
  - blocked step progression
  - completed or current or upcoming state
  - step content container
- Out of scope:
  - 路由编排
  - 自动草稿保存
  - 复杂分支引擎

## Planned File Areas

- `packages/react/src/components/wizard/*`
- `packages/react/src/index.ts`

## Docs Impact

- Workflow Lab 需要有多步流程 demo

## Testing

- next or previous navigation
- blocked step logic
- focus handoff between steps
- step state labels

## Acceptance Criteria

- [ ] Wizard 可承载多步业务流
- [ ] 步骤状态和阻塞逻辑清晰
- [ ] docs 可演示完整从开始到完成的流程

## Dependencies

- S2 form integration
- S4 shell and page patterns

## Suggested Owner

- Shell
