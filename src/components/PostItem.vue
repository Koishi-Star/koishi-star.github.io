<script setup lang="ts">
import type { PostMeta } from '@/types'

defineProps<{ post: PostMeta }>()

const fmt = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}
</script>

<template>
  <li class="post-item">
    <RouterLink :to="`/posts/${post.slug}`" class="post-item-title">
      {{ post.title }}
    </RouterLink>
    <p class="post-item-excerpt">{{ post.excerpt }}</p>
    <p class="post-item-meta">
      <time>{{ fmt(post.date) }}</time>
      <span v-if="post.langs?.includes('en')" class="lang-badge" title="English version available"
        >EN</span
      >
      <span v-for="t in post.tags" :key="t" class="tag"># {{ t }}</span>
    </p>
  </li>
</template>
