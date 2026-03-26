# Changesets

这个目录用于存放 AxiomUI 的 release intent 文件。

常用流程：

1. 改动了可发布包时运行 `pnpm changeset`
2. 提交生成的 `.changeset/*.md`
3. 准备发版时先运行 `pnpm release:check`
4. 维护者执行 `pnpm version-packages`
5. 检查版本改动后执行 `pnpm publish:packages`

`apps/docs` 是私有应用，不参与 npm 发布。
