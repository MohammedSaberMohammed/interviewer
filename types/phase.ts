import type { LessonMeta } from './lesson'

export type PhaseLevel = 'junior' | 'mid' | 'senior'

export interface PhaseMeta {
  slug: string
  number: number
  title: string
  subtitle: string
  level: PhaseLevel
  estimatedHours: number
  emoji: string
  color: string
  description: string
  prerequisites: string[]
  learningOutcomes: string[]
}

export interface Phase extends PhaseMeta {
  lessons: LessonMeta[]
}
