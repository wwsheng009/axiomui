# S1-06 Locale Provider And Formatters

## Type

- Foundation Task

## Summary

实现 `LocaleProvider` 和基础格式化工具，为后续日期时间控件和 docs 语言切换打底。

## Goal

- 统一 `locale` 管理
- 提供日期、数字和相对时间格式化入口
- 让 `locale` 与 `dir` 解耦

## Scope

- In scope:
  - `LocaleProvider`
  - `useLocale`
  - `formatDate`
  - `formatNumber`
  - `formatRelativeTime`
- Out of scope:
  - 完整翻译平台

## Planned File Areas

- `packages/react/src/providers/locale-provider.tsx`
- `packages/react/src/lib/i18n/*`
- `packages/react/src/index.ts`

## Docs Impact

- Theme Lab 需要提供 `zh-CN` 和 `en-US` 切换

## Testing

- `zh-CN` 与 `en-US` 输出差异
- locale 未提供时的默认行为

## Acceptance Criteria

- [ ] `LocaleProvider` 与格式化工具已导出
- [ ] docs 中 locale 切换可见
- [ ] 后续日期时间控件可直接复用

## Dependencies

- S1-01

## Suggested Owner

- Foundation
