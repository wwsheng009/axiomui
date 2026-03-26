# Repository Admin Checklist

这份清单面向仓库管理员，目标是把 AxiomUI 当前已经落地的 release、CI、Dependabot 和 changeset 流程真正启用起来。

## 1. Actions 设置

- 确认仓库已启用 GitHub Actions
- 在 `Settings -> Actions -> General` 中允许当前 workflow 依赖的 actions 正常运行
- 在 `Workflow permissions` 中允许 GitHub Actions 创建和批准 pull request

说明：

- `Release` workflow 依赖 `changesets/action` 创建或更新 release PR
- `CI` workflow 已显式限制为 `contents: read`
- `Release` workflow 只在需要的 job 上申请 `contents: write`、`pull-requests: write` 和 `id-token: write`

## 2. Secret 设置

默认兼容两种发布模式：

- 配置 `NPM_TOKEN`，继续使用 token 发布
- 不配置 `NPM_TOKEN`，改用 npm trusted publishing

如果仓库暂时还没有完成 trusted publishing 绑定，则至少配置以下仓库 secret：

- `NPM_TOKEN`

用途：

- `Release` workflow 在发布 `@axiomui/react` 和 `@axiomui/tokens` 时使用这个 token

建议额外确认：

- token 具备发布目标 scope 的权限
- token 没有绑定到错误的 registry
- token 的 2FA 策略与实际发布方式一致

## 2.1 Trusted Publishing 迁移预留

当前 `Release` workflow 会先由 `changesets/action` 决定是否进入发布阶段；一旦进入发布阶段，若检测到 `NPM_TOKEN` 则走 token 发布，否则走 npm trusted publishing。若后续要正式迁移到 npm trusted publishing，管理员还应确认：

- npm 包页面已正确配置 trusted publisher
- workflow 文件名与 npm 侧配置完全匹配
- workflow 文件名大小写、`.yml/.yaml` 后缀与 `.github/workflows/` 下实际文件完全一致
- 仓库是公开仓库，因为 npm provenance 当前不支持私有仓库
- workflow 使用的 Node/npm 版本满足 npm 当前对 trusted publishing 的最低要求
- 如果仓库保持私有，则不能只依赖 trusted publishing，仍然需要 `NPM_TOKEN`

说明：

- 发布包的 `package.json` 已补齐 `repository` 元数据
- `Release` workflow 已包含 `id-token: write`
- 当前 `Release` workflow 使用 Node 24，已满足 npm 文档里 trusted publishing 的最低 Node 版本要求
- 当前 token 发布流程会按仓库可见性自动设置 `NPM_CONFIG_PROVENANCE`：公有仓库请求 provenance，私有仓库显式关闭 provenance
- trusted publishing 路径则由 npm 在满足条件时自动生成 provenance
- 按 npm 官方建议，完成 trusted publishing 验证后可以再考虑收紧或移除长期 token
- 一旦 trusted publishing 已验证通过，可以直接删除仓库中的 `NPM_TOKEN` secret，workflow 会自动切换到无 token 发布路径

## 3. 分支保护

建议为 `main` 配置分支保护或 ruleset，并至少启用这些要求：

- Require a pull request before merging
- Require status checks to pass before merging
- Required status check: `CI / validate`
- Require branches to be up to date before merging

可选但推荐：

- Require conversation resolution before merging
- Include administrators

说明：

- 当前 `CI` workflow 的唯一 job 名称是 `validate`
- 在 GitHub 界面中，所见状态检查通常会显示为 `CI / validate`

## 4. Dependabot

仓库已提交 `.github/dependabot.yml`，因此主仓会按配置自动开始 version update 检查。

管理员还应确认：

- 仓库的 Dependency graph 已启用
- 收到第一批 Dependabot PR 后，验证 `npm` 和 `github-actions` 两类更新都能正常触发 CI

如果这是一个 fork：

- 还需要在仓库设置中显式启用 Dependabot version updates

## 5. Fork PR 审批策略

如果仓库是公开仓库，建议在 `Settings -> Actions -> General` 中检查 fork PR workflow 审批策略。

建议至少确认：

- 是否要求外部贡献者的 workflow 运行先经过审批
- 维护者知道如何批准来自 fork 的 workflow 运行

## 6. Release Workflow 触发方式

当前 `Release` workflow 支持两种触发方式：

- push 到 `main`
- 手动 `workflow_dispatch`

建议管理员完成一次手动演练，确认：

- workflow 能正常启动
- `NPM_TOKEN` 或 trusted publishing 其中一种发布凭据路径已按预期生效
- changesets/action 能创建 release PR

## 7. 首次上线后检查

建议在第一次正式启用后逐项确认：

1. 提交一个仅修改 docs 的 PR，确认不会被错误要求补 changeset
2. 提交一个带 `.changeset/*.md` 的可发布包 PR，确认 `CI / validate` 正常通过
3. 合并到 `main` 后，确认 release workflow 会创建或更新 release PR
4. 合并 release PR 后，确认 npm 发布与 git tag 创建符合预期
   这包括确认 workflow 已把新 tag push 回远端，而不只是停留在 runner 本地
5. 收到一次 Dependabot PR，确认自动化升级链路正常

## 8. Public Package Metadata

如果计划把 `@axiomui/react` 和 `@axiomui/tokens` 长期作为公开 npm 包维护，建议在首次正式对外发布前再确认：

- 仓库根目录存在明确的 `LICENSE` 文件
- 可发布包的 `package.json` 补齐 `license` 字段
- 包级 README 内容足够支撑 npm 包页的基本使用说明

说明：

- 当前仓库已经补齐了包级 README
- 但许可证类型仍然需要由仓库维护者明确决定，不能由自动化流程替代

## References

- GitHub Actions repository settings:
  https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository
- Branch protection and required status checks:
  https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- Dependabot version updates:
  https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates
