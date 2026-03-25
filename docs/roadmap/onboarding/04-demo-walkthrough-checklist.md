# Demo Walkthrough Checklist

这份清单用于新成员本地自检，也适合 PR walkthrough 和 milestone 验收时快速过一遍。

## 通用检查

- docs 可以正常启动
- 页面没有明显报错或空白区
- 主题切换后主要组件仍可读
- `compact/cozy` 切换后布局没有明显挤压或断裂
- `LTR/RTL` 切换后对齐和图标方向没有明显问题

## Theme Lab

- 主题切换是否立即生效
- 语义色、surface、边框、focus ring 是否一起变化
- 组件在 dark/high contrast 下是否仍可辨识

## Form Lab

- `Input`、选择类控件、日期类控件在 `FormGrid` 中不溢出
- label、help text、value state 对齐正常
- keyboard path 可以从一个字段顺畅移动到下一个字段

## Worklist / Variant / Sync

- worklist 能正常加载并显示筛选结果
- variant 切换、保存、删除流程可走通
- sync 面板可以看到当前状态、远端快照和活动流
- adapter 切换后状态不会残留错误上下文

## Shell / Object Page

- 壳层头部、侧边导航和主内容区层级清晰
- 多列布局切换后内容不重叠
- 对象页 section 导航与正文滚动关系清楚

## Chart / KPI

- 微图表在卡片和摘要区尺寸稳定
- 深色主题下图形与标签仍可读
- 行内小图形不会把表格行高撑坏

## 交互与可用性

- `Enter`、`Escape`、方向键等关键路径正常
- 弹层打开后焦点位置合理
- 弹层关闭后焦点能回到触发点附近

## 提交前最小验证

```bash
pnpm typecheck
pnpm build
```

如果是文档变更，可以不跑完整构建，但最好至少确认相关链接和目录入口都可达。
