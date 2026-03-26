# Release Guide

这份文档定义 AxiomUI 当前的版本与发布流程。仓库现在使用 `changeset` 管理版本意图，并保留一个根级发布前检查命令来验证构建、测试和打包结果。

## 发布对象

- `@axiomui/tokens`
- `@axiomui/react`

`@axiomui/docs` 是私有应用，不参与 npm 发布。

## 贡献者流程

当改动影响可发布包时，先在仓库根目录执行：

```bash
pnpm changeset
```

这个命令会生成一份 `.changeset/*.md`，用于声明这次改动对发布包的 semver 影响。通常规则如下：

- 新增公开组件、hook、导出项或能力时用 `minor`
- 修复现有行为且不破坏 API 时用 `patch`
- 破坏兼容性时用 `major`

如果改动只影响 `apps/docs` 这类私有应用，通常不需要 changeset。

## 发布前检查

在仓库根目录执行：

```bash
pnpm release:check
```

这个命令会依次执行：

1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm build`
4. `pnpm --filter @axiomui/tokens pack`
5. `pnpm --filter @axiomui/react pack`

`pack` 阶段会把 tarball 输出到系统临时目录并在结束后自动清理，因此不会污染工作树。

除了执行类型检查、测试、构建和打包之外，`release:check` 还会额外校验：

- 可发布包的关键元数据是否齐全，例如 `repository`、`bugs`、`homepage` 和 `publishConfig.access`
- tarball 是否包含核心发布产物，例如 `@axiomui/react` 的 `dist/types/index.d.ts`

对于许可证这类需要维护者自行决策的公共包元数据，`release:check` 当前会输出警告而不是直接失败。例如仓库缺少 `LICENSE` 文件，或可发布包缺少 `license` 字段时，命令会明确提示，但仍允许你先完成技术链路验证。

## 维护者发版流程

准备发版时，按下面顺序执行：

```bash
pnpm release:check
pnpm version-packages
pnpm publish:packages
git push --follow-tags
```

- `pnpm version-packages` 会消费 `.changeset/*.md`，更新包版本并删除已使用的 changeset 文件
- `pnpm publish:packages` 会发布本地版本尚未存在于 npm 的包，并创建对应 git tag
- `git push --follow-tags` 用于把本地新生成的 release tag 推回远端
- `@axiomui/react` 和 `@axiomui/tokens` 已通过各自的 `publishConfig.access=public` 配置为公开包
- 两个可发布包已经补齐 `repository` / `bugs` / `homepage` 元数据
- 自动发布时，workflow 会在 token 发布路径上根据仓库可见性自动设置 `NPM_CONFIG_PROVENANCE`
- 公有仓库会请求生成 provenance，私有仓库则会显式关闭 provenance，避免 npm 因不支持私有仓库 provenance 而发布失败
- 如果走 trusted publishing，则 npm 会在满足条件时自动生成 provenance

## CI 约定

仓库建议启用两条 workflow：

- PR 校验：执行 `pnpm changeset status` 和 `pnpm release:check`
- 主分支 release：通过 Changesets action 维护 release PR，并在满足条件时发布 npm 包
- Dependabot：定期更新 npm workspace 依赖和 GitHub Actions 引用

其中 `@axiomui/docs` 已在 `.changeset/config.json` 中加入 `ignore`，因此 docs-only 改动不会被错误要求补 changeset。
另外建议在本地或 CI 中执行：

```bash
pnpm lint:workflows
```

这个命令会下载并执行官方 `actionlint` 二进制，对 `.github/workflows/*.yml` 做静态校验。

Dependabot 配置位于 `.github/dependabot.yml`。当前使用每周一次的检查节奏：

- `npm`：检查根目录下的 workspace 依赖与 `pnpm-lock.yaml`
- `github-actions`：检查 `.github/workflows` 中引用的 action 版本

管理员首次启用这些能力前，建议按 [admin-checklist.md](./admin-checklist.md) 逐项完成仓库设置。

## 首次发布说明

`@axiomui/react` 和 `@axiomui/tokens` 目前都还是未发布状态。对于这类首发包，`changeset publish` 会依据 npm 上是否已经存在当前本地版本决定是否发布，因此即使某个包没有在本轮 changeset 里被重新 bump，只要它的本地版本尚未发布，仍然会在发布阶段被识别出来。

## CI Secret

如果要启用自动发布，有两种受支持的凭据模式：

1. `NPM_TOKEN`
2. npm trusted publishing

`GITHUB_TOKEN` 由 GitHub Actions 自动提供，用于创建或更新 release PR。

当前 [release.yml](../../.github/workflows/release.yml) 的行为是：

- 先由 `changesets/action` 判断当前是“创建/更新 release PR”还是“进入发布阶段”
- 如果进入发布阶段且仓库配置了 `NPM_TOKEN` secret，则后续 step 用 token 执行 `pnpm publish:packages`
- 如果进入发布阶段且没有配置 `NPM_TOKEN`，则后续 step 直接走 npm trusted publishing
- 如果仓库是私有的且没有配置 `NPM_TOKEN`，workflow 会在真正调用 `npm publish` 前直接失败，并给出明确提示
- 发布完成后，workflow 会执行 `git push origin --tags`，把当前 run 中生成的版本 tag 推回 GitHub

本地手动发版和 CI 自动发版在 tag 回推上稍有不同：

- 本地维护者通常需要 `git push --follow-tags`，因为本地既要推 release commit，也要推 tag
- CI 的 push 触发场景下，触发 workflow 的 commit 本来就已经在远端，所以只需要补推新 tag，不应再次强依赖分支头仍然停在同一个 commit

这样处理的目的是把 `changesets/action` 限定在它文档明确支持的版本管理职责上，而把真正的 `npm publish` 凭据模式切换放在显式的 workflow step 中完成。

另外，`Release` workflow 已经声明 `id-token: write`。按 npm 官方文档，在 GitHub-hosted runner 上执行发布时，这为生成 provenance 提供了必要条件；但如果仓库是私有仓库，当前 workflow 会在 token 发布路径上显式关闭 provenance，而 trusted publishing 路径下 npm 也不会生成 provenance attestation。

需要注意的是，provenance 现在只在 CI 发布阶段启用，而不会固定写进包的 `publishConfig`。这样可以避免维护者在本地手动执行 `pnpm publish:packages` 时，因为当前环境不是受支持的云 CI 而触发 npm 的 provenance 错误。

## 手动触发

`Release` workflow 现在同时支持：

- push 到 `main`
- 在 GitHub Actions 页面手动执行 `workflow_dispatch`

手动触发适合首次演练 release 流程，或在维护者需要重新执行 release 逻辑时使用。

## 手工验证补充

如果这次改动影响组件行为、键盘路径、弹层交互、日期时间格式或 docs 示例，除了 `pnpm release:check` 之外，还应补做这些检查：

- 在 docs 里手动走一遍对应 demo
- 验证 `compact/cozy`
- 验证 `LTR/RTL`
- 验证 locale 相关显示
- 确认 `packages/react/src/index.ts` 已导出新增公共 API

## 什么时候需要跑

建议在以下场景执行：

- 新增或修改 `.changeset/*.md` 之后
- 准备发布 npm 包之前
- 对外部可消费 API 做了改动之后
- 新增组件、hook、样式入口或导出项之后
- 修复构建、打包、类型声明相关问题之后
