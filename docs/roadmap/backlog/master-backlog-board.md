# Master Backlog Board

这份总表用于把 `Sprint 1-5` 的 backlog 草稿汇总成一个可以排期、分派和跟踪状态的总控板。

## 状态约定

- `Backlog`
- `Ready`
- `In Progress`
- `Review`
- `QA`
- `Done`

默认初始状态均为 `Backlog`。

## Owner 约定

- `Foundation`
- `Form`
- `Overlay`
- `Shell`
- `Chart`
- `Docs`
- `QA`
- `Tech Lead`

## Epic 总览

| Epic | 对应 Sprint | 目标 | 默认 Owner | 当前状态 | 入口 |
| --- | --- | --- | --- | --- | --- |
| Foundation | Sprint 1 | 建立主题、图标、国际化和 overlay 底座 | Foundation | Backlog | [Sprint 1](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/README.md) |
| Form Core | Sprint 2 | 交付第一批高频输入控件和 Popover | Form | Backlog | [Sprint 2](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/README.md) |
| Advanced Filters | Sprint 3 | 交付复杂筛选、消息反馈和自适应弹层 | Form / Overlay | Backlog | [Sprint 3](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/README.md) |
| Shell And Object Page | Sprint 4 | 交付工作台壳层、多列布局和对象页框架 | Shell | Backlog | [Sprint 4](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/README.md) |
| MicroChart | Sprint 5 | 交付第一批微图表、KPI Card 和图形 demo | Chart | Backlog | [Sprint 5](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/README.md) |

## Sprint 1 Board

| ID | Task | Epic | Owner | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S1-EPIC | Foundation sprint epic | Foundation | Tech Lead | Backlog | None | [00-sprint-1-epic.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/00-sprint-1-epic.md) |
| S1-01 | ThemeProvider and theme context | Foundation | Foundation | Backlog | None | [01-theme-provider-and-theme-context.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/01-theme-provider-and-theme-context.md) |
| S1-02 | Token layering and theme files | Foundation | Foundation | Backlog | S1-01 | [02-token-layering-and-theme-files.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/02-token-layering-and-theme-files.md) |
| S1-03 | Component token cleanup | Foundation | Foundation | Backlog | S1-02 | [03-component-token-cleanup.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/03-component-token-cleanup.md) |
| S1-04 | Theme Lab and docs shell | Foundation | Docs | Backlog | S1-01, S1-02, S1-06 | [04-theme-lab-and-docs-shell.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/04-theme-lab-and-docs-shell.md) |
| S1-05 | Icon registry v1 | Foundation | Foundation | Backlog | None | [05-icon-registry-v1.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/05-icon-registry-v1.md) |
| S1-06 | Locale provider and formatters | Foundation | Foundation | Backlog | S1-01 | [06-locale-provider-and-formatters.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/06-locale-provider-and-formatters.md) |
| S1-07 | Overlay foundation | Foundation | Foundation | Backlog | None | [07-overlay-foundation.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/07-overlay-foundation.md) |
| S1-08 | Dialog overlay migration | Foundation | Overlay | Backlog | S1-07 | [08-dialog-overlay-migration.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/08-dialog-overlay-migration.md) |
| S1-09 | Foundation smoke tests | Foundation | QA | Backlog | S1-01, S1-05, S1-06, S1-08 | [09-foundation-smoke-tests.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/09-foundation-smoke-tests.md) |
| S1-10 | Foundation exports and usage docs | Foundation | Docs | Backlog | S1-01, S1-05, S1-06, S1-07 | [10-foundation-exports-and-usage-docs.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-1/10-foundation-exports-and-usage-docs.md) |

## Sprint 2 Board

| ID | Task | Epic | Owner | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S2-EPIC | Form Core sprint epic | Form Core | Tech Lead | Backlog | S1 foundation exit | [00-sprint-2-epic.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/00-sprint-2-epic.md) |
| S2-01 | Shared field primitives | Form Core | Form | Backlog | S1 foundation exit | [01-shared-field-primitives.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/01-shared-field-primitives.md) |
| S2-02 | Popover | Form Core | Overlay | Backlog | S1-07 | [02-popover.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/02-popover.md) |
| S2-03 | Select | Form Core | Form | Backlog | S2-01, S2-02 | [03-select.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/03-select.md) |
| S2-04 | ComboBox | Form Core | Form | Backlog | S2-01, S2-02 | [04-combo-box.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/04-combo-box.md) |
| S2-05 | MultiInput | Form Core | Form | Backlog | S2-01, S1-05 | [05-multi-input.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/05-multi-input.md) |
| S2-06 | Calendar panel primitive | Form Core | Form | Backlog | S1-06, S2-02 | [06-calendar-panel-primitive.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/06-calendar-panel-primitive.md) |
| S2-07 | DatePicker | Form Core | Form | Backlog | S2-02, S2-06 | [07-date-picker.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/07-date-picker.md) |
| S2-08 | Form integration pass | Form Core | Form | Backlog | S2-03, S2-04, S2-05, S2-07 | [08-form-integration-pass.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/08-form-integration-pass.md) |
| S2-09 | Form Lab and worklist demo | Form Core | Docs | Backlog | S2-03, S2-04, S2-05, S2-07 | [09-form-lab-and-worklist-demo.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/09-form-lab-and-worklist-demo.md) |
| S2-10 | A11y and smoke tests | Form Core | QA | Backlog | S2-02, S2-03, S2-04, S2-05, S2-07 | [10-a11y-and-smoke-tests.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-2/10-a11y-and-smoke-tests.md) |

## Sprint 3 Board

| ID | Task | Epic | Owner | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S3-EPIC | Advanced Filters sprint epic | Advanced Filters | Tech Lead | Backlog | S2 form core exit | [00-sprint-3-epic.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/00-sprint-3-epic.md) |
| S3-01 | MultiComboBox | Advanced Filters | Form | Backlog | S2 ComboBox, S2 MultiInput, S2 Popover | [01-multi-combo-box.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/01-multi-combo-box.md) |
| S3-02 | DateRangePicker | Advanced Filters | Form | Backlog | S2 DatePicker, S2 Calendar panel | [02-date-range-picker.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/02-date-range-picker.md) |
| S3-03 | TimePicker | Advanced Filters | Form | Backlog | S1 LocaleProvider, S2 Popover | [03-time-picker.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/03-time-picker.md) |
| S3-04 | ResponsivePopover | Advanced Filters | Overlay | Backlog | S2 Popover, S1 overlay foundation | [04-responsive-popover.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/04-responsive-popover.md) |
| S3-05 | Menu | Advanced Filters | Overlay | Backlog | S1 IconRegistry, S3-04 | [05-menu.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/05-menu.md) |
| S3-06 | MessagePopover | Advanced Filters | Overlay | Backlog | S3-04 | [06-message-popover.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/06-message-popover.md) |
| S3-07 | FilterBar advanced integration | Advanced Filters | Form | Backlog | S3-01, S3-02, S3-03 | [07-filter-bar-advanced-integration.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/07-filter-bar-advanced-integration.md) |
| S3-08 | Advanced filter worklist demo | Advanced Filters | Docs | Backlog | S3-01, S3-02, S3-03, S3-06, S3-07 | [08-advanced-filter-worklist-demo.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/08-advanced-filter-worklist-demo.md) |
| S3-09 | State and help text unification | Advanced Filters | Form | Backlog | S3-01, S3-02, S3-03 | [09-state-and-help-text-unification.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/09-state-and-help-text-unification.md) |
| S3-10 | A11y and regression tests | Advanced Filters | QA | Backlog | S3-01, S3-02, S3-03, S3-04, S3-05, S3-06 | [10-a11y-and-regression-tests.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-3/10-a11y-and-regression-tests.md) |

## Sprint 4 Board

| ID | Task | Epic | Owner | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S4-EPIC | Shell and Object Page sprint epic | Shell And Object Page | Tech Lead | Backlog | S3 advanced filters exit | [00-sprint-4-epic.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/00-sprint-4-epic.md) |
| S4-01 | NavigationList | Shell And Object Page | Shell | Backlog | S1 theme/icon foundation | [01-navigation-list.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/01-navigation-list.md) |
| S4-02 | SideNavigation | Shell And Object Page | Shell | Backlog | S4-01 | [02-side-navigation.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/02-side-navigation.md) |
| S4-03 | ToolPage | Shell And Object Page | Shell | Backlog | S4-02, existing ToolHeader | [03-tool-page.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/03-tool-page.md) |
| S4-04 | FlexibleColumnLayout | Shell And Object Page | Shell | Backlog | S1 theme foundation, existing SplitLayout | [04-flexible-column-layout.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/04-flexible-column-layout.md) |
| S4-05 | Breadcrumbs | Shell And Object Page | Shell | Backlog | S1 IconRegistry | [05-breadcrumbs.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/05-breadcrumbs.md) |
| S4-06 | Avatar | Shell And Object Page | Shell | Backlog | S1 theme foundation | [06-avatar.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/06-avatar.md) |
| S4-07 | ObjectStatus and ObjectIdentifier | Shell And Object Page | Shell | Backlog | S1 IconRegistry, S1 theme foundation | [07-object-status-and-object-identifier.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/07-object-status-and-object-identifier.md) |
| S4-08 | ObjectPageHeader | Shell And Object Page | Shell | Backlog | S4-05, S4-06, S4-07 | [08-object-page-header.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/08-object-page-header.md) |
| S4-09 | ObjectPageLayout | Shell And Object Page | Shell | Backlog | S4-08, existing DynamicPage/ObjectPageNav | [09-object-page-layout.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/09-object-page-layout.md) |
| S4-10 | Shell Lab and Object Page demo | Shell And Object Page | Docs | Backlog | S4-01, S4-02, S4-03, S4-04, S4-08, S4-09 | [10-shell-lab-and-object-page-demo.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/10-shell-lab-and-object-page-demo.md) |
| S4-11 | A11y and regression tests | Shell And Object Page | QA | Backlog | S4-01, S4-02, S4-03, S4-04, S4-08, S4-09 | [11-a11y-and-regression-tests.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-4/11-a11y-and-regression-tests.md) |

## Sprint 5 Board

| ID | Task | Epic | Owner | Status | Main Dependency | Draft |
| --- | --- | --- | --- | --- | --- | --- |
| S5-EPIC | MicroChart sprint epic | MicroChart | Tech Lead | Backlog | S4 shell exit | [00-sprint-5-epic.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/00-sprint-5-epic.md) |
| S5-01 | Chart primitives and tokens | MicroChart | Chart Foundation | Backlog | S1 theme foundation | [01-chart-primitives-and-tokens.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/01-chart-primitives-and-tokens.md) |
| S5-02 | BulletMicroChart | MicroChart | Chart | Backlog | S5-01 | [02-bullet-microchart.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/02-bullet-microchart.md) |
| S5-03 | RadialMicroChart | MicroChart | Chart | Backlog | S5-01 | [03-radial-microchart.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/03-radial-microchart.md) |
| S5-04 | Delta and HarveyBall | MicroChart | Chart | Backlog | S5-01 | [04-delta-and-harvey-ball.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/04-delta-and-harvey-ball.md) |
| S5-05 | StackedBarMicroChart | MicroChart | Chart | Backlog | S5-01 | [05-stacked-bar-microchart.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/05-stacked-bar-microchart.md) |
| S5-06 | InteractiveDonutChart | MicroChart | Chart | Backlog | S5-01 | [06-interactive-donut-chart.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/06-interactive-donut-chart.md) |
| S5-07 | InteractiveLineChart | MicroChart | Chart | Backlog | S5-01 | [07-interactive-line-chart.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/07-interactive-line-chart.md) |
| S5-08 | KPI Card composition | MicroChart | Chart | Backlog | S5-02, S5-03, S5-04, S5-05 | [08-kpi-card-composition.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/08-kpi-card-composition.md) |
| S5-09 | Chart Lab and business demos | MicroChart | Docs | Backlog | S5-02, S5-03, S5-04, S5-05, S5-06, S5-07, S5-08 | [09-chart-lab-and-business-demos.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/09-chart-lab-and-business-demos.md) |
| S5-10 | A11y, performance, and regression tests | MicroChart | QA | Backlog | S5-02, S5-03, S5-04, S5-05, S5-06, S5-07, S5-08 | [10-a11y-performance-and-regression-tests.md](/E:/projects/axiomui/docs/roadmap/backlog/sprint-5/10-a11y-performance-and-regression-tests.md) |

## 建议标签

- `epic:foundation`
- `epic:forms`
- `epic:overlay`
- `epic:shell`
- `epic:charts`
- `area:docs`
- `area:test`
- `priority:p0`
- `priority:p1`
- `priority:p2`

## 使用建议

1. 先从本表确认 `Owner` 和 `Main Dependency`。
2. 再进入对应 sprint 的 draft 文件复制 issue 内容。
3. 将状态列从 `Backlog` 推进到 `Ready` 后再正式开始开发。
4. 每周同步时只更新这一页，就能快速看清关键阻塞和当前推进面。
