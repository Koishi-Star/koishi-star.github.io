<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/site.config'
import NotFound from './NotFound.vue'

// 懒加载全部文章模块：只有访问到的那篇才会被打包请求
const modules = import.meta.glob(['/posts/*.md', '!/posts/_*.md'])

const route = useRoute()
const html = ref('')
const title = ref('')
const date = ref('')
const tags = ref<string[]>([])
const toc = ref<{ id: string; level: number; text: string }[]>([])
const missing = ref(false)
const activeId = ref('')
const proseEl = ref<HTMLElement | null>(null)

const fmt = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

// ---- 目录滚动高亮：当前章节 = 最后一个滚过视口顶部基准线的标题 ----
let spyHeadings: HTMLElement[] = []

const onScroll = () => {
  let current = ''
  for (const h of spyHeadings) {
    if (h.getBoundingClientRect().top <= 140) current = h.id
    else break
  }
  if (current) activeId.value = current
}

const setupSpy = async () => {
  await nextTick()
  if (!proseEl.value) return
  spyHeadings = [
    ...proseEl.value.querySelectorAll('h1[id],h2[id],h3[id],h4[id]'),
  ] as HTMLElement[]
  onScroll()
}
window.addEventListener('scroll', onScroll, { passive: true })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const jump = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeId.value = id
}

const load = async () => {
  const loader = modules[`/posts/${route.params.slug}.md`]
  if (!loader) {
    missing.value = true
    return
  }
  const mod = await loader()
  html.value = mod.html
  title.value = (mod.frontmatter.title as string) ?? String(route.params.slug)
  date.value = fmt((mod.frontmatter.date as string) ?? '')
  const raw = mod.frontmatter.tags
  tags.value = Array.isArray(raw) ? raw : []
  toc.value = mod.toc
  missing.value = false
}

watch(() => route.params.slug, load, { immediate: true })
// 内容更新后重新挂载滚动监听
watch(html, () => setupSpy())

// 同步浏览器标签页标题
watchEffect(() => {
  if (title.value) document.title = `${title.value} · ${site.title}`
})
</script>

<template>
  <article v-if="!missing" class="post">
    <header class="post-header">
      <h1>{{ title }}</h1>
      <p class="post-meta">
        <time>{{ date }}</time>
        <template v-if="tags.length">
          <span v-for="t in tags" :key="t" class="tag"># {{ t }}</span>
        </template>
      </p>
    </header>
    <div class="post-body">
      <!-- 内容是自己 markdown 管线构建期生成的静态 HTML，无用户输入，v-html 安全 -->
      <div ref="proseEl" class="prose" v-html="html" />
      <nav v-if="toc.length >= 4" class="post-toc" aria-label="目录">
        <p class="post-toc-title">目录</p>
        <a
          v-for="t in toc"
          :key="t.id"
          :href="`#${t.id}`"
          :class="[`toc-l${t.level}`, { active: activeId === t.id }]"
          @click.prevent="jump(t.id)"
        >
          {{ t.text }}
        </a>
      </nav>
    </div>
  </article>
  <NotFound v-else />
</template>
