import type { Difficulty } from './content'

export interface SearchEntry {
  id: string
  title: string
  summary: string
  phaseSlug: string
  phaseTitle: string
  lessonSlug: string
  difficulty: Difficulty
  tags: string[]
  url: string
}
