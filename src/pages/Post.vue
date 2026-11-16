<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
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
const missing = ref(false)

const fmt = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
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
  missing.value = false
}

watch(() => route.params.slug, load, { immediate: true })

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
    <!-- 内容是自己 markdown 管线构建期生成的静态 HTML，无用户输入，v-html 安全 -->
    <div class="prose" v-html="html" />
  </article>
  <NotFound v-else />
</template>
