import type { Difficulty, DocsLinkItem } from './content'

export interface LessonMeta {
  title: string
  slug: string
  order: number
  difficulty: Difficulty
  readingTime: number
  status: 'draft' | 'published'
  tags: string[]
  summary: string
  docsLinks: DocsLinkItem[]
  questMode?: boolean
}

export interface Lesson extends LessonMeta {
  phaseSlug: string
  phaseNumber: number
  phaseTitle: string
}
