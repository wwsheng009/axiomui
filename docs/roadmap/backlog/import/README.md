# Backlog Import Files

这组文件用于把 backlog 草稿导出成更适合项目管理工具导入的表格格式。

它们的定位是“导入种子”，不是当前代码快照的 live status board：

- 当前真实状态以 [../master-backlog-board.md](../master-backlog-board.md)、[../owner-backlog-board.md](../owner-backlog-board.md) 和 [../../execution/current-status.md](../../execution/current-status.md) 为准
- 本目录中的 `status` 默认保留为初始导入态，不随每次代码快照同步回写
- 截至 `2026-03-27`，当前导入表仍主要服务 `Sprint 1-5` 的初次导入；`Sprint 6` 的当前实施状态请直接查看 markdown board

## 文件

- [master-backlog-board.csv](./master-backlog-board.csv)
  逗号分隔格式，适合多数项目管理工具或脚本处理。
- [master-backlog-board.tsv](./master-backlog-board.tsv)
  制表符分隔格式，适合直接粘贴到表格软件或多维表。
- [owner-backlog-board.csv](./owner-backlog-board.csv)
  按 owner 排序的逗号分隔格式，适合导入后直接按负责人过滤。
- [owner-backlog-board.tsv](./owner-backlog-board.tsv)
  按 owner 排序的制表符格式，适合直接粘贴做分工表。

## 字段说明

- `id`
  稳定任务 ID，例如 `S2-04`
- `sprint`
  对应 sprint，例如 `Sprint 2`
- `epic`
  对应 epic 名称
- `type`
  `Epic`、`Foundation Task`、`Component Task`、`Docs Or QA Task`
- `title`
  建议导入后的任务标题
- `owner`
  默认建议 owner
- `status`
  导入时的初始状态；当前文件默认仍保留为 `Backlog`，不表示 live board 的实时状态
- `main_dependency`
  主要依赖任务或阶段
- `labels`
  建议导入时可映射为标签，使用分号分隔
- `draft_path`
  对应 markdown 草稿路径

## 建议使用方式

1. 若你要看当前实施状态，先看 [../master-backlog-board.md](../master-backlog-board.md) 或 [../../execution/current-status.md](../../execution/current-status.md)。
2. 若你要做第一次项目管理工具导入，再先导入 `TSV` 到表格工具，确认字段和 owner 映射。
3. 若目标系统支持 CSV 导入，再使用 `CSV` 做正式导入。
4. 导入后，使用 `draft_path` 回链到具体 markdown 草稿。
5. 若需要只导入单个 sprint，可先在表格中过滤 `sprint` 字段。
