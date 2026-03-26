---
"@axiomui/react": minor
"@axiomui/tokens": patch
---

新增一批可发布的 React 公共能力，包括 `Dialog`、`Menu`、`MessagePopover`、
`ResponsivePopover`、`DateRangePicker`、`TimePicker` 与 variant sync 相关组件和
hook，并补齐对应的 docs 示例、测试覆盖和入口导出。

这次发布也修复了 `@axiomui/react` 的类型产物构建链路，发布包现在会稳定包含
`dist/types` 下的声明文件，而不会遗漏对 TypeScript 使用者必需的 `.d.ts` 输出。

同时补齐了 `@axiomui/tokens` 的公开发布元数据配置，使其可以和 `@axiomui/react`
一起纳入 changeset 驱动的发布流程。两个可发布包现在也补齐了 `repository`、
`bugs` 和 `homepage` 元数据。当前 release workflow 也会在 CI 发布阶段按 npm
官方推荐方式启用 provenance，并为后续切换到 trusted publishing 准备了必要的
包元信息。
