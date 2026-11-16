<script setup lang="ts">
import { site } from '@/site.config'
</script>

<template>
  <section class="not-found">
    <h1>404</h1>
    <p>这一页被泡泡带走了。</p>
    <RouterLink to="/">{{ site.title }} · 回首页</RouterLink>
  </section>
</template>
