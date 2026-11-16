# 犹格泡泡的时光屋

从底层手写的个人主页：Vue 3 + Vite + 自写 Markdown 编译管线（markdown-it + shiki 构建期高亮），部署在 GitHub Pages。

## 写文章

在 `posts/` 下新建 `.md` 文件（文件名即 URL slug），frontmatter 格式：

```yaml
---
title: 标题
excerpt: 摘要（首页列表显示）
date: 2026-11-16T10:00:00+08:00
tags:
  - 随笔
---

正文（Markdown）……
```

`posts/_template.md` 是模板（`_` 开头的文件不会发布），`pages/` 放独立页面（如关于页）。

## 本地开发

```bash
pnpm install
pnpm dev      # 开发（改 md 实时刷新）
pnpm build    # 生产构建 → dist/
pnpm preview  # 预览生产构建
```

## 部署

推送到 `main` 分支即自动通过 GitHub Actions 构建并发布。

## 定制入口

- 站名/署名/链接：`src/site.config.ts`
- 全部样式（明暗主题 CSS 变量）：`src/assets/main.css`
- Markdown 编译管线：`plugins/markdown.ts`
