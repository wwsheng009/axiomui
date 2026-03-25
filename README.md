# AxiomUI

AxiomUI 是一个借鉴 SAP UI5 Horizon 设计语言的 React 组件库初始化仓库。当前结构把现有 `analysis/` 与 `demo/` 里的样式分析保留为参考资产，并新增一个可运行的前端工作区，方便继续往组件库方向演进。

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
- `docs/roadmap/onboarding/README.md`：新成员上手包，包含 30 分钟快速入门、角色 guide、执行清单和 demo walkthrough 清单

## 当前初始化内容

- `@axiomui/tokens`：基础主题 token、密度模式变量、全局设计变量
- `@axiomui/react`：`AppShell`、`Button`、`Input`、`Card`、`PageSection` 五个起步组件
- `@axiomui/docs`：一个用于预览主题和组件的 Vite 演示应用

## 项目规划文档

- `docs/roadmap/onboarding/README.md`：新成员 onboarding 入口
- `docs/roadmap/README.md`：路线图文档总览
- `docs/roadmap/01-roadmap.md`：阶段目标、里程碑、排期与并行工作流
- `docs/roadmap/02-api-conventions.md`：API 与实现约定
- `docs/roadmap/03-risk-register.md`：风险清单与缓解措施
- `docs/roadmap/04-sprint-checklists.md`：Sprint 1-5 交付检查表
- `docs/roadmap/05-demo-scenarios.md`：docs 演示与 walkthrough 场景
- `docs/roadmap/backlog/README.md`：Sprint backlog 草稿入口
- `docs/roadmap/backlog/master-backlog-board.md`：五个 sprint 的总控板
- `docs/roadmap/backlog/owner-backlog-board.md`：按 owner 组织的分工视图
- `docs/roadmap/execution/README.md`：周执行文档入口
- `docs/roadmap/meetings/README.md`：会议模板入口

## 协作模板

- `.github/ISSUE_TEMPLATE/foundation-task.md`：Foundation 类任务模板
- `.github/ISSUE_TEMPLATE/component-task.md`：组件实现任务模板
- `.github/ISSUE_TEMPLATE/docs-qa-task.md`：docs 与 QA 任务模板
- `.github/ISSUE_TEMPLATE/sprint-epic.md`：Sprint Epic 模板
- `.github/PULL_REQUEST_TEMPLATE.md`：PR 提交检查清单

## 下一步建议

1. 继续补齐 `Dialog`、`Tabs`、`Table`、`Form Grid` 等 UI5 核心组件族。
2. 把 `analysis/ui5-style-system` 中的状态矩阵继续沉淀成组件级 token 和示例页。
3. 引入测试、发布流程和视觉回归基线。
