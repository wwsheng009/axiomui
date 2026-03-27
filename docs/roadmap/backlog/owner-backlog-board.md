# Owner Backlog Board

这份总表用于把 `Sprint 1-5` 的 backlog 草稿按 `owner` 重新组织，方便直接做团队分工、周会同步和容量评估。

当前状态已按 `2026-03-27` 的代码快照更新。判断依据来自实际组件导出、docs 示例页和已通过的 `pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm release:check`。

## Owner Summary

| Owner | Task Count | Main Focus |
| --- | --- | --- |
| Tech Lead | 5 | Sprint epic、依赖收口、里程碑推进 |
| Foundation | 6 | Theme、Icon、Locale、Overlay 底座 |
| Overlay | 5 | Dialog/Popover/ResponsivePopover/Menu/MessagePopover |
| Form | 12 | 字段基元、高频输入、复杂筛选集成 |
| Shell | 9 | 工作台壳层、多列布局、对象页结构 |
| Chart Foundation | 1 | 图形共享基元与 token |
| Chart | 7 | 各类 microchart 与 KPI Card |
| Docs | 6 | Labs、业务 demo、使用文档 |
| QA | 5 | Smoke、回归、a11y 和性能基线 |

## Tech Lead

| ID | Sprint | Title | Epic | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S1-EPIC | Sprint 1 | Foundation sprint epic | Foundation | Done | None | [S1 Epic](./sprint-1/00-sprint-1-epic.md) |
| S2-EPIC | Sprint 2 | Form Core sprint epic | Form Core | Done | S1 foundation exit | [S2 Epic](./sprint-2/00-sprint-2-epic.md) |
| S3-EPIC | Sprint 3 | Advanced Filters sprint epic | Advanced Filters | Done | S2 form core exit | [S3 Epic](./sprint-3/00-sprint-3-epic.md) |
| S4-EPIC | Sprint 4 | Shell and Object Page sprint epic | Shell And Object Page | Done | S3 advanced filters exit | [S4 Epic](./sprint-4/00-sprint-4-epic.md) |
| S5-EPIC | Sprint 5 | MicroChart sprint epic | MicroChart | Done | S4 shell exit | [S5 Epic](./sprint-5/00-sprint-5-epic.md) |

## Foundation

| ID | Sprint | Title | Epic | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S1-01 | Sprint 1 | ThemeProvider and theme context | Foundation | Done | None | [S1-01](./sprint-1/01-theme-provider-and-theme-context.md) |
| S1-02 | Sprint 1 | Token layering and theme files | Foundation | Done | S1-01 | [S1-02](./sprint-1/02-token-layering-and-theme-files.md) |
| S1-03 | Sprint 1 | Component token cleanup | Foundation | Done | S1-02 | [S1-03](./sprint-1/03-component-token-cleanup.md) |
| S1-05 | Sprint 1 | Icon registry v1 | Foundation | Done | None | [S1-05](./sprint-1/05-icon-registry-v1.md) |
| S1-06 | Sprint 1 | Locale provider and formatters | Foundation | Done | S1-01 | [S1-06](./sprint-1/06-locale-provider-and-formatters.md) |
| S1-07 | Sprint 1 | Overlay foundation | Foundation | Done | None | [S1-07](./sprint-1/07-overlay-foundation.md) |

## Overlay

| ID | Sprint | Title | Epic | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S1-08 | Sprint 1 | Dialog overlay migration | Foundation | Done | S1-07 | [S1-08](./sprint-1/08-dialog-overlay-migration.md) |
| S2-02 | Sprint 2 | Popover | Form Core | Done | S1-07 | [S2-02](./sprint-2/02-popover.md) |
| S3-04 | Sprint 3 | ResponsivePopover | Advanced Filters | Done | S2 Popover, S1 overlay foundation | [S3-04](./sprint-3/04-responsive-popover.md) |
| S3-05 | Sprint 3 | Menu | Advanced Filters | Done | S1 IconRegistry, S3-04 | [S3-05](./sprint-3/05-menu.md) |
| S3-06 | Sprint 3 | MessagePopover | Advanced Filters | Done | S3-04 | [S3-06](./sprint-3/06-message-popover.md) |

## Form

| ID | Sprint | Title | Epic | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S2-01 | Sprint 2 | Shared field primitives | Form Core | Done | S1 foundation exit | [S2-01](./sprint-2/01-shared-field-primitives.md) |
| S2-03 | Sprint 2 | Select | Form Core | Done | S2-01, S2-02 | [S2-03](./sprint-2/03-select.md) |
| S2-04 | Sprint 2 | ComboBox | Form Core | Done | S2-01, S2-02 | [S2-04](./sprint-2/04-combo-box.md) |
| S2-05 | Sprint 2 | MultiInput | Form Core | Done | S2-01, S1-05 | [S2-05](./sprint-2/05-multi-input.md) |
| S2-06 | Sprint 2 | Calendar panel primitive | Form Core | Done | S1-06, S2-02 | [S2-06](./sprint-2/06-calendar-panel-primitive.md) |
| S2-07 | Sprint 2 | DatePicker | Form Core | Done | S2-02, S2-06 | [S2-07](./sprint-2/07-date-picker.md) |
| S2-08 | Sprint 2 | Form integration pass | Form Core | Done | S2-03, S2-04, S2-05, S2-07 | [S2-08](./sprint-2/08-form-integration-pass.md) |
| S3-01 | Sprint 3 | MultiComboBox | Advanced Filters | Done | S2 ComboBox, S2 MultiInput, S2 Popover | [S3-01](./sprint-3/01-multi-combo-box.md) |
| S3-02 | Sprint 3 | DateRangePicker | Advanced Filters | Done | S2 DatePicker, S2 Calendar panel | [S3-02](./sprint-3/02-date-range-picker.md) |
| S3-03 | Sprint 3 | TimePicker | Advanced Filters | Done | S1 LocaleProvider, S2 Popover | [S3-03](./sprint-3/03-time-picker.md) |
| S3-07 | Sprint 3 | FilterBar advanced integration | Advanced Filters | Done | S3-01, S3-02, S3-03 | [S3-07](./sprint-3/07-filter-bar-advanced-integration.md) |
| S3-09 | Sprint 3 | State and help text unification | Advanced Filters | Done | S3-01, S3-02, S3-03 | [S3-09](./sprint-3/09-state-and-help-text-unification.md) |

## Shell

| ID | Sprint | Title | Epic | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S4-01 | Sprint 4 | NavigationList | Shell And Object Page | Done | S1 theme/icon foundation | [S4-01](./sprint-4/01-navigation-list.md) |
| S4-02 | Sprint 4 | SideNavigation | Shell And Object Page | Done | S4-01 | [S4-02](./sprint-4/02-side-navigation.md) |
| S4-03 | Sprint 4 | ToolPage | Shell And Object Page | Done | S4-02, existing ToolHeader | [S4-03](./sprint-4/03-tool-page.md) |
| S4-04 | Sprint 4 | FlexibleColumnLayout | Shell And Object Page | Done | S1 theme foundation, existing SplitLayout | [S4-04](./sprint-4/04-flexible-column-layout.md) |
| S4-05 | Sprint 4 | Breadcrumbs | Shell And Object Page | Done | S1 IconRegistry | [S4-05](./sprint-4/05-breadcrumbs.md) |
| S4-06 | Sprint 4 | Avatar | Shell And Object Page | Done | S1 theme foundation | [S4-06](./sprint-4/06-avatar.md) |
| S4-07 | Sprint 4 | ObjectStatus and ObjectIdentifier | Shell And Object Page | Done | S1 IconRegistry, S1 theme foundation | [S4-07](./sprint-4/07-object-status-and-object-identifier.md) |
| S4-08 | Sprint 4 | ObjectPageHeader | Shell And Object Page | Done | S4-05, S4-06, S4-07 | [S4-08](./sprint-4/08-object-page-header.md) |
| S4-09 | Sprint 4 | ObjectPageLayout | Shell And Object Page | Done | S4-08, existing DynamicPage/ObjectPageNav | [S4-09](./sprint-4/09-object-page-layout.md) |

## Chart Foundation

| ID | Sprint | Title | Epic | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S5-01 | Sprint 5 | Chart primitives and tokens | MicroChart | Done | S1 theme foundation | [S5-01](./sprint-5/01-chart-primitives-and-tokens.md) |

## Chart

| ID | Sprint | Title | Epic | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S5-02 | Sprint 5 | BulletMicroChart | MicroChart | Done | S5-01 | [S5-02](./sprint-5/02-bullet-microchart.md) |
| S5-03 | Sprint 5 | RadialMicroChart | MicroChart | Done | S5-01 | [S5-03](./sprint-5/03-radial-microchart.md) |
| S5-04 | Sprint 5 | Delta and HarveyBall | MicroChart | Done | S5-01 | [S5-04](./sprint-5/04-delta-and-harvey-ball.md) |
| S5-05 | Sprint 5 | StackedBarMicroChart | MicroChart | Done | S5-01 | [S5-05](./sprint-5/05-stacked-bar-microchart.md) |
| S5-06 | Sprint 5 | InteractiveDonutChart | MicroChart | Done | S5-01 | [S5-06](./sprint-5/06-interactive-donut-chart.md) |
| S5-07 | Sprint 5 | InteractiveLineChart | MicroChart | Done | S5-01 | [S5-07](./sprint-5/07-interactive-line-chart.md) |
| S5-08 | Sprint 5 | KPI Card composition | MicroChart | Done | S5-02, S5-03, S5-04, S5-05 | [S5-08](./sprint-5/08-kpi-card-composition.md) |

## Docs

| ID | Sprint | Title | Epic | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S1-04 | Sprint 1 | Theme Lab and docs shell | Foundation | Done | S1-01, S1-02, S1-06 | [S1-04](./sprint-1/04-theme-lab-and-docs-shell.md) |
| S1-10 | Sprint 1 | Foundation exports and usage docs | Foundation | Done | S1-01, S1-05, S1-06, S1-07 | [S1-10](./sprint-1/10-foundation-exports-and-usage-docs.md) |
| S2-09 | Sprint 2 | Form Lab and worklist demo | Form Core | Done | S2-03, S2-04, S2-05, S2-07 | [S2-09](./sprint-2/09-form-lab-and-worklist-demo.md) |
| S3-08 | Sprint 3 | Advanced filter worklist demo | Advanced Filters | Done | S3-01, S3-02, S3-03, S3-06, S3-07 | [S3-08](./sprint-3/08-advanced-filter-worklist-demo.md) |
| S4-10 | Sprint 4 | Shell Lab and Object Page demo | Shell And Object Page | Done | S4-01, S4-02, S4-03, S4-04, S4-08, S4-09 | [S4-10](./sprint-4/10-shell-lab-and-object-page-demo.md) |
| S5-09 | Sprint 5 | Chart Lab and business demos | MicroChart | Done | S5-02, S5-03, S5-04, S5-05, S5-06, S5-07, S5-08 | [S5-09](./sprint-5/09-chart-lab-and-business-demos.md) |

## QA

| ID | Sprint | Title | Epic | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S1-09 | Sprint 1 | Foundation smoke tests | Foundation | Done | S1-01, S1-05, S1-06, S1-08 | [S1-09](./sprint-1/09-foundation-smoke-tests.md) |
| S2-10 | Sprint 2 | A11y and smoke tests | Form Core | Done | S2-02, S2-03, S2-04, S2-05, S2-07 | [S2-10](./sprint-2/10-a11y-and-smoke-tests.md) |
| S3-10 | Sprint 3 | A11y and regression tests | Advanced Filters | Done | S3-01, S3-02, S3-03, S3-04, S3-05, S3-06 | [S3-10](./sprint-3/10-a11y-and-regression-tests.md) |
| S4-11 | Sprint 4 | A11y and regression tests | Shell And Object Page | Done | S4-01, S4-02, S4-03, S4-04, S4-08, S4-09 | [S4-11](./sprint-4/11-a11y-and-regression-tests.md) |
| S5-10 | Sprint 5 | A11y, performance, and regression tests | MicroChart | Done | S5-02, S5-03, S5-04, S5-05, S5-06, S5-07, S5-08 | [S5-10](./sprint-5/10-a11y-performance-and-regression-tests.md) |

## 使用建议

1. 做分工会时优先看这一页，而不是按 sprint 拆开看。
2. 若某个 owner 任务过重，可从这里直接做二次拆分或重新分派。
3. 若某个 owner 的任务被依赖项阻塞，可回跳到 [master-backlog-board.md](./master-backlog-board.md) 查看完整依赖关系。
