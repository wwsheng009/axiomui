# Form 与 Responsive Grid 布局

## 设计意图

UI5 的表单布局不是简单的一列标签一列输入，而是完整的响应式栅格与密度系统。它的目标是：

- 在手机、平板、桌面上自适应标签和字段排布
- 在 Cozy 与 Compact 下保持对齐
- 支持分组标题、工具栏、断行和多列布局

## 现有实现的关键特征

从 `sap/ui/layout/themes/base/library.less` 可见：

- 存在 `sapUiRespGridMedia-Std-Phone`
- 存在 `sapUiRespGridMedia-Std-Tablet`
- 存在 `sapUiRespGridMedia-Std-Desktop`
- 存在 `sapUiRespGridMedia-Std-LargeDesktop`
- Form 与 Grid 深度绑定
- `sapUiSizeCompact` 对表单标题、标签和首行留白有大量专门处理

## 新项目应复刻的规则

### 1. 表单不应该是自由排版

应定义统一规则：

- 标签列宽
- 字段列宽
- 组标题占位
- 多列时的断点行为

### 2. 标签和字段在密度切换时同步变化

Compact 下：

- 标签和字段的垂直节奏都应下降
- 组标题与工具栏高度也要跟着收敛

### 3. 响应式行为必须显式化

建议至少定义：

- Phone：单列优先
- Tablet：双列起步
- Desktop：双列或三列
- XL：复杂表单可扩展更多列

## 推荐实现方式

新项目中建议把 form grid 抽成单独布局系统，而不是每个表单自己写：

- `form-row`
- `form-label`
- `form-field`
- `form-section`
- `form-toolbar`

并由同一套 breakpoints 驱动。

## 不建议的做法

- 每个表单页自己调 margin
- 用媒体查询临时拼凑 label 宽度
- 只靠 flex 自动换行，不定义明确列规则

## 验收重点

- 标签与字段在三种设备上都对齐
- Compact 下字段高度下降后，标签仍然垂直居中
- 分组标题和工具栏不会打乱整体节奏
