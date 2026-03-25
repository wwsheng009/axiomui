# Field 与 Input 系统

## 角色定位

字段系统是 UI5 表单体验的核心。`Input`、`TextArea`、`DatePicker`、`TimePicker`、`StepInput` 这类控件虽然业务语义不同，但视觉上都建立在同一套 field wrapper、状态边界、图标槽位和密度规则之上。

## 结构模型

UI5 的字段不是“直接给 `<input>` 画边框”，而是更接近下面这套分层：

```text
field
  -> content wrapper
  -> input / textarea inner
  -> optional begin/end icon slots
  -> optional value-state decoration
```

真正的视觉边界大多落在 wrapper 上，这也是它能稳定承载 icon、value state、readonly 和 busy 状态的原因。

## 关键尺寸与 token 信号

- 普通字段最小宽度约 `2.75rem`，compact 下约 `2rem`。
- 输入内容左右 padding 默认约 `0 .625rem`，compact 下约 `0 .5rem`。
- 图标槽常见宽度约 `2.25rem`，compact 下约 `2rem`。
- 单图标字段建议最小宽度约 `5rem`，双图标字段约 `7.25rem`。
- focus 边界圆角约 `.25rem`，readonly 会收紧到更小的边界半径与 offset。

这些值说明字段系统的重点不是“输入框长什么样”，而是“内容、图标、状态和焦点如何稳定共存”。

## 状态与交互规则

- hover 只轻微改变边框或阴影，不会大幅改变背景。
- focus 使用系统级 ring，而不是把整块输入背景刷成品牌色。
- readonly 仍保留边界和占位，只是把可编辑感降下来。
- disabled 使用统一禁用透明度。
- `error / warning / success / information` 都有各自的边框、背景和附加阴影语义。
- `TextArea` 有独立 padding 节奏，但仍复用同一套 field token。

## 复刻建议

- 永远把 wrapper 当成真正的视觉边界，而不是把所有状态都压到原生输入框上。
- 前后图标槽位做成标准布局能力，不要依赖临时 absolute 修补。
- 把 value state 做成字段系统一级能力，避免日期、搜索、多值输入各自重写。
- 把 placeholder 色、focus ring、readonly 语气都做成 token，而不是让浏览器默认决定。

## 主要实现来源

- `resources/sap/m/themes/base/library.less`
- `resources/sap/m/themes/sap_horizon/library-parameters.json`
