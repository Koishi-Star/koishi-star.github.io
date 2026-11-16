/// <reference types="vite/client" />

declare module 'virtual:posts' {
  import type { PostMeta } from '@/types'
  export const posts: PostMeta[]
}

declare module '*.md' {
  export const slug: string
  export const frontmatter: {
    title?: string
    excerpt?: string
    date?: string
    tags?: string[] | string
    [key: string]: unknown
  }
  export const html: string
}
