# S1-03 Component Token Cleanup

## Type

- Foundation Task

## Summary

清理现有核心组件中的硬编码视觉值，让组件层真正消费 semantic tokens。

## Goal

- 让现有组件在 dark 和 high-contrast 下可用
- 为后续控件提供可复制的 CSS 约束方式

## Scope

- In scope:
  - `button`
  - `card`
  - `input`
  - `toolbar`
  - `tabs`
  - `dialog`
  - `dynamic-page`
  - `split-layout`
  - `variant-sync`
- Out of scope:
  - 新控件实现

## Planned File Areas

- `packages/react/src/components/**/**.css`

## Implementation Notes

- 不新增裸色值
- 不在组件 CSS 中直接分主题
- 保持 `compact/cozy` 与 `LTR/RTL` 兼容

## Docs Impact

- Theme Lab 需要覆盖上述组件的视觉回归矩阵

## Testing

- 主题切换 smoke
- selected、disabled、focus 状态
- high-contrast 文本对比度检查

## Acceptance Criteria

- [ ] 主要核心组件已切到 semantic tokens
- [ ] dark 与 high-contrast 下可用
- [ ] 没有新增硬编码主题色

## Dependencies

- S1-02

## Suggested Owner

- Foundation
