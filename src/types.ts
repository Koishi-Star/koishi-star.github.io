/** 文章元数据（virtual:posts 导出的每一项） */
export interface PostMeta {
  slug: string
  title: string
  excerpt: string
  /** ISO 格式，渲染时再格式化 */
  date: string
  tags: string[]
  year: number
  /** 该文章现有的语言版本（zh / en） */
  langs: ('zh' | 'en')[]
}
