# S1-01 ThemeProvider And Theme Context

## Type

- Foundation Task

## Summary

实现 `ThemeProvider`、`useTheme` 和主题相关类型，让主题、密度和方向切换进入统一上下文。

## Goal

- 建立运行时主题切换入口
- 避免组件直接依赖 DOM attribute 细节
- 为后续多主题和 docs 控制台提供稳定 API

## Scope

- In scope:
  - `ThemeProvider`
  - `useTheme`
  - `AxiomThemeName`
  - `AxiomDensity`
  - `AxiomDirection`
- Out of scope:
  - 组件 CSS 全量迁移
  - 完整主题色值设计

## Planned File Areas

- `packages/react/src/providers/theme-provider.tsx`
- `packages/react/src/providers/use-theme.ts`
- `packages/react/src/types/theme.ts`
- `packages/react/src/index.ts`

## API Sketch

```ts
<ThemeProvider theme="horizon" density="cozy" dir="ltr">
  {children}
</ThemeProvider>
```

## Docs Impact

- Theme Lab 需要通过 provider 读写主题状态

## Testing

- provider 默认值
- 嵌套 provider 优先级
- 主题切换后 attribute 同步

## Acceptance Criteria

- [ ] `ThemeProvider` 与 `useTheme` 已导出
- [ ] 统一管理 `theme`、`density`、`dir`
- [ ] 不要求调用方手动拼接 DOM attribute
- [ ] docs 可消费 provider

## Dependencies

- 无

## Suggested Owner

- Foundation
