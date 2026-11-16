import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { markdownPlugin } from './plugins/markdown'

export default defineConfig({
  // 用户站 koishi-star.github.io 部署在根路径；若以后改项目站，需把这里改成分路径如 '/blog/'
  base: '/',
  plugins: [vue(), markdownPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
