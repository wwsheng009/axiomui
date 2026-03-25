# S4-09 ObjectPageLayout

## Type

- Component Task

## Summary

实现 ObjectPageLayout 与 subsection 结构，把现有对象页导航升级为完整对象页框架。

## Goal

- 支撑 section、subsection、anchor sync
- 与现有 DynamicPage、ObjectPageNav 协作，而不是简单重复

## Scope

- In scope:
  - sections
  - subsections
  - active section
  - anchor bar
  - scroll sync
- Out of scope:
  - 后端数据加载

## Planned File Areas

- `packages/react/src/components/object-page-layout/*`
- `packages/react/src/index.ts`

## Docs Impact

- Object Page Lab 需要展示 section 与 subsection

## Testing

- section 跳转
- 滚动同步
- 窄屏行为
- anchor bar 状态

## Acceptance Criteria

- [ ] 对象页不再只是 section tab 导航
- [ ] 支持 header、section、subsection 的完整组合
- [ ] 可在 docs 中稳定演示

## Dependencies

- S4-08
- 现有 DynamicPage/ObjectPageNav

## Suggested Owner

- Shell
