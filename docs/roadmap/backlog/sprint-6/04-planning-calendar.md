# S6-04 PlanningCalendar

## Type

- Component Task

## Summary

实现 `PlanningCalendar`，把 `Calendar` 的日期基础提升为面向团队排班、会议安排和资源占用的 row-based 规划视图。

## Goal

- 覆盖团队排班、会议安排、资源占用等场景
- 明确与基础 Calendar 的定位边界
- 复用 shell 组件的页面组织能力，而不是把页面壳层和排期内容耦合在一起

## Scope

- In scope:
  - row based planning view
  - appointments
  - interval switching
  - row headers
  - active item or selection contract
  - visible date range navigation
- Out of scope:
  - recurrence engine
  - appointment drag resize
  - 真实排期算法
  - 后端同步与冲突解决
  - page shell / side rail / workbench 路由编排

## Current Snapshot

- 截至 `2026-03-27`，React 包中还没有独立的 `PlanningCalendar` 组件，也没有 `packages/react/src/components/planning-calendar` 目录。
- 当前可复用的日期底座仍是 `CalendarPanel`、`date-utils.ts`、`DatePicker`、`DateRangePicker`；可复用的页面组织层则是 `ToolPage`、`FlexibleColumnLayout`、`ObjectPageLayout` 和 `PageSection`。
- 这意味着 `S6-04` 不应在一个任务里同时重新发明 shell 布局和日期状态机。正确路径是依赖 `S6-03 Calendar` 提供日期 contract，再在此之上实现 row/appointment 视图。

## Current Codebase Context

- [packages/react/src/components/flexible-column-layout/flexible-column-layout.tsx](/E:/projects/axiomui/packages/react/src/components/flexible-column-layout/flexible-column-layout.tsx) 已经提供多列工作流布局状态与移动端退化能力，但它解决的是页面分栏，不是日期或 appointment 排布。
- [packages/react/src/components/tool-page/tool-page.tsx](/E:/projects/axiomui/packages/react/src/components/tool-page/tool-page.tsx) 适合承载长期运行的工作台壳层，因此 `PlanningCalendar` 应保持为内容组件，让业务页面自行决定是否嵌入 `ToolPage`。
- [packages/react/src/components/object-page-layout/object-page-layout.tsx](/E:/projects/axiomui/packages/react/src/components/object-page-layout/object-page-layout.tsx) 展示了 section/anchor/side content 的组织方式，可作为 planning 详情页的页面级编排参考，但不应被塞进 `PlanningCalendar` 本体。
- [packages/react/src/components/page-section/page-section.tsx](/E:/projects/axiomui/packages/react/src/components/page-section/page-section.tsx) 说明 docs 侧当前偏好“组件 primitive + demo section”模式，`S6-04` 应延续这种边界，而不是让组件本身承担 docs 壳层职责。
- [packages/react/src/components/calendar-panel/date-utils.ts](/E:/projects/axiomui/packages/react/src/components/calendar-panel/date-utils.ts) 已具备日期运算底座；`S6-04` 应在 `S6-03 Calendar` 落地后复用其 visible range、weekday labels 和基础导航规则，而不是在 planning 目录再维护第四套日期计算实现。

## Planned File Areas

- `packages/react/src/components/planning-calendar/*`
- `packages/react/src/components/calendar/*`
- `packages/react/src/styles/index.css`
- `packages/react/src/index.ts`

## 推荐文件清单

建议把 `S6-04` 控制在下面这组文件和职责边界内：

- `packages/react/src/components/planning-calendar/planning-calendar-types.ts`
  定义 `PlanningCalendarView`、`PlanningCalendarRow`、`PlanningCalendarAppointment`、`PlanningCalendarSelection` 等 planning 域 contract，明确 row、appointment、活动项和视图切换的数据面。
- `packages/react/src/components/planning-calendar/planning-calendar-layout.ts`
  负责 visible interval、row 内 appointment segment、overlap lane 和当前区间位置等纯计算逻辑，避免把布局算法散进 JSX。
- `packages/react/src/components/planning-calendar/planning-calendar-appointment.tsx`
  负责单个 appointment 的按钮语义、状态 tone、选中态和 aria label。
- `packages/react/src/components/planning-calendar/planning-calendar-row.tsx`
  负责 row header、row metadata、appointment lane 容器和空态渲染。
- `packages/react/src/components/planning-calendar/planning-calendar.tsx`
  主组件，负责 header、view switch、visible date range 导航、row 列表和 active item 编排。
- `packages/react/src/components/planning-calendar/planning-calendar.css`
  row header、time axis、appointment block、sticky header 和紧凑模式样式。
- `packages/react/src/components/planning-calendar/planning-calendar.test.tsx`
  覆盖 row/appointment 焦点、view switch、visible range 导航、窄屏退化和 active appointment。
- `packages/react/src/components/calendar/*`
  仅在 `S6-03` contract 不足时做最小共享扩展，例如 visible range 或 weekday helper；不应把 planning 特有 row/appointment 逻辑回灌到 `Calendar`。
- `packages/react/src/index.ts`
  暴露 `PlanningCalendar` 及其类型导出。
- `packages/react/src/styles/index.css`
  注册 `planning-calendar.css`，并将 `.ax-planning-calendar` 纳入根类名列表。

## 文件级实施顺序

1. 先冻结 planning 域数据 contract。
   在 `planning-calendar-types.ts` 里先定清 row、appointment、view、selection 和回调签名，尤其要明确“active appointment”和“row selection”是不是两个独立概念，避免后续 demo 和业务接入不断倒逼重写。
2. 再抽 interval 与布局计算层。
   在 `planning-calendar-layout.ts` 中集中处理 visible range、time slots、appointment span 百分比、overlap lane 和空白槽位判断，确保布局算法可测试，而不是夹在组件渲染里。
3. 再实现最小 appointment primitive。
   `planning-calendar-appointment.tsx` 只负责单个 appointment 的视觉和可访问语义，包括 title、time label、status tone、selected/active 态，不在这里承担 row 管理。
4. 再实现 row shell。
   `planning-calendar-row.tsx` 负责 row header、secondary meta、appointment lane 与空态，让后续 team/member/resource 三类行都能共用同一容器层。
5. 最后实现主容器与 shell 协作边界。
   `planning-calendar.tsx` 负责 view switch、visible date range 导航和 row 列表编排，但不要把 `ToolPage`、`FlexibleColumnLayout` 或 `ObjectPageLayout` 直接内建进组件本体。

## 对 Shell 与 Calendar 的明确交接边界

`S6-04` 应直接复用 `S6-03 Calendar` 提供的以下基础：

- visible date range 与日期导航规则
- locale-aware weekday labels
- 当前日期、禁用日期、特殊日期的基础语义
- 共享日期 copy/helper

`S6-04` 自己新增的范围应限定在：

- row + appointment 的展示 contract
- planning view 的 interval 切换
- appointment focus / active item 语义
- planning-specific layout 计算

`S6-04` 不应再重复定义：

- `Calendar` 的基础 month/week grid 逻辑
- `ToolPage` 的 header/side/content 页面壳层
- `FlexibleColumnLayout` 的列显隐与移动端列切换状态
- `ObjectPageLayout` 的 section anchor 同步逻辑

## Docs Impact

- `Workflow Lab` 需要有 `team planning board` 场景，至少展示 row headers、appointment blocks、当前日期范围导航和活动项详情。
- `S6-04` 本身不必提前实现完整工作台路由或多列详情页；优先保证 `PlanningCalendar` 作为内容组件可以被 `ToolPage` 或 `PageSection` 安全包裹。

## Testing

- `planning-calendar.test.tsx`
  覆盖 row/appointment 焦点、visible range 导航、view switch、active appointment、窄屏与宽屏布局退化。
- 回归 `calendar.test.tsx`
  确认若 `PlanningCalendar` 需要扩展共享日期 helper，不会破坏 `Calendar` 的基础日期语义。
- 若 planning 布局依赖 shell demo 进行集成验证，至少补一组轻量 smoke，确认它作为 `ToolPage` 内容区挂载时不会破坏滚动和溢出边界。

## Verification Plan

- `pnpm --filter @axiomui/react typecheck`
- `pnpm --filter @axiomui/react test -- src/components/planning-calendar/planning-calendar.test.tsx src/components/calendar/calendar.test.tsx`
- 检查 [packages/react/src/index.ts](/E:/projects/axiomui/packages/react/src/index.ts) 是否已导出 `PlanningCalendar`
- 检查 [packages/react/src/styles/index.css](/E:/projects/axiomui/packages/react/src/styles/index.css) 是否已注册 `planning-calendar.css`

## Acceptance Criteria

- [ ] 可承载多行计划视图和 appointment 数据
- [ ] 与 Calendar 的职责边界清晰
- [ ] 与 `ToolPage` / `FlexibleColumnLayout` / `ObjectPageLayout` 的职责边界清晰
- [ ] docs 可演示典型团队排期场景

## Dependencies

- S6-03
- S4 shell and page patterns

## Suggested Owner

- Shell
