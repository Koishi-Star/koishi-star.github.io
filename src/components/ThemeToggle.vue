<script setup lang="ts">
import { computed, ref } from 'vue'

// 明暗切换：状态就是 html.dark 这个 class，选择存 localStorage。
// 首帧默认值由 index.html 里的内联脚本决定，这里只负责切换。
// 图标用内联 SVG，避免 ☾ 之类字符在缺字体的系统上渲染异常。
const dark = ref(document.documentElement.classList.contains('dark'))
const toggle = () => {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
  localStorage.setItem('theme', dark.value ? 'dark' : 'light')
}
const label = computed(() => (dark.value ? '切换到亮色主题' : '切换到暗色主题'))
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :title="label"
    :aria-label="label"
    @click="toggle"
  >
    <!-- 亮色模式下显示月亮（点击进入暗色），暗色模式下显示太阳 -->
    <svg v-if="!dark" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
    <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  </button>
</template>
