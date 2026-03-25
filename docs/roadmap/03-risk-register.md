# 03 Risk Register

| ID | 风险 | 概率 | 影响 | 预警信号 | 缓解措施 | 建议 Owner |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | 主题体系过早绑定单一 Horizon 风格，后续 dark/high-contrast 返工 | 高 | 高 | 组件 CSS 中持续出现硬编码色值 | 先完成 semantic tokens 与主题覆盖层，再扩控件 | Foundation |
| R2 | overlay foundation 设计不稳，导致 Popover/DatePicker/Menu 全线返工 | 中 | 高 | 每个弹层组件都在重复造 portal、dismiss、focus 逻辑 | 先让 Dialog 成为 overlay 试金石，再扩展其他弹层 | Foundation |
| R3 | docs 长期堆在一个 `app.tsx`，多人并行冲突严重 | 高 | 高 | 同一文件频繁冲突、review 成本过高 | 早拆 `theme-lab`、`form-lab`、`shell-lab`、`chart-lab` | Docs |
| R4 | 组件 API 风格漂移，`onChange/onValueChange` 等不统一 | 高 | 中 | 同类组件 props 命名开始出现多套风格 | 冻结 API conventions，并在 review 中强制执行 | Tech Lead |
| R5 | a11y 和键盘路径被拖到最后，后期补成本高 | 高 | 中 | demo 可看不可用，测试只覆盖视觉 | 每个 sprint 都必须带 smoke tests 与 keyboard path | QA |
| R6 | 图形组件过早追求大图表，拖慢整体节奏 | 中 | 高 | 提前讨论复杂分析图、图例系统、交互联动 | 先只做 microchart 和 KPI card，不做大图表框架 | Chart |
| R7 | Form controls 没有共享 primitive，后续 Select/ComboBox/DatePicker 行为碎片化 | 中 | 中 | 多个字段组件交互不一致 | 先抽 field primitives，再铺具体控件 | Form |
| R8 | 主题、密度、RTL、locale 组合测试不足，跨环境回归频繁 | 中 | 中 | 一个改动导致多场景 demo 失效 | docs 中长期保留 Theme Lab 和 smoke walkthrough | QA |
| R9 | 过多内部 helper 暴露为公共 API，后续收口困难 | 中 | 中 | index.ts 导出快速膨胀、语义不稳 | 统一公共导出策略，内部 helper 不出包 | Tech Lead |
| R10 | Shell/Object Page 与现有 SplitLayout/DynamicPage 语义重叠 | 中 | 中 | 新旧组件界限不清，示例混乱 | 明确 `SplitLayout` 和 `FlexibleColumnLayout` 的使用边界 | Shell |

## 风险处理节奏

### 每周同步

- 本周新增风险
- 风险等级变化
- 是否影响 milestone
- 是否需要临时冻结 API 或主题命名

### 每个 Sprint 结束

- 复盘本 sprint 是否出现结构性返工
- 确认风险是否已转化为 backlog 任务
- 检查 docs 是否仍然足以支撑 walkthrough 验收
