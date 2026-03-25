# S4-06 Avatar

## Type

- Component Task

## Summary

实现 Avatar，补齐用户和对象身份展示原语。

## Goal

- 支撑对象页头、用户区和列表项中的身份展示
- 为 ObjectPageHeader 提供标准头像组件

## Scope

- In scope:
  - image
  - initials fallback
  - size
  - shape
  - optional status dot
- Out of scope:
  - 上传或裁剪能力

## Planned File Areas

- `packages/react/src/components/avatar/*`
- `packages/react/src/index.ts`

## Docs Impact

- Shell Lab 或 Object Page Lab 需要展示头像矩阵

## Testing

- 图片与首字母回退
- 尺寸枚举
- 圆形和方形

## Acceptance Criteria

- [ ] 能在 ToolHeader、ObjectPageHeader、列表项中复用
- [ ] 回退显示稳定
- [ ] 与主题和状态色协同正常

## Dependencies

- Sprint 1 theme foundation

## Suggested Owner

- Shell
