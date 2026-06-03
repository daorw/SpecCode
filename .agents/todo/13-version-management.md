# TODO: 版本管理增强

## 状态
pending

## 描述
当前版本管理功能基础，仅支持基础的 Git 操作。需要增强以下方面：

1. **可视化分支图** — 展示 Git 分支拓扑
2. **回滚支持** — 一键回退到指定版本
3. **变更日志** — 自动生成版本变更说明
4. **多项目管理** — 增强项目切换体验

## 技术选项

### 可视化分支图
- 使用 `gitgraph-js` 或 `d3-git` 库
- 或使用 SVG 自绘简单分支图
- 展示分支、合并、tag 关系

### 回滚支持
- 利用 `git reset --hard` 或 `git revert`
- 需要用户确认避免误操作
- 记录回滚操作到版本历史

### 变更日志
- 解析 Git commit message
- 按 conventional commits 分类
- 生成 Markdown 格式 changelog

### 多项目管理
- 当前 NavBar 已有基础支持
- 增加项目切换快捷键
- 保存每个项目的最近版本

## 实施优先级

| 优先级 | 项目 | 复杂度 |
|--------|------|--------|
| P0 | 回滚支持 | 低 |
| P1 | 变更日志 | 中 |
| P2 | 可视化分支图 | 高 |
| P2 | 多项目管理增强 | 中 |

## 文件
- `src/lib/git/git-ops.ts`
- `src/app/api/version/route.ts`
- `src/components/doc/version-bar.tsx`
- `src/components/chat/nav-bar.tsx`

## 参考
- simple-git: https://github.com/steveukx/git-js
- gitgraph-js: https://github.com/nicoespeon/gitgraph.js
