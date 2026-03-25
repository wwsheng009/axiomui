# S4-05 Breadcrumbs

## Type

- Component Task

## Summary

实现 Breadcrumbs，补齐对象页和详情页中的导航上下文。

## Goal

- 为对象页头部提供层级路径
- 支撑长路径场景下的折叠与溢出

## Scope

- In scope:
  - items
  - current item
  - overflow handling
  - separators
- Out of scope:
  - 真实路由系统集成

## Planned File Areas

- `packages/react/src/components/breadcrumbs/*`
- `packages/react/src/index.ts`

## Docs Impact

- Object Page Lab 需要展示对象路径

## Testing

- 溢出折叠
- 最后一项 current state
- RTL

## Acceptance Criteria

- [ ] 对象页和详情页可复用
- [ ] 长路径不会破坏头部布局
- [ ] 与 ObjectPageHeader 组合自然

## Dependencies

- Sprint 1 IconRegistry

## Suggested Owner

- Shell
