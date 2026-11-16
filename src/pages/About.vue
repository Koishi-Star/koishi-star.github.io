<script setup lang="ts">
import { onMounted, ref } from 'vue'

const html = ref('')
const modules = import.meta.glob('/pages/*.md')

onMounted(async () => {
  const loader = modules['/pages/about.md']
  if (loader) {
    const mod = await loader()
    html.value = mod.html
  }
})
</script>

<template>
  <article class="about prose" v-html="html" />
</template>
