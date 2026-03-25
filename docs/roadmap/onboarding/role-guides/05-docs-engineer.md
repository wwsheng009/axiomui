# Docs Engineer Guide

## 这个角色负责什么

Docs 方向负责把组件能力转成“可理解、可验证、可 walkthrough”的真实场景。

主要范围包括：

- docs lab 结构
- 组件与基础设施 demo 接线
- walkthrough 场景编排
- 验收入口与示例稳定性
- 避免所有示例长期堆在一个大入口文件里

## 先看哪些文档

1. [../../05-demo-scenarios.md](../../05-demo-scenarios.md)
2. [../../execution/weekly-execution-board.md](../../execution/weekly-execution-board.md)
3. [../04-demo-walkthrough-checklist.md](../04-demo-walkthrough-checklist.md)
4. [../../../CONTRIBUTING.md](../../../CONTRIBUTING.md)

## 最常改的目录

- `apps/docs/src/*`
- `docs/roadmap/*`
- `README.md`
- `CONTRIBUTING.md`

## 适合作为第一批承接的任务

- Theme Lab
- Form Lab
- Shell Lab
- Chart Lab
- walkthrough 脚本与 demo 收口

## 这个角色的核心原则

- docs 不是展示橱窗，而是项目的主要验收界面
- demo 必须贴近真实业务场景
- 新组件接进 docs 时要考虑主题、密度、方向和交互状态
- 尽早拆模块，避免所有人长期同时改同一个大文件

## 最容易踩的坑

- demo 只展示 happy path
- 组件上线后没有回到真实场景验证
- lab 结构不清楚，导致入口越来越难找
- 只补页面，不补 walkthrough 和文档入口

## 验收时至少看什么

- 从仓库根 README 是否能找到对应 demo 和文档
- 每个 lab 是否回答了明确问题，而不是堆组件
- 主题、density、RTL、locale 切换是否在 demo 中可见
- 关键 walkthrough 是否能按清单走通

## 你最常协作的角色

- `Foundation Engineer`
- `Form Engineer`
- `Shell Engineer`
- `Chart Engineer`
- `QA/Accessibility Engineer`
