# First Review Checklist

这份清单用于第一次帮别人做 review 时的自检，避免 review 只停留在“代码看起来还行”。

## 先确认 review 的上下文

- [ ] 已看过关联 issue 或 backlog draft
- [ ] 已知道这个任务属于哪个 sprint / epic / owner
- [ ] 已知道它依赖哪一层基础能力

## Review 代码时先看什么

- [ ] API 命名是否符合 [../../02-api-conventions.md](../../02-api-conventions.md)
- [ ] 是否复用了 shared primitive / provider / token
- [ ] 是否把本该在 foundation 层的逻辑塞进了业务组件
- [ ] 是否遗漏公共导出

## Review 体验时先看什么

- [ ] docs 是否有对应 demo，而不是只有孤立样例
- [ ] `compact/cozy` 是否正常
- [ ] `LTR/RTL` 是否正常
- [ ] keyboard path 是否合理
- [ ] 如果有弹层，focus 和 dismiss 是否正常

## Review 质量时先看什么

- [ ] 是否补了最小测试或 smoke path
- [ ] 是否存在明显的空间干涉、溢出或布局断裂
- [ ] 是否引入了新的裸色值或脱离 semantic token 的实现
- [ ] 是否把风险、限制或后续事项说清楚

## 一个好 review 至少应该给出什么

- [ ] 明确指出发现的问题和影响范围
- [ ] 区分“必须改”和“可后续优化”
- [ ] 给出能帮助推进的下一步建议
- [ ] 如果发现结构性问题，建议回写 decision log 或 risk retro

## Review 完成标准

一次有效的 review 不只是指出问题，还应该帮助回答：

- 这次改动是否符合当前 sprint 目标
- 它是否把后续任务变得更稳，而不是埋下更多返工
- docs 和验收路径是否已经足够支持团队继续推进
