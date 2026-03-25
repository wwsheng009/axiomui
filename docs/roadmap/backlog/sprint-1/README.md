# Sprint 1 Backlog

## Sprint 目标

建立 AxiomUI 的 Foundation 层，让主题、图标、国际化和 overlay 成为后续组件族的稳定底座。

## 建议时间窗口

- Week 1-2

## Epic

- [00-sprint-1-epic.md](./00-sprint-1-epic.md)

## Task Drafts

- [01-theme-provider-and-theme-context.md](./01-theme-provider-and-theme-context.md)
- [02-token-layering-and-theme-files.md](./02-token-layering-and-theme-files.md)
- [03-component-token-cleanup.md](./03-component-token-cleanup.md)
- [04-theme-lab-and-docs-shell.md](./04-theme-lab-and-docs-shell.md)
- [05-icon-registry-v1.md](./05-icon-registry-v1.md)
- [06-locale-provider-and-formatters.md](./06-locale-provider-and-formatters.md)
- [07-overlay-foundation.md](./07-overlay-foundation.md)
- [08-dialog-overlay-migration.md](./08-dialog-overlay-migration.md)
- [09-foundation-smoke-tests.md](./09-foundation-smoke-tests.md)
- [10-foundation-exports-and-usage-docs.md](./10-foundation-exports-and-usage-docs.md)

## 建议并行分组

- `Track A`
  ThemeProvider、token 分层、组件 token 清扫
- `Track B`
  IconRegistry、LocaleProvider
- `Track C`
  Overlay foundation、Dialog 迁移
- `Track D`
  Theme Lab、文档导出、smoke tests

## Sprint 退出标准

- 至少 6 套主题可切换
- docs 可切换 theme、density、dir、locale
- Dialog 已接入 overlay foundation
- foundation 层已有最小 smoke tests
- 导出入口和使用说明已收口
