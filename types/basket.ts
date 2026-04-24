export interface Basket {
  id: string
  name: string
  createdAt: number
  questionIds: string[]
}

export interface BasketQuestion {
  id: string           // e.g. "01-csharp-core/clr-cts-cls/challenge-1" or "phaseSlug/lessonSlug"
  type: 'challenge' | 'quiz' | 'lesson'
  title: string        // "Code Challenge", "Quiz", or lesson title
  question?: string    // challenge/quiz: the prompt text
  options?: string[]   // challenge/quiz only
  correctAnswer?: number
  explanation?: string
  code?: string
  language?: string
  summary?: string     // lesson type: lesson summary
  difficulty: string
  lessonSlug: string
  phaseSlug: string
  lessonTitle: string
  phaseTitle: string
  phaseNumber: number
  addedAt: number
}
