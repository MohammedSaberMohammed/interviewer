import type { Difficulty, DocsLinkItem } from './content'

export interface ChallengeAnswer {
  challengeId: string
  correct: boolean
  answeredAt: number
  attempts: number
  selectedOption: number
}

export interface ExtractedChallenge {
  id: string
  type: 'challenge' | 'quiz'
  title?: string
  prompt?: string
  code?: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: Difficulty
  phaseSlug: string
  lessonSlug: string
  lessonTitle: string
  phaseTitle: string
  phaseNumber: number
}

export interface ChallengeMeta {
  id: string
  difficulty: Difficulty
  prompt: string
  code?: string
  language?: string
  options: string[]
  correctAnswer: number
  explanation: string
  hints?: string[]
  docsLinks?: DocsLinkItem[]
}
