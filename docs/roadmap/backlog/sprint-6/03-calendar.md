# S6-03 Calendar

## Type

- Component Task

## Summary

在现有 `CalendarPanel`、`DatePicker` 和 `DateRangePicker` 的日期基础上补齐独立 `Calendar` 组件，支撑页面内嵌的日期浏览、选择和标注场景。

## Goal

- 提供可独立嵌入页面的 Calendar
- 为后续 PlanningCalendar 提供更稳定的日期基础
- 避免 `CalendarPanel`、`DateRangePicker` 和未来 `PlanningCalendar` 各自维护不同的日期状态机

## Scope

- In scope:
  - month view
  - single or multiple or range selection
  - disabled dates
  - special dates
  - locale and RTL navigation
- Out of scope:
  - 资源排程视图
  - recurrence engine
  - event drag and drop
  - 小时/天资源栅格

## Current Snapshot

- 截至 `2026-03-27`，React 包里还没有独立导出的 `Calendar` 组件；当前只有 `CalendarPanel`，并被 `DatePicker` 直接复用。
- 现有 `CalendarPanel` 已具备月视图、单值选择、最小/最大日期限制、locale 周起始日和键盘网格导航。
- `DateRangePicker` 已经在 `date-utils` 之上额外实现了双月视图、范围选择和更复杂的焦点流转，这意味着 `S6-03` 不应再造第三套日期状态逻辑，而应优先抽共享层。

## Current Codebase Context

- [packages/react/src/components/calendar-panel/calendar-panel.tsx](/E:/projects/axiomui/packages/react/src/components/calendar-panel/calendar-panel.tsx) 当前是单值、单月、面板式日历壳层，适合弹层场景，但不适合作为独立页面内嵌 Calendar 的最终形态。
- [packages/react/src/components/calendar-panel/date-utils.ts](/E:/projects/axiomui/packages/react/src/components/calendar-panel/date-utils.ts) 已经提供 `parse / format / add month / build weeks / week start / disabled date` 等日期底座，`S6-03` 应优先复用并在这里补齐缺失 helper，而不是在新目录重写日期计算。
- [packages/react/src/components/calendar-panel/date-copy.ts](/E:/projects/axiomui/packages/react/src/components/calendar-panel/date-copy.ts) 已集中维护 prev/next month 与范围选择相关 copy；若 `Calendar` 需要新增 aria 或特殊日期文案，应继续沿用集中 helper，而不是把 copy 散落到组件 JSX。
- [packages/react/src/components/date-picker/date-picker.tsx](/E:/projects/axiomui/packages/react/src/components/date-picker/date-picker.tsx) 当前直接嵌入 `CalendarPanel`；[packages/react/src/components/date-range-picker/date-range-picker.tsx](/E:/projects/axiomui/packages/react/src/components/date-range-picker/date-range-picker.tsx) 则直接复用 `date-utils` 并维护更复杂的范围状态。
- 当前 docs 只有 `DatePicker` / `DateRangePicker` 场景，还没有独立 `Calendar` 展示位，因此 `S6-03` 首先要冻结组件 contract，再考虑 `Workflow Lab` 的页面接入。

## Planned File Areas

- `packages/react/src/components/calendar/*`
- `packages/react/src/components/calendar-panel/*`
- `packages/react/src/styles/index.css`
- `packages/react/src/index.ts`

## 推荐文件清单

建议把 `S6-03` 先拆成下面这组文件或职责层：

- `packages/react/src/components/calendar/calendar-types.ts`
  定义 `CalendarSelectionMode`、`CalendarSpecialDate`、`CalendarValue`、`CalendarRangeValue` 等独立 Calendar contract，明确 `single / multiple / range` 三种模式的数据面。
- `packages/react/src/components/calendar/calendar-state.ts`
  抽取选择模式归一化、focused date、visible month、range anchor、special date lookup 等轻量状态 helper，避免把这些逻辑散进 `calendar.tsx`。
- `packages/react/src/components/calendar/calendar.tsx`
  独立 Calendar 主组件，负责 header、month grid、selection mode、disabled/special date 语义和事件回调。
- `packages/react/src/components/calendar/calendar.css`
  独立 Calendar 的页面内嵌样式，不直接复用 `CalendarPanel` 的弹层壳层视觉。
- `packages/react/src/components/calendar/calendar.test.tsx`
  覆盖键盘导航、选择模式、locale/RTL、disabled/special date 和 visible month 变更。
- `packages/react/src/components/calendar-panel/date-utils.ts`
  继续作为共享日期计算基础；若 `Calendar` 需要多选或范围辅助函数，应优先在这里补齐通用 helper。
- `packages/react/src/components/calendar-panel/date-copy.ts`
  若需要新增月标题、选择摘要或特殊日期 aria copy，应继续集中在这一层，避免组件内部散落字符串。
- `packages/react/src/index.ts`
  暴露 `Calendar` 及其类型导出。
- `packages/react/src/styles/index.css`
  注册 `calendar.css`，并将 `.ax-calendar` 纳入根类名列表。

## 文件级实施顺序

1. 先冻结 `Calendar` 的值模型和 API。
   先在 `calendar-types.ts` 里定清 `single / multiple / range` 三种模式的输入输出，以及 `specialDates`、`minDate`、`maxDate`、`visibleMonth`、`onVisibleMonthChange` 这组 contract，避免 `PlanningCalendar` 或 docs demo 后面倒逼改接口。
2. 再抽共享状态层。
   把 `DateRangePicker` 和 `CalendarPanel` 里已经存在的 focused date、visible month、range anchor、选中判断等逻辑收敛到 `calendar-state.ts` 和 `date-utils.ts`，避免出现第三套月份导航与范围选择实现。
3. 再实现独立 `Calendar` 视图层。
   `calendar.tsx` 负责页面内嵌壳层、标题导航、grid、weekday header、特殊日期标记和选择事件，但不要把它做成资源排期表或 PlanningCalendar 的 event board。
4. 再补 `special dates` 与可访问语义。
   特殊日期不仅要有视觉标记，还要提供可读 label 或 aria 描述；disabled date、today、selected date、range boundary 这些状态也要形成稳定语义。
5. 最后做导出、样式和回归验证。
   在 `Calendar` API 稳定后再接 `index.ts`、`styles/index.css`，并回归 `DatePicker` / `DateRangePicker` 测试，确保共享日期底座调整没有引入回归。

## 对 S6-04 的明确交接边界

`S6-03` 完成后，`S6-04 PlanningCalendar` 应直接复用以下能力：

- locale-aware month/week/day 计算与 weekday labels
- visible month 导航与焦点流转规则
- `single / multiple / range` 之外的基础日期选中语义
- disabled/special date 的统一表达方式

`S6-04` 不应再重复定义：

- 日期网格生成
- 周起始日与 locale 规则
- 基础键盘导航
- today / selected / disabled / special date 的基础语义

反过来，`S6-03` 也不应过早吸收：

- 资源行、人员行或任务行
- 时间轴、小时粒度或拖拽排期
- 业务事件卡片布局

## Docs Impact

- `Workflow Lab` 需要展示页面内嵌 Calendar、特殊日期标注、禁用日期和范围选择场景。
- `S6-03` 本身不必提前把完整 Planning demo 塞进 docs 根应用；优先保证 `Calendar` 作为独立组件可验证、可复用。

## Testing

- `calendar.test.tsx`
  覆盖键盘网格导航、月份切换、locale/RTL、单选/多选/范围选择、disabled dates、special dates。
- 回归 [date-picker.test.tsx](/E:/projects/axiomui/packages/react/src/components/date-picker/date-picker.test.tsx)
  确认共享日期 helper 调整后，DatePicker 的打开、选择和本地化行为不回退。
- 回归 `date-range-picker.test.tsx`
  确认范围选择、双月视图和键盘导航不因共享层抽取而破坏。

## Verification Plan

- `pnpm --filter @axiomui/react typecheck`
- `pnpm --filter @axiomui/react test -- src/components/calendar/calendar.test.tsx src/components/date-picker/date-picker.test.tsx src/components/date-range-picker/date-range-picker.test.tsx`
- 检查 [packages/react/src/index.ts](/E:/projects/axiomui/packages/react/src/index.ts) 是否已导出 `Calendar`
- 检查 [packages/react/src/styles/index.css](/E:/projects/axiomui/packages/react/src/styles/index.css) 是否已注册 `calendar.css`

## Acceptance Criteria

- [ ] Calendar 可独立渲染并复用现有日期基础
- [ ] `single / multiple / range` 三种选择模式的 contract 清晰且稳定
- [ ] locale 和 RTL 下导航稳定
- [ ] 特殊日期与禁用日期语义清晰
- [ ] `PlanningCalendar` 可以在不重写日期底座的前提下直接复用

## Dependencies

- S1-06
- S2-06

## Suggested Owner

- Form
