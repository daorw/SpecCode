# Workflows

speccode Agent 的多步骤编排工作流定义。

## Built-in Workflows

### main — 需求确认 → 代码生成 → 版本迭代

```
Grill-me 对话确认需求
  → 实时写入需求文档 (draft → confirmed)
  → 全部确认后触发代码生成
  → Agent 在指定目录生成项目代码
  → 创建 Git 分支 / 打 tag / 版本绑定
```

### iterate — 版本迭代

```
用户修改需求文档 → 版本号 +1
  → Agent 创建新 Git 分支
  → diff 新旧需求文档
  → 仅修改受影响代码文件
  → 用户确认后 merge
  → tag 回写需求文档
```
