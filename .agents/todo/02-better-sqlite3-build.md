# TODO: better-sqlite3 构建自动化

## 状态
done (partial)

## 已解决
- `next.config.ts` 改为 `next.config.mjs`（Next.js 14 不支持 .ts 配置文件）
- `serverExternalPackages` 改为 `experimental.serverComponentsExternalPackages`
- SWC binary 损坏通过重新安装 Next.js 解决

## 描述
`better-sqlite3` 是 native addon，首次安装后可能需要手动编译。当前项目中执行 `npm install` 后 DB 测试全部失败，需手动运行：

```
cd node_modules/better-sqlite3 && npm run build-release
```

## 方案
1. 在 `package.json` 的 `postinstall` 脚本中添加 `electron-rebuild` 或直接的构建脚本
2. 或切换到纯 JS 的 sqlite 方案（如 `sql.js` / `bun:sqlite`）
3. 或使用 `@aspect-build/better-sqlite3` 等预构建包
4. 或在 AGENTS.md 中显式记录构建步骤

## 影响范围
- `src/lib/db/connection.ts` — 数据库连接初始化
- `src/__tests__/db/db.test.ts` — 依赖 :memory: 模式

## 优先级
高 — 阻塞 CI 和新开发者环境搭建
