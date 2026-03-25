# Foundation Engineer Guide

## 这个角色负责什么

Foundation 方向负责让整个组件库“站得住”，而不是只让某个组件“看起来能用”。

主要范围包括：

- theme runtime
- semantic tokens
- density 与 direction 基础能力
- icon registry
- locale/i18n provider
- overlay foundation
- shared primitives

## 先看哪些文档

1. [../../02-api-conventions.md](../../02-api-conventions.md)
2. [../../03-risk-register.md](../../03-risk-register.md)
3. [../../backlog/sprint-1/README.md](../../backlog/sprint-1/README.md)
4. [../../backlog/owner-backlog-board.md](../../backlog/owner-backlog-board.md)

## 最常改的目录

- `packages/tokens/src/*`
- `packages/react/src/providers/*`
- `packages/react/src/lib/*`
- `packages/react/src/icons/*`
- `packages/react/src/index.ts`
- `apps/docs/src/*` 里的基础实验页

## 适合作为第一批承接的任务

- theme provider
- token 分层与主题覆盖
- icon registry
- locale provider
- overlay primitives
- shared field or chart primitives

## 这个角色的核心原则

- 先把接口做稳，再让业务组件接入
- 先做 semantic token，不要把视觉风格写死在组件层
- 能进 shared primitive 的逻辑，不要散落在多个组件里
- provider、hook、token 命名必须比组件更保守

## 最容易踩的坑

- 直接按某个组件的眼前需求设计 foundation API
- 在 `styles.css` 或组件 CSS 里继续引入裸色值
- overlay 未验证好就让多个组件同时依赖
- provider API 尚未稳定时就让 docs 和多个组件同时绑定

## 验收时至少看什么

- 主题切换是否真正影响多个组件
- `compact/cozy` 和 `LTR/RTL` 是否受支持
- foundation API 是否已经从 [../../../packages/react/src/index.ts](../../../packages/react/src/index.ts) 导出
- docs 是否有一页能稳定展示 foundation 能力

## 你最常协作的角色

- `Form Engineer`
- `Shell Engineer`
- `Docs Engineer`
- `QA/Accessibility Engineer`
