# S1-10 Foundation Exports And Usage Docs

## Type

- Docs Or QA Task

## Summary

统一导出 foundation API，并补一组最小使用说明，确保消费者知道主题、图标、locale 和 overlay 该怎么接。

## Goal

- 收口 provider、hooks、icons、overlay 的对外入口
- 降低后续组件消费成本

## Scope

- In scope:
  - `packages/react/src/index.ts` 导出收口
  - foundation usage 文档
  - README 入口更新
- Out of scope:
  - 完整长篇开发者门户

## Planned File Areas

- `packages/react/src/index.ts`
- `README.md`
- `docs/roadmap/*`
- `apps/docs/src/...` 中 foundation usage 示例

## Docs Impact

- 至少补一页 foundation usage 示例
- 说明 ThemeProvider、LocaleProvider、Icon、overlay 的接法

## Testing

- 导出路径检查
- 示例代码可运行

## Acceptance Criteria

- [ ] foundation API 已统一导出
- [ ] README 和 roadmap 能找到使用入口
- [ ] docs 至少有一处最小接入示例

## Dependencies

- S1-01
- S1-05
- S1-06
- S1-07

## Suggested Owner

- Docs
