/**
 * 自写 Markdown 编译管线（不依赖任何博客框架）：
 *
 * 1. load 钩子把每个 .md 文件编译成一个 ES 模块：
 *    export const slug / frontmatter / html
 * 2. 虚拟模块 virtual:posts 聚合 posts/ 下全部文章的元数据（按日期倒序），
 *    列表页只加载元数据，正文由路由懒加载。
 * 3. 代码高亮用 shiki 在构建期完成（github-light / github-dark 双主题，
 *    运行时零 JS，明暗切换靠 main.css 里的 CSS 变量）。
 *
 * 文章约定：posts/*.md，文件名即 slug；_ 开头的文件会被忽略（可作模板）。
 * frontmatter 沿用旧站习惯：title / excerpt / date / tags。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'
import { bundledLanguages, createHighlighter, type Highlighter } from 'shiki'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:posts'
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID

export function markdownPlugin(): Plugin {
  const postsDir = fileURLToPath(new URL('../posts', import.meta.url))

  // ---- shiki 高亮器（懒加载单例，语言按需加载） ----
  let highlighter: Highlighter | null = null
  const getHighlighter = async () => {
    if (!highlighter) {
      highlighter = await createHighlighter({
        themes: ['github-light', 'github-dark-default'],
        langs: [],
      })
    }
    return highlighter
  }

  // 从源码里扫出 fenced code block 声明的语言，渲染前确保已加载
  const extractLangs = (src: string): string[] => {
    const langs = new Set<string>()
    for (const m of src.matchAll(/^```\s*([\w-]*)/gm)) {
      if (m[1] && m[1] in bundledLanguages) langs.add(m[1])
    }
    return [...langs]
  }

  const md = new MarkdownIt({ html: true, linkify: true })

  // 外链新窗口打开
  const defaultLinkOpen =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href') ?? ''
    if (/^https?:\/\//.test(href)) {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noopener noreferrer')
    }
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  // 标题加 id（为以后做目录 TOC 留钩子）
  const headingCounter = { n: 0 }
  const defaultHeadingOpen =
    md.renderer.rules.heading_open ||
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    tokens[idx].attrSet('id', `h-${headingCounter.n++}`)
    return defaultHeadingOpen(tokens, idx, options, env, self)
  }

  const render = async (src: string): Promise<string> => {
    const h = await getHighlighter()
    for (const lang of extractLangs(src)) {
      if (!h.getLoadedLanguages().includes(lang)) await h.loadLanguage(lang as never)
    }
    headingCounter.n = 0
    md.options.highlight = (code, lang) => {
      try {
        return h.codeToHtml(code, {
          lang: lang && lang in bundledLanguages ? lang : 'text',
          themes: { light: 'github-light', dark: 'github-dark-default' },
          // 双主题都以 CSS 变量输出，颜色交给 main.css 的明暗主题切换
          defaultColor: false,
        })
      } catch {
        return '' // 回退到 markdown-it 自带的 <pre><code>
      }
    }
    return md.render(src)
  }

  // ---- posts 目录元数据扫描（virtual:posts 用） ----
  const readFrontmatter = (file: string): Record<string, unknown> => {
    const raw = fs.readFileSync(file, 'utf-8')
    return matter(raw).data
  }

  const scanPosts = () => {
    if (!fs.existsSync(postsDir)) return []
    return fs
      .readdirSync(postsDir)
      .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
      .map((f) => {
        const slug = f.replace(/\.md$/, '')
        const fm = readFrontmatter(path.join(postsDir, f))
        const date = fm.date ? new Date(fm.date as string).toISOString() : undefined
        const tags = Array.isArray(fm.tags)
          ? (fm.tags as string[])
          : typeof fm.tags === 'string' && fm.tags
            ? fm.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
            : []
        return {
          slug,
          title: (fm.title as string) ?? slug,
          excerpt: (fm.excerpt as string) ?? '',
          date: date ?? '1970-01-01T00:00:00.000Z',
          tags,
          year: date ? new Date(date).getFullYear() : 1970,
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  return {
    name: 'markdown-pipeline',
    enforce: 'pre',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID
    },

    load(id) {
      // 虚拟模块：全部文章元数据
      if (id === RESOLVED_VIRTUAL_ID) {
        return `export const posts = ${JSON.stringify(scanPosts())}\n`
      }

      // 每篇 .md 编译为一个模块
      if (id.endsWith('.md')) {
        return (async () => {
          const raw = fs.readFileSync(id, 'utf-8')
          const { data: fm, content } = matter(raw)
          const html = await render(content)
          const date = fm.date ? new Date(fm.date as string).toISOString() : undefined
          const frontmatter = { ...fm, date }
          const slug = path.basename(id, '.md')
          // 从渲染结果提取目录（heading_open 规则已写入 id="h-N"）
          const toc: { id: string; level: number; text: string }[] = []
          for (const m of html.matchAll(/<h([1-4]) id="(h-\d+)">([\s\S]*?)<\/h\1>/g)) {
            toc.push({
              id: m[2],
              level: Number(m[1]),
              text: m[3].replace(/<[^>]+>/g, '').trim(),
            })
          }
          return [
            `export const slug = ${JSON.stringify(slug)}`,
            `export const frontmatter = ${JSON.stringify(frontmatter)}`,
            `export const html = ${JSON.stringify(html)}`,
            `export const toc = ${JSON.stringify(toc)}`,
            `export default { slug, frontmatter, html, toc }`,
          ].join('\n')
        })()
      }
    },

    // dev 时增删改 posts/ 下的 md，自动刷新虚拟模块
    configureServer(server) {
      const invalidate = (file: string) => {
        if (!file.endsWith('.md') || !file.startsWith(postsDir)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', invalidate)
      server.watcher.on('change', invalidate)
      server.watcher.on('unlink', invalidate)
    },
  }
}
