# QA And Accessibility Engineer Guide

## 这个角色负责什么

QA 与 Accessibility 方向负责把“看起来完成”推进到“可以稳定交付”。

主要范围包括：

- smoke tests
- 回归路径维护
- keyboard path 验证
- focus 管理、dismiss 行为检查
- docs walkthrough 验收
- 风险复盘与结构性问题回写

## 先看哪些文档

1. [../../03-risk-register.md](../../03-risk-register.md)
2. [../../04-sprint-checklists.md](../../04-sprint-checklists.md)
3. [../04-demo-walkthrough-checklist.md](../04-demo-walkthrough-checklist.md)
4. [../../meetings/risk-retro-template.md](../../meetings/risk-retro-template.md)

## 最常改的目录

- `packages/react/src/**/*.test.*`
- 测试配置文件
- `apps/docs/src/*` 中与 walkthrough 对应的示例
- `docs/roadmap/meetings/*`

## 适合作为第一批承接的任务

- foundation smoke tests
- form control keyboard 回归
- overlay dismiss/focus 测试
- docs walkthrough 清单补齐
- sprint 验收检查项回写

## 这个角色的核心原则

- 优先覆盖高风险交互路径，不要只追求测试数量
- docs walkthrough 是质量入口，不只是展示入口
- 键盘和焦点行为必须和视觉一起验收
- 发现结构性问题时要回写到风险或决策文档里

## 最容易踩的坑

- 只验证鼠标路径，不验证键盘
- 只在默认主题下验收
- 发现问题只在口头同步，不回写文档
- 测试覆盖了组件单元，却没有覆盖 docs 中的真实集成场景

## 验收时至少看什么

- `pnpm typecheck`
- `pnpm build`
- 关键交互 smoke tests
- docs walkthrough 清单执行结果
- 风险是否需要进入 [../../03-risk-register.md](../../03-risk-register.md)

## 你最常协作的角色

- 所有 owner

这个角色的价值往往体现在“帮团队更早发现返工信号”，而不是在最后阶段补测试。
