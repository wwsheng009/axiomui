# Contributing To AxiomUI

这份指南用于把 AxiomUI 的路线图、backlog、执行板和协作模板收口成一条可直接上手的贡献路径。

## 先看什么

如果你是第一次参与这个仓库，建议按下面顺序阅读：

1. [README.md](./README.md)
   先理解仓库结构和主要入口。
2. [docs/roadmap/onboarding/README.md](./docs/roadmap/onboarding/README.md)
   用 30-60 分钟建立最小上下文，再决定接什么任务。
3. [docs/roadmap/README.md](./docs/roadmap/README.md)
   查看路线图、backlog、执行板和会议模板的总入口。
4. [docs/roadmap/backlog/master-backlog-board.md](./docs/roadmap/backlog/master-backlog-board.md)
   看全局任务和依赖。
5. [docs/roadmap/backlog/owner-backlog-board.md](./docs/roadmap/backlog/owner-backlog-board.md)
   按 owner 查看当前更适合你承接的任务。
6. [docs/roadmap/execution/weekly-execution-board.md](./docs/roadmap/execution/weekly-execution-board.md)
   看当前周的执行重点和验收点。

## 任务怎么选

### 如果你按 Sprint 工作

从对应 sprint 的 backlog 进入：

- [Sprint 1](./docs/roadmap/backlog/sprint-1/README.md)
- [Sprint 2](./docs/roadmap/backlog/sprint-2/README.md)
- [Sprint 3](./docs/roadmap/backlog/sprint-3/README.md)
- [Sprint 4](./docs/roadmap/backlog/sprint-4/README.md)
- [Sprint 5](./docs/roadmap/backlog/sprint-5/README.md)

### 如果你按角色工作

优先看 [owner-backlog-board.md](./docs/roadmap/backlog/owner-backlog-board.md)，再看 [role-guides/README.md](./docs/roadmap/onboarding/role-guides/README.md) 和对应 task 草稿。

### 如果你按周执行

优先看 [weekly-execution-board.md](./docs/roadmap/execution/weekly-execution-board.md)，再回跳具体 backlog 草稿。

## 建 issue 的方式

仓库已经提供了协作模板：

- `Foundation`
  [foundation-task.md](./.github/ISSUE_TEMPLATE/foundation-task.md)
- `Component`
  [component-task.md](./.github/ISSUE_TEMPLATE/component-task.md)
- `Docs/QA`
  [docs-qa-task.md](./.github/ISSUE_TEMPLATE/docs-qa-task.md)
- `Sprint Epic`
  [sprint-epic.md](./.github/ISSUE_TEMPLATE/sprint-epic.md)

建议流程：

1. 先从 backlog draft 复制任务内容。
2. 再用对应 issue template 收口字段。
3. 把 `draft_path` 或相关 roadmap 文档链接贴回 issue。
4. 明确 owner、依赖和验收标准后再开工。

## 开发前检查

开始写代码前，先确认：

- 当前任务依赖是否已完成
- 相关 API 命名是否已冻结
- 是否存在共享 primitive 可复用
- docs 写入位置是否明确
- 是否会和别人长期改同一个大文件

重点参考：

- [02-api-conventions.md](./docs/roadmap/02-api-conventions.md)
- [03-risk-register.md](./docs/roadmap/03-risk-register.md)
- [05-demo-scenarios.md](./docs/roadmap/05-demo-scenarios.md)

## 实现要求

每个任务不只交组件代码，还需要同时交：

- 组件或基础设施代码
- token 接入
- docs 示例
- 测试或 smoke path
- 导出入口
- 面向发布包改动时对应的 `.changeset/*.md`
- 必要的简短说明

不要接受以下半成品：

- 只有组件，没有 docs
- 只有 demo，没有公共导出
- 只有视觉，没有键盘路径
- 只有 happy path，没有最小测试
- 改了可发布包，却没有 changeset

## 目录约定

### 组件代码

- `packages/react/src/components/*`
- `packages/react/src/lib/*`
- `packages/react/src/providers/*`
- `packages/react/src/index.ts`

### token

- `packages/tokens/src/*`

### docs

尽量拆到独立 lab，不要长期堆在一个入口文件：

- `theme-lab`
- `form-lab`
- `worklist-advanced`
- `shell-lab`
- `object-page-lab`
- `chart-lab`

## 设计与 API 约定

### 输入组件

优先统一：

- `value`
- `defaultValue`
- `onValueChange`
- `disabled`
- `readOnly`
- `required`
- `placeholder`
- `valueState`
- `helpText`

### 弹层组件

优先统一：

- `open`
- `defaultOpen`
- `onOpenChange`
- `anchorRef`
- `placement`

### token

不在组件层新增裸色值，优先使用 semantic tokens。

## 验证要求

提交前至少跑：

```bash
pnpm typecheck
pnpm build
```

如果任务涉及交互，还要手动验证：

- theme 切换
- `compact/cozy`
- `LTR/RTL`
- keyboard path
- docs 对应 demo

如果任务涉及日期、时间、数字显示，还要验证 locale。

如果改动涉及可发布包，先执行：

```bash
pnpm changeset
```

如果准备发布包或改动了公共导出、构建、打包、类型声明，还要额外执行：

```bash
pnpm release:check
```

如果改动了 `.github/workflows/*` 或发布自动化逻辑，还要执行：

```bash
pnpm lint:workflows
```

发布检查细则见 [docs/release/README.md](./docs/release/README.md)。

仓库还启用了 Dependabot 配置：

- `npm` 依赖更新
- `github-actions` 依赖更新

当收到这类自动升级 PR 时，仍然要按同样的验证要求执行对应检查。

## Pull Request 要求

PR 统一使用：

- [PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md)

提交 PR 时请明确：

- 改动范围
- 关联 issue
- docs/demo 变化
- 测试变化
- a11y 检查结果

## 推荐提交流程

1. 选定任务并确认依赖。
2. 建 issue。
3. 实现代码与 docs 示例。
4. 运行 `pnpm typecheck` 和 `pnpm build`。
5. 按模板提交 PR。
6. walkthrough 对应 demo。
7. 合并后回写 backlog 或执行板状态。

## 周会与验收

每周同步优先使用：

- [weekly-sync-template.md](./docs/roadmap/meetings/weekly-sync-template.md)

Sprint 或 milestone 验收优先使用：

- [milestone-review-template.md](./docs/roadmap/meetings/milestone-review-template.md)

出现返工或结构性问题时补：

- [risk-retro-template.md](./docs/roadmap/meetings/risk-retro-template.md)

做关键 API 或架构决策时补：

- [decision-log-template.md](./docs/roadmap/meetings/decision-log-template.md)

## 最后原则

- 先复用，再新增
- 先补底座，再扩控件
- 先让 docs 可验证，再谈完成
- 先把 API 做稳，再并行铺开
- 让每个组件都能在真实业务场景里出现，而不是只停留在样例页
