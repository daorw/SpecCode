# TODO: Git 操作集成测试

## 状态
pending

## 描述
当前 Git 操作的测试仅覆盖了纯函数（`parseVersion`, `bumpVersion`, `readRequirementsVersion`），未测试涉及真实 Git 仓库的操作：

- `initRepo` — 初始化仓库
- `createVersionBranch` — 创建版本分支
- `getDiff` — 需求文档差异对比
- `mergeToMain` — 合并版本分支
- `createTag` — 创建版本标签
- `stageAndCommit` — 暂存和提交
- `getTags` — 获取所有标签

## 方案
在测试中创建临时目录，`git init` 初始化后测试完整流程：

1. 初始化仓库
2. 创建初始 commit
3. 创建版本分支 `version/1.0.1`
4. 修改文件并 commit
5. diff 对比两个版本
6. merge 回 main
7. 创建 tag
8. 验证 tag 存在

## 文件
- `src/__tests__/git/git.test.ts` — 需扩展
- `src/lib/git/git-ops.ts` — 被测试代码
