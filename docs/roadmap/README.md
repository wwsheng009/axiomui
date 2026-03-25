# AxiomUI Roadmap Docs

这组文档用于把 AxiomUI 从“借鉴 SAP UI5 设计语言的 React 组件库原型”推进到“可持续扩展的企业前端组件体系”。

如果你要直接参与开发，也可以先看根目录的 [CONTRIBUTING.md](../../CONTRIBUTING.md)。

## 文档目录

- [onboarding/README.md](./onboarding/README.md)
  新成员上手包，包含 30 分钟入门、首个任务 playbook、角色 guide、执行清单和 demo walkthrough 清单。
- [01-roadmap.md](./01-roadmap.md)
  项目主路线图、阶段目标、里程碑、并行工作流和人力配置建议。
- [02-api-conventions.md](./02-api-conventions.md)
  组件 API、Provider、token、目录结构、测试和 a11y 的统一约定。
- [03-risk-register.md](./03-risk-register.md)
  关键风险、预警信号、缓解措施与建议 owner。
- [04-sprint-checklists.md](./04-sprint-checklists.md)
  Sprint 1 到 Sprint 5 的目标、交付清单、退出标准和建议评审点。
- [05-demo-scenarios.md](./05-demo-scenarios.md)
  docs 演示站应覆盖的场景清单和 walkthrough 脚本。
- [backlog/README.md](./backlog/README.md)
  backlog 草稿总览，包含可直接复制为 issue 的 sprint 任务草案。
- [backlog/master-backlog-board.md](./backlog/master-backlog-board.md)
  五个 sprint 的总控板，汇总 owner、状态、依赖与 draft 入口。
- [backlog/owner-backlog-board.md](./backlog/owner-backlog-board.md)
  按 owner 组织的分工视图，适合直接做团队排班和任务归属。
- [execution/README.md](./execution/README.md)
  周执行文档入口，包含周计划和执行看板。
- [meetings/README.md](./meetings/README.md)
  会议模板入口，包含周会、里程碑验收、风险复盘和决策记录模板。

## 协作模板

- `.github/ISSUE_TEMPLATE/foundation-task.md`
  Foundation、主题、图标、i18n、overlay 一类任务模板。
- `.github/ISSUE_TEMPLATE/component-task.md`
  组件和组件族实现任务模板。
- `.github/ISSUE_TEMPLATE/docs-qa-task.md`
  docs、walkthrough、测试和回归任务模板。
- `.github/ISSUE_TEMPLATE/sprint-epic.md`
  sprint 级 epic 模板。
- `.github/PULL_REQUEST_TEMPLATE.md`
  PR 提交检查清单，约束 token、demo、测试和 a11y。

## 当前规划假设

- 总周期按 `10-12 周` 规划，分为 `5 个 sprint`，每个 sprint `2 周`
- 优先顺序是：`Foundation -> Form Controls -> Overlay & Feedback -> Shell & Object Page -> MicroChart`
- 每个功能任务都必须同时交付：
  - 组件代码
  - token 接入
  - docs 示例
  - 基础测试
  - 导出入口
  - 简短使用说明

## 建议使用方式

1. 新成员先从 [onboarding/README.md](./onboarding/README.md) 开始，快速进入上下文。
2. 用 [01-roadmap.md](./01-roadmap.md) 做整体排期和 milestone 管理。
3. 用 [04-sprint-checklists.md](./04-sprint-checklists.md) 建立 sprint backlog。
4. 用 [02-api-conventions.md](./02-api-conventions.md) 控制多人并行时的 API 一致性。
5. 用 [03-risk-register.md](./03-risk-register.md) 作为周会中的风险跟踪表。
6. 用 [05-demo-scenarios.md](./05-demo-scenarios.md) 作为 docs 验收和 walkthrough 清单。
