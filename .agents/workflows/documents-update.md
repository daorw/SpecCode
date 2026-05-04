# documents-update

文档同步更新流程。Agent 在完成任何功能变更（新增/修改/删除/修复）后，必须加载本工作流并更新对应文档。

---

## 更新目标

| 文档 | 更新时机 |
|------|----------|
| `REQUIREMENTS.md` | 需求变更（新增章节、修改功能描述、砍掉功能） |
| `AGENTS.md` | 规范变更（新增依赖、项目结构变化、命令变化） |
| `.agents/todo/` | 完成待办项、发现新问题 |

---

## REQUIREMENTS.md 更新规则

### 新增功能
- 在对应章节下添加需求条目
- 更新文档顶部的"最后更新"日期
- 如果版本号需要递增，按语义化版本规则更新
- 在 §7 共识记录表中追加新决策行

### 砍掉功能
- 将条目移动到 §6 "不包含 (Out of Scope)" 清单
- 在 §7 中记录砍掉决策

### 修改功能描述
- 直接修改对应条目
- 如涉及 breaking change，更新版本号

### 版本号规则
- major：breaking change 或功能架构大改
- minor：新增功能
- patch：文案修正、格式调整

---

## AGENTS.md 更新规则

### 需要更新 AGENTS.md 的变更
- 新增/移除 npm 依赖
- 项目目录结构变化（新增/移除/重命名目录）
- 命名约定变化
- 新增/修改命令
- 工作流变更

### 不需要更新 AGENTS.md 的变更
- 纯 React 组件内部实现调整
- 已有模块的代码优化（不改变接口）
- 测试代码变更

---

## .agents/todo/ 管理规则

### 文件格式
```
.tagents/todo/NN-short-name.md
```
- `NN`：两位数字序号（01-99）
- `short-name`：kebab-case 简短描述

### 状态流转
```
pending → in_progress → done
```

文件开头必须包含状态标记：
```markdown
## 状态
pending | in_progress | done
```

### 操作规则
- **完成**：状态改为 `done`，不删除文件
- **新增**：取当前最大序号 +1
- **废弃**：状态改为 `cancelled`，保留文件

---

## 提交规范

涉及文档变更的 commit message 格式：

```
feat(docs): 新增 XX 章节到 REQUIREMENTS.md
fix(docs): 修正 AGENTS.md 中项目结构描述
```

---

## 自检清单

- [ ] REQUIREMENTS.md 内容是否与当前实现一致？
- [ ] AGENTS.md 项目结构是否反映实际目录？
- [ ] 新增/完成的功能是否在 todo/ 中有对应跟踪？
- [ ] commit message 是否说明了文档变更？
