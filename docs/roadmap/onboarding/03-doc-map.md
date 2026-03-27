# Doc Map

这份文档回答一个最常见的问题：我现在要解决的事情，应该看哪份文档。

## 如果你想理解项目全貌

优先看：

- [../../../README.md](../../../README.md)
- [../README.md](../README.md)
- [../01-roadmap.md](../01-roadmap.md)

适用场景：

- 刚进入仓库
- 想知道阶段目标和总体顺序
- 需要和别人说明项目为什么这样排期

## 如果你想找任务

优先看：

- [../backlog/master-backlog-board.md](../backlog/master-backlog-board.md)
- [../backlog/owner-backlog-board.md](../backlog/owner-backlog-board.md)
- [../backlog/README.md](../backlog/README.md)

适用场景：

- 想找自己可以承接的任务
- 想看依赖关系
- 想把任务复制成 issue

## 如果你已经在某个 sprint 内推进

优先看对应 sprint backlog：

- [../backlog/sprint-1/README.md](../backlog/sprint-1/README.md)
- [../backlog/sprint-2/README.md](../backlog/sprint-2/README.md)
- [../backlog/sprint-3/README.md](../backlog/sprint-3/README.md)
- [../backlog/sprint-4/README.md](../backlog/sprint-4/README.md)
- [../backlog/sprint-5/README.md](../backlog/sprint-5/README.md)

适用场景：

- 你已经知道自己在哪个 sprint
- 需要具体 task draft
- 需要拷贝 issue 标题、目标、验收点

## 如果你要控制实现风格和 API 一致性

优先看：

- [../02-api-conventions.md](../02-api-conventions.md)
- [../../../CONTRIBUTING.md](../../../CONTRIBUTING.md)

适用场景：

- 不确定 props 命名怎么定
- 不确定 token、provider、docs、测试要不要一起补
- 多人并行，怕接口漂移

## 如果你要安排周执行

优先看：

- [../backlog/master-backlog-board.md](../backlog/master-backlog-board.md)
- [../backlog/owner-backlog-board.md](../backlog/owner-backlog-board.md)
- [../execution/current-status.md](../execution/current-status.md)
- [../execution/weekly-execution-board.md](../execution/weekly-execution-board.md)
- [../backlog/import/master-backlog-board.csv](../backlog/import/master-backlog-board.csv)
- [../backlog/import/owner-backlog-board.csv](../backlog/import/owner-backlog-board.csv)

适用场景：

- 做周会
- 分配 owner
- 看当前真实状态或缺口
- 导入项目管理工具

补充说明：

- markdown board 和 `current-status` 反映当前代码快照
- `backlog/import/*.csv` 更适合第一次导入项目管理工具，不是实时状态源

## 如果你要主持会议或做复盘

优先看：

- [../meetings/weekly-sync-template.md](../meetings/weekly-sync-template.md)
- [../meetings/milestone-review-template.md](../meetings/milestone-review-template.md)
- [../meetings/risk-retro-template.md](../meetings/risk-retro-template.md)
- [../meetings/decision-log-template.md](../meetings/decision-log-template.md)

适用场景：

- 周会同步
- 里程碑验收
- 返工复盘
- API 或架构决策记录

## 如果你要验证 docs 演示站

优先看：

- [../05-demo-scenarios.md](../05-demo-scenarios.md)
- [04-demo-walkthrough-checklist.md](./04-demo-walkthrough-checklist.md)

适用场景：

- 提交 PR 前自检
- walkthrough
- reviewer 验收 demo

## 如果你不确定从哪里开始

默认顺序可以直接照着走：

1. [../../../README.md](../../../README.md)
2. [../../../CONTRIBUTING.md](../../../CONTRIBUTING.md)
3. [../README.md](../README.md)
4. [01-first-30-minutes.md](./01-first-30-minutes.md)
5. [02-first-task-playbook.md](./02-first-task-playbook.md)
