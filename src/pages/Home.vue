<script setup lang="ts">
import { computed, ref } from 'vue'
import { posts } from 'virtual:posts'
import type { PostMeta } from '@/types'
import PostItem from '@/components/PostItem.vue'

// 标签筛选（客户端过滤，不额外发请求）
const activeTag = ref<string | null>(null)
const allTags = computed(() => [...new Set(posts.flatMap((p) => p.tags))].sort())
const filtered = computed(() =>
  activeTag.value ? posts.filter((p) => p.tags.includes(activeTag.value!)) : posts,
)

// 按年份分组展示
const groups = computed(() => {
  const map = new Map<number, PostMeta[]>()
  for (const p of filtered.value) {
    if (!map.has(p.year)) map.set(p.year, [])
    map.get(p.year)!.push(p)
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0])
})
</script>

<template>
  <section class="home">
    <nav v-if="allTags.length" class="tag-bar">
      <button type="button" :class="{ active: !activeTag }" @click="activeTag = null">全部</button>
      <button
        v-for="t in allTags"
        :key="t"
        type="button"
        :class="{ active: t === activeTag }"
        @click="activeTag = t"
      >
        {{ t }}
      </button>
    </nav>

    <div v-for="[year, list] in groups" :key="year" class="year-group">
      <h2 class="year">{{ year }}</h2>
      <ul class="post-list">
        <PostItem v-for="p in list" :key="p.slug" :post="p" />
      </ul>
    </div>

    <p v-if="!filtered.length" class="empty">这里还没有文章。</p>
  </section>
</template>
