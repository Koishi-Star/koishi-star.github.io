<script setup lang="ts">
import { site } from '@/site.config'
</script>

<template>
  <footer class="site-footer">
    <span>{{ site.footer }}</span>
    <a :href="site.github" target="_blank" rel="noopener noreferrer">GitHub</a>
  </footer>
</template>
