<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/site.config'
import NotFound from './NotFound.vue'

// 懒加载全部文章模块：只有访问到的那篇才会被打包请求
// posts/<slug>.md 为中文版，posts/<slug>.en.md 为英文版
const modules = import.meta.glob(['/posts/*.md', '!/posts/_*.md'])

type Lang = 'zh' | 'en'

const route = useRoute()
const html = ref('')
const title = ref('')
const date = ref('')
const tags = ref<string[]>([])
const toc = ref<{ id: string; level: number; text: string }[]>([])
const langs = ref<Lang[]>([])
const lang = ref<Lang>('zh')
const missing = ref(false)
const activeId = ref('')
const proseEl = ref<HTMLElement | null>(null)

const fmt = (iso: string, l: Lang) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (l === 'en')
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d)
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

// 该文章现有的语言版本
const availableLangs = (slug: string): Lang[] => {
  const list: Lang[] = []
  if (modules[`/posts/${slug}.md`]) list.push('zh')
  if (modules[`/posts/${slug}.en.md`]) list.push('en')
  return list
}

const applyModule = (mod: Awaited<ReturnType<(typeof modules)[string]>>, l: Lang) => {
  html.value = mod.html
  title.value = (mod.frontmatter.title as string) ?? mod.slug
  date.value = fmt((mod.frontmatter.date as string) ?? '', l)
  const raw = mod.frontmatter.tags
  tags.value = Array.isArray(raw) ? raw : []
  toc.value = mod.toc
  lang.value = l
  document.documentElement.lang = l === 'en' ? 'en' : 'zh-CN'
}

const load = async (pref?: Lang) => {
  const slug = String(route.params.slug)
  const list = availableLangs(slug)
  langs.value = list
  if (!list.length) {
    missing.value = true
    return
  }
  // 优先用用户上次选择的语言，其次默认中文
  const target = pref && list.includes(pref) ? pref : list.includes('zh') ? 'zh' : 'en'
  const loader =
    target === 'en' ? modules[`/posts/${slug}.en.md`] : modules[`/posts/${slug}.md`]
  const mod = await loader!()
  applyModule(mod, target)
  missing.value = false
}

const switchLang = (l: Lang) => {
  if (l === lang.value || !langs.value.includes(l)) return
  sessionStorage.setItem('lang', l)
  load(l)
}

watch(
  () => route.params.slug,
  () => load((sessionStorage.getItem('lang') as Lang | null) ?? undefined),
  { immediate: true },
)
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
      <div class="post-meta-row">
        <p class="post-meta">
          <time>{{ date }}</time>
          <template v-if="tags.length">
            <span v-for="t in tags" :key="t" class="tag"># {{ t }}</span>
          </template>
        </p>
        <div v-if="langs.length > 1" class="lang-switch" role="group" aria-label="Language">
          <button type="button" :class="{ active: lang === 'zh' }" @click="switchLang('zh')">
            中
          </button>
          <button type="button" :class="{ active: lang === 'en' }" @click="switchLang('en')">
            EN
          </button>
        </div>
      </div>
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
