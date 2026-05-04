# TODO: 版本迭代端到端工作流

## 状态
pending

## 描述
需求文档描述的核心版本迭代流程 (§2.4) 尚未端到端验证：

```
用户修改需求文档 → 更新版本号
  → Agent 创建新 Git 分支
  → diff 新旧需求文档
  → 仅修改受影响代码文件
  → 用户确认后 merge 到主分支
  → 保留分支
  → 打 git tag
  → tag 回写需求文档
```

## 缺失环节
1. **需求变更检测** — Agent 如何感知用户修改了需求文档？需要文件监听或手动触发
2. **受影响代码分析** — diff 需求文档后如何映射到代码文件变更
3. **增量代码修改** — Agent 如何只修改受影响的文件而不是全量重新生成
4. **合并冲突处理** — 用户手动改了代码 + Agent 改了同一文件时的冲突
5. **tag 回写** — 如何在需求文档中自动更新 version 号

## 当前实现覆盖
- ✅ Git 分支/merge/tag 基础操作
- ✅ 需求文档 diff 能力
- ❌ 需求变更检测
- ❌ 受影响代码映射
- ❌ 增量代码修改（Agent 驱动的代码变更）
- ❌ tag 回写需求文档

## 文件
- `src/lib/git/git-ops.ts`
- `src/lib/agent/tools/index.ts` — version_control 工具
- `src/app/api/agent/execute/route.ts` — 工具执行代理
