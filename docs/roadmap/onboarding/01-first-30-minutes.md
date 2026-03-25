# First 30 Minutes

这份清单的目标不是让你一次性读完整个项目，而是先建立“能开始干活”的最小上下文。

## 0-5 分钟：跑起项目

在仓库根目录执行：

```bash
pnpm install
pnpm dev
```

如果只做快速确认，至少再跑一次：

```bash
pnpm build
```

这一步的目标只有两个：

- 确认本地环境能把 docs 跑起来
- 确认你知道演示站是当前主要验证入口

## 5-10 分钟：理解仓库骨架

优先看下面三份文件：

1. [../../../README.md](../../../README.md)
2. [../../../CONTRIBUTING.md](../../../CONTRIBUTING.md)
3. [../README.md](../README.md)

你需要先知道：

- 代码主要在 `packages/react`、`packages/tokens`、`apps/docs`
- 规划文档主要在 `docs/roadmap`
- 当前仓库强调的是“组件 + token + docs + 测试”一起交付

## 10-20 分钟：看当前计划，而不是盲目找代码

按下面顺序快速过一遍：

1. [../01-roadmap.md](../01-roadmap.md)
   看阶段目标和优先级顺序。
2. [../backlog/master-backlog-board.md](../backlog/master-backlog-board.md)
   看 sprint、epic、依赖和任务全貌。
3. [../backlog/owner-backlog-board.md](../backlog/owner-backlog-board.md)
   看按 owner 分工后的任务归属。
4. [../execution/weekly-execution-board.md](../execution/weekly-execution-board.md)
   看当前周的重点，不要选到还没到执行窗口的任务。

这一步结束时，你应该能说出：

- 当前最近在推进哪一层能力
- 你自己更适合哪一类任务
- 现在有哪些任务会和别人冲突

## 20-30 分钟：走一遍 docs 演示站

优先观察：

- 主题与密度切换是否正常
- 现有 worklist、variant、sync 场景是否能走通
- 当前组件风格更偏哪个 UI5 语境

建议同步参考：

- [../05-demo-scenarios.md](../05-demo-scenarios.md)
- [04-demo-walkthrough-checklist.md](./04-demo-walkthrough-checklist.md)

如果这一步你已经能定位“我后续改动应该落到哪个 demo 区”，上手就很顺了。

## 30 分钟结束时的最小产出

请至少完成下面四件事：

- 本地把 docs 跑起来
- 确认一个准备承接的任务方向
- 记下 3 个你认为最关键的入口文件或文档
- 知道提交前至少要跑 `pnpm typecheck` 和 `pnpm build`

## 常见误区

- 不要一开始就扎进组件代码而不看 backlog
- 不要只看视觉，不看 docs 里的真实业务示例
- 不要只做组件，不补 token、demo 和验证路径
- 不要默认自己在做独立项目，这个仓库强调的是并行协作
