# TODO: Markdown 编辑器增强

## 状态
pending

## 描述
当前需求文档编辑器 (`src/components/doc/doc-editor.tsx`) 使用基础 `<textarea>` + `<select>`，缺乏：

1. **实时 Markdown 预览** — 编辑时同步渲染预览（当前仅保存后渲染）
2. **Markdown 工具栏** — 粗体/斜体/标题/列表等快捷按钮
3. **语法高亮** — 代码块内的语言高亮
4. **拖拽排序** — 需求条目拖拽调整顺序
5. **键盘快捷键** — Ctrl+S 保存、Tab 缩进等
6. **冲突检测** — 多标签页同时编辑时的冲突提示

## 技术选项
1. **CodeMirror 6** + markdown 插件 — 功能最强，体积较大
2. **Monaco Editor** — VS Code 同款，体积大但体验好
3. **Milkdown** — 基于 ProseMirror 的 Markdown 编辑器
4. **自建** — 基于 contentEditable + 双向绑定

## 当前 V1 简化方案
保持 textarea，添加：
- 实时预览右侧面板
- Ctrl+S 快捷键保存
- 基本 Markdown 快捷键（Ctrl+B/I）

## 文件
- `src/components/doc/doc-editor.tsx`
