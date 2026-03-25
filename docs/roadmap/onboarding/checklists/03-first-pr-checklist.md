# First PR Checklist

这份清单用于第一次提交 PR 前的自检。

## 任务完整性

- [ ] 任务目标和写入范围已经在 issue 中写清楚
- [ ] 主依赖已经完成，或者已在 PR 中明确说明风险
- [ ] 当前改动不只是单文件样例，而是回到了公共导出和 demo 场景

## 代码与 docs

- [ ] 已补公共导出，例如 `packages/react/src/index.ts`
- [ ] 已补 docs 示例或对应 lab 的真实场景
- [ ] 已补必要 token 接入，而不是直接写裸色值
- [ ] 已补最小使用说明或让 docs 足够自解释

## 验证

- [ ] 已运行 `pnpm typecheck`
- [ ] 已运行 `pnpm build`
- [ ] 已手动检查主题切换
- [ ] 已手动检查 `compact/cozy`
- [ ] 已手动检查 `LTR/RTL`
- [ ] 如果任务涉及日期/时间/数字，已检查 locale
- [ ] 如果任务涉及交互，已检查 keyboard path 和 dismiss/focus 行为

## PR 描述

- [ ] 已使用 [../../../../.github/PULL_REQUEST_TEMPLATE.md](../../../../.github/PULL_REQUEST_TEMPLATE.md)
- [ ] 已写明改动范围
- [ ] 已关联 issue 或 backlog draft
- [ ] 已说明 docs/demo 变化
- [ ] 已说明测试与手动验证结果

## 提交前最后一问

如果 reviewer 只看你的 docs 演示站和 PR 描述，是否已经能理解：

- 你改了什么
- 为什么这么改
- 怎么验证
- 还有什么已知限制
