# S1-04 Theme Lab And Docs Shell

## Type

- Docs Or QA Task

## Summary

在 docs 中建立独立的 Theme Lab，并顺手把 docs 入口从单一大文件继续拆薄。

## Goal

- 提供 foundation 能力的统一验收页
- 降低多人长期同时修改 `apps/docs/src/app.tsx` 的冲突

## Scope

- In scope:
  - Theme Lab 页面
  - theme/density/dir/locale 控制台
  - docs shell 拆分
- Out of scope:
  - 大批新组件 demo

## Planned File Areas

- `apps/docs/src/app.tsx`
- `apps/docs/src/theme-lab/*`
- `apps/docs/src/app-shell/*`

## Walkthrough

1. 切换主题
2. 切换 density
3. 切换 LTR/RTL
4. 切换 locale
5. 检查 Button、Input、Card、Tabs、Dialog、Toolbar、MessageStrip

## Testing

- 刷新后配置保持
- 多环境切换不报错

## Acceptance Criteria

- [ ] docs 中存在独立 Theme Lab
- [ ] foundation 相关状态都可从 UI 切换
- [ ] docs 结构比现有入口更易扩展

## Dependencies

- S1-01
- S1-02
- S1-06

## Suggested Owner

- Docs
