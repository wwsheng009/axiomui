# Sprint 1 Epic

## Type

- Sprint Epic

## Goal

补齐主题、图标、国际化和 overlay 这四类底座能力，让 AxiomUI 后续新增控件时不再反复返工。

## Target Deliverables

- ThemeProvider 与主题注册表
- semantic token 分层与多主题覆盖
- IconRegistry 第一版
- LocaleProvider 与基础格式化工具
- overlay foundation
- Theme Lab 与 foundation smoke tests

## Planned Task Breakdown

- [ ] 01 ThemeProvider 与主题上下文
- [ ] 02 token 分层与主题文件拆分
- [ ] 03 现有组件 token 清扫
- [ ] 04 Theme Lab 与 docs 外壳拆分
- [ ] 05 IconRegistry 第一版
- [ ] 06 LocaleProvider 与格式化工具
- [ ] 07 overlay foundation
- [ ] 08 Dialog 接入 overlay 底座
- [ ] 09 foundation smoke tests
- [ ] 10 foundation 导出与使用文档

## Exit Criteria

- [ ] 至少 6 套主题可切换
- [ ] docs 可切 theme、density、dir、locale
- [ ] Dialog 已接入 overlay foundation
- [ ] foundation API 已经导出
- [ ] docs 有 Theme Lab
- [ ] 有最小 smoke tests

## Main Demo

- Theme Lab

## Main Risks

- token 命名不稳定
- overlay API 不足以支撑后续 Popover 和 DatePicker
- docs 入口仍然过于集中在单文件

## References

- [01-roadmap.md](../../01-roadmap.md)
- [04-sprint-checklists.md](../../04-sprint-checklists.md)
- [05-demo-scenarios.md](../../05-demo-scenarios.md)
