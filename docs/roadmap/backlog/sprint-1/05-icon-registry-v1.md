# S1-05 Icon Registry V1

## Type

- Foundation Task

## Summary

建立命名式图标注册和渲染入口，为按钮、消息、页头和后续菜单类组件提供统一图标体系。

## Goal

- 从 `icon?: ReactNode` 过渡到 `iconName` 风格
- 支撑后续 Menu、ObjectStatus、ToolPage 等组件

## Scope

- In scope:
  - `Icon` 组件
  - `registerIcons`
  - `getIconDefinition`
  - 首批高频图标集
- Out of scope:
  - 完整 SAP 图标全集

## Planned File Areas

- `packages/react/src/icons/*`
- `packages/react/src/lib/icon-registry.ts`
- `packages/react/src/components/icon/icon.tsx`
- `packages/react/src/index.ts`

## Docs Impact

- Theme Lab 或 foundation usage 页面需要展示图标矩阵

## Testing

- 未知图标回退
- 尺寸与颜色继承
- RTL 镜像策略

## Acceptance Criteria

- [ ] 提供命名式图标调用方式
- [ ] 至少 20-30 个高频图标可用
- [ ] 支持后续组件按名称消费图标

## Dependencies

- 无

## Suggested Owner

- Foundation
