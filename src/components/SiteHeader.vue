<script setup lang="ts">
import { useRoute } from 'vue-router'
import { site } from '@/site.config'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
</script>

<template>
  <header class="site-header">
    <div class="site-brand">
      <RouterLink to="/" class="site-title">{{ site.title }}</RouterLink>
      <p class="site-subtitle">{{ site.subtitle }}</p>
    </div>
    <nav class="site-nav">
      <RouterLink to="/" :class="{ active: route.name === 'home' }">首页</RouterLink>
      <RouterLink to="/about" :class="{ active: route.name === 'about' }">关于</RouterLink>
      <ThemeToggle />
    </nav>
  </header>
</template>
