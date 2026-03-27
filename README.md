# AxiomUI

AxiomUI 是一个借鉴 SAP UI5 Horizon 设计语言的 React 组件库工作区。仓库保留了 `analysis/` 与 `demo/` 中的风格分析资产，并在 `apps/` 与 `packages/` 下提供了可运行、可测试、可发布的前端工程结构，便于继续向企业级组件体系演进。

## Workspace 结构

```text
apps/
  docs/        演示站与开发入口
packages/
  react/       React 组件库包
  tokens/      主题 token 与密度变量
analysis/      UI5 风格分析资料
demo/          现有静态 UI5 风格 demo
```

## 快速开始

```bash
pnpm install
pnpm dev
pnpm build
```

## 参与开发

- `CONTRIBUTING.md`：贡献指南，包含任务选择、issue/PR 流程、验证要求和 docs 验收路径
- `docs/release/README.md`：发布说明，包含 `pnpm changeset`、`pnpm release:check` 与当前发版流程
- `docs/release/admin-checklist.md`：仓库管理员检查清单，包含 branch protection、Actions、secret 与 Dependabot 启用项
- `docs/roadmap/onboarding/README.md`：新成员上手包，包含 30 分钟快速入门、角色 guide、执行清单和 demo walkthrough 清单

## 当前实施情况

截至 `2026-03-27`，仓库现状如下：

- `@axiomui/tokens`：已提供主题 token、semantic token、密度变量、全局样式输出，以及完整的 chart semantic tones、series palette、spacing 与 sizing tokens
- `@axiomui/react`：`Foundation`、`Form Core`、`Advanced Filters`、`Shell And Object Page`、`MicroChart` 主链路均已落地；当前已补齐 `VariantManager`、`ColumnManager`、`SortManager`、`GroupManager`、`useVariantSync`、`VariantSyncPanel / VariantSyncDialog` 等 sync primitives、`ChartSurface`、`ChartLegend`、`BulletMicroChart`、`RadialMicroChart`、`DeltaMicroChart`、`HarveyBallMicroChart`、`StackedBarMicroChart`、`InteractiveDonutChart`、`InteractiveLineChart`、`KpiCard`，并已新增 `Sprint 6` 的上传域基础与 saved variant persistence adapter：`UploadDropzone`、`UploadFileItemView`、upload state/copy helpers、persistence adapter contract、`localStorage / sessionStorage / memory` adapter
- `@axiomui/docs`：已提供 Theme、Overlay、Form、Advanced Filter Worklist、Side Navigation、ToolPage、Flexible Column Layout、Breadcrumbs、Avatar、Object Status / Identifier、Object Page Header / Layout、Dynamic Page、Object Page、Split Layout，以及独立 `Chart Lab`，覆盖 `KPI cards wall`、`Object page summary`、`Table and list inline indicators`
- docs 工程：已完成构建层手工分 chunk，并将 `operations`、`shell`、`charts` 三组重型演示区改为按视口接近时再挂载的运行时懒加载；同时已有 `App` 级 smoke 覆盖 eager/deferred 挂载顺序，以及 locale/density 切换后的延迟挂载路径
- 工程验证：当前快照已通过 `pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm release:check`
- 当前测试统计：`@axiomui/react` 为 `49` 个测试文件、`168` 个测试通过；`@axiomui/docs` 为 `10` 个测试文件、`35` 个测试通过；合计 `59` 个测试文件、`203` 个测试通过

## 项目规划文档

- `docs/roadmap/onboarding/README.md`：新成员 onboarding 入口
- `docs/roadmap/README.md`：路线图文档总览
- `docs/roadmap/01-roadmap.md`：阶段目标、里程碑、排期与并行工作流
- `docs/roadmap/02-api-conventions.md`：API 与实现约定
- `docs/roadmap/03-risk-register.md`：风险清单与缓解措施
- `docs/roadmap/04-sprint-checklists.md`：Sprint 1-5 交付检查表
- `docs/roadmap/05-demo-scenarios.md`：docs 演示与 walkthrough 场景
- `docs/roadmap/execution/current-status.md`：基于当前代码快照的实施情况汇总
- `docs/roadmap/backlog/README.md`：Sprint backlog 草稿入口
- `docs/roadmap/backlog/master-backlog-board.md`：六个 sprint 的总控板
- `docs/roadmap/backlog/owner-backlog-board.md`：按 owner 组织的分工视图
- `docs/roadmap/backlog/completion-snapshot.md`：`Sprint 1-5` 完成快照
- `docs/roadmap/execution/README.md`：周执行文档入口
- `docs/roadmap/meetings/README.md`：会议模板入口

## 协作模板

- `.github/ISSUE_TEMPLATE/foundation-task.md`：Foundation 类任务模板
- `.github/ISSUE_TEMPLATE/component-task.md`：组件实现任务模板
- `.github/ISSUE_TEMPLATE/docs-qa-task.md`：docs 与 QA 任务模板
- `.github/ISSUE_TEMPLATE/sprint-epic.md`：Sprint Epic 模板
- `.github/PULL_REQUEST_TEMPLATE.md`：PR 提交检查清单
- `.github/dependabot.yml`：依赖升级自动化配置

## 下一步建议

1. `Sprint 6` 当前最短路径是基于已完成的 upload primitives、`FileUploader` 和 saved variant persistence adapter 继续推进 `S6-03 Calendar`；`S6-09 Workflow Lab` 后续也应直接复用现有 mock cloud adapter、sync review 和 activity 模式。
2. 若继续扩展 docs，优先沿用当前按 `foundation / worklist / shell / charts / react domains` 的 chunk 划分与 deferred section 边界，不要回到单入口大包。
3. 新阶段继续保持 backlog、`README` 与 `current-status` 同步更新，避免代码和文档再次脱节。
