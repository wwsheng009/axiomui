# First Task Playbook

这份 playbook 用来把“知道项目结构”推进到“可以安全接一个任务”。

## 1. 先选任务，不要先选文件

推荐入口顺序：

1. [../execution/weekly-execution-board.md](../execution/weekly-execution-board.md)
   先看当前周的执行重点。
2. [../backlog/owner-backlog-board.md](../backlog/owner-backlog-board.md)
   再按 owner 视角找适合自己的任务。
3. [../backlog/master-backlog-board.md](../backlog/master-backlog-board.md)
   最后确认依赖、状态和 sprint 位置。

如果你是按 sprint 接任务，也可以直接进入对应目录：

- [../backlog/sprint-1/README.md](../backlog/sprint-1/README.md)
- [../backlog/sprint-2/README.md](../backlog/sprint-2/README.md)
- [../backlog/sprint-3/README.md](../backlog/sprint-3/README.md)
- [../backlog/sprint-4/README.md](../backlog/sprint-4/README.md)
- [../backlog/sprint-5/README.md](../backlog/sprint-5/README.md)

## 2. 在建 issue 之前先确认四件事

- 主依赖是否已经完成
- API 命名是否已经在 [../02-api-conventions.md](../02-api-conventions.md) 中有约定
- 是否已有共享 primitive 可复用
- docs 写入位置和 demo 场景是否已经明确

如果这四件事没确认，越早开工越容易返工。

## 3. 用模板把任务收口

仓库已经提供了 issue 模板：

- [../../../.github/ISSUE_TEMPLATE/foundation-task.md](../../../.github/ISSUE_TEMPLATE/foundation-task.md)
- [../../../.github/ISSUE_TEMPLATE/component-task.md](../../../.github/ISSUE_TEMPLATE/component-task.md)
- [../../../.github/ISSUE_TEMPLATE/docs-qa-task.md](../../../.github/ISSUE_TEMPLATE/docs-qa-task.md)
- [../../../.github/ISSUE_TEMPLATE/sprint-epic.md](../../../.github/ISSUE_TEMPLATE/sprint-epic.md)

建议做法：

1. 从 backlog 草稿复制标题、目标、依赖和验收标准
2. 按模板补齐写入范围、测试点、docs demo 和风险
3. 在 issue 里显式贴出 `draft_path`

## 4. 开发时的最小写入范围

多数任务都不止改一个文件。通常至少会落到：

- `packages/react/src/components/*`
- `packages/react/src/lib/*` 或 `packages/react/src/providers/*`
- `packages/tokens/src/*`
- `apps/docs/src/*`
- `packages/react/src/index.ts`

如果一个组件任务只改了组件文件，大概率还没完成。

## 5. 交付时默认要带上的四件套

- 组件或基础设施实现
- token 接入
- docs 示例
- 最小验证路径

验证至少包括：

```bash
pnpm typecheck
pnpm build
```

如果涉及交互，再补：

- keyboard path
- `compact/cozy`
- `LTR/RTL`
- locale
- 对应 demo walkthrough

## 6. 提 PR 前看一眼这些文档

- [../../../CONTRIBUTING.md](../../../CONTRIBUTING.md)
- [../05-demo-scenarios.md](../05-demo-scenarios.md)
- [../meetings/weekly-sync-template.md](../meetings/weekly-sync-template.md)
- [../../../.github/PULL_REQUEST_TEMPLATE.md](../../../.github/PULL_REQUEST_TEMPLATE.md)

## 7. 一个好的一号任务长什么样

适合第一次接手的任务通常有这些特点：

- 写入范围相对集中
- 依赖已经就绪
- docs 场景清楚
- 不需要改太多共享基础设施

比较适合新成员的第一批任务：

- token 清扫类任务
- docs lab 搭建与示例接线
- 单个基础组件或一个明确的子组件
- 回归测试和 walkthrough 场景补全

## 8. 一个任务完成后别忘了回写

完成后至少回写下面几处中的一处：

- backlog 状态
- weekly execution board
- 周会同步记录
- 相关 decision log 或 risk retro

这样后续协作者才能接得稳。
