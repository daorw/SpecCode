# TODO: 环境变量 & 配置管理

## 状态
pending

## 描述
项目缺少环境变量文档和管理：

## 需要的环境变量
| 变量 | 必需 | 说明 |
|------|------|------|
| `ANTHROPIC_API_KEY` | 是 | Anthropic API 密钥 |
| `OPENAI_API_KEY` | 否 | OpenAI API 密钥 |
| `SPECCODE_DB_PATH` | 否 | SQLite 数据库文件路径（默认 `./speccode.db`） |

## 方案
1. 创建 `.env.example` 模板文件
2. 在 AGENTS.md 中记录环境变量要求
3. 添加环境变量校验逻辑（启动时检查必需变量）
4. Next.js 的 `next.config.ts` 中读取环境变量

## 文件
- `.env.example` — 待创建
- `next.config.ts`
- `src/lib/db/connection.ts` — 已使用 SPECCODE_DB_PATH
- `AGENTS.md`
