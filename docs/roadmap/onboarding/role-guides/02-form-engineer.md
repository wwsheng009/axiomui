# Form Engineer Guide

## 这个角色负责什么

Form 方向负责把“能输入”推进到“能在企业筛选和表单场景里稳定工作”。

主要范围包括：

- Input 族能力扩展
- Select、ComboBox、MultiInput、DatePicker 等高频控件
- valueState、helpText、counter 等字段状态统一
- FormGrid / FormField 集成
- FilterBar 场景接入

## 先看哪些文档

1. [../../02-api-conventions.md](../../02-api-conventions.md)
2. [../../05-demo-scenarios.md](../../05-demo-scenarios.md)
3. [../../backlog/sprint-2/README.md](../../backlog/sprint-2/README.md)
4. [../../backlog/sprint-3/README.md](../../backlog/sprint-3/README.md)

## 最常改的目录

- `packages/react/src/components/input/*`
- `packages/react/src/components/form-grid/*`
- `packages/react/src/components/filter-bar/*`
- `packages/react/src/components/*` 下的输入组件目录
- `apps/docs/src/*` 里的 form/worklist 相关 lab

## 适合作为第一批承接的任务

- Select
- ComboBox
- MultiInput
- DatePicker
- 字段状态统一
- form integration pass

## 这个角色的核心原则

- 先保证表单空间协作，再追更多视觉细节
- API 以字段语义为主，不要每个组件自己发明命名
- 输入控件必须能进 `FormGrid` 和 `FilterBar`
- 复杂输入不是孤立 demo，必须回到真实筛选场景里验证

## 最容易踩的坑

- 小宽度下控件把 grid 撑爆
- 只测 happy path，不测 keyboard path
- 只做单控件样例，不接 worklist/filter demo
- 不复用 overlay、locale、shared primitives，导致后续返工

## 验收时至少看什么

- 在 `compact/cozy` 下布局是否稳定
- `LTR/RTL` 是否影响标签、图标、文本截断
- locale 是否影响日期、时间和数字格式
- help text、value state、disabled/readOnly 是否统一

## 你最常协作的角色

- `Foundation Engineer`
- `Docs Engineer`
- `QA/Accessibility Engineer`
