# Backlog Import Files

这组文件用于把 [master-backlog-board.md](../master-backlog-board.md) 中的 `Sprint 1-5` 任务，导出成更适合项目管理工具导入的表格格式。

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
  默认状态，当前统一为 `Backlog`
- `main_dependency`
  主要依赖任务或阶段
- `labels`
  建议导入时可映射为标签，使用分号分隔
- `draft_path`
  对应 markdown 草稿路径

## 建议使用方式

1. 先导入 `TSV` 到表格工具，确认字段和 owner 映射。
2. 若目标系统支持 CSV 导入，再使用 `CSV` 做正式导入。
3. 导入后，使用 `draft_path` 回链到具体 markdown 草稿。
4. 若需要只导入单个 sprint，可先在表格中过滤 `sprint` 字段。
