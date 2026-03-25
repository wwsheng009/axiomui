# S1-02 Token Layering And Theme Files

## Type

- Foundation Task

## Summary

将 token 从单文件 horizon 变量拆分为 `base + semantic + theme overrides` 三层结构。

## Goal

- 支撑 `horizon`、`horizon_dark`、`horizon_hcb`、`horizon_hcw`、`fiori_3`、`fiori_3_dark`
- 降低后续组件样式返工成本

## Scope

- In scope:
  - base tokens
  - semantic tokens
  - theme-specific override files
- Out of scope:
  - 所有现有组件的样式清扫

## Planned File Areas

- `packages/tokens/src/styles.css`
- `packages/tokens/src/themes/horizon.css`
- `packages/tokens/src/themes/horizon-dark.css`
- `packages/tokens/src/themes/horizon-hcb.css`
- `packages/tokens/src/themes/horizon-hcw.css`
- `packages/tokens/src/themes/fiori-3.css`
- `packages/tokens/src/themes/fiori-3-dark.css`

## Implementation Notes

- 尺寸、space、radius、motion 优先放在 base
- 文本、边框、surface、状态色放在 semantic
- 主题差异仅在 override 层定义

## Docs Impact

- Theme Lab 需要暴露多主题切换

## Testing

- 多主题切换下文本、边框、surface 可见差异
- `compact/cozy` 不互相污染

## Acceptance Criteria

- [ ] 主题文件已拆分
- [ ] semantic token 命名稳定
- [ ] 至少 6 套主题可挂载
- [ ] 现有主题变量不再写死单一 horizon 语义

## Dependencies

- S1-01

## Suggested Owner

- Foundation
