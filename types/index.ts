/* ─── Difficulty ──────────────────────────────────────────────────────────── */
export type Difficulty = 'foundation' | 'intermediate' | 'advanced' | 'expert'

/* ─── Phase level ─────────────────────────────────────────────────────────── */
export type PhaseLevel = 'junior' | 'mid' | 'senior'

/* ─── Docs link ───────────────────────────────────────────────────────────── */
export interface DocsLinkItem {
  label: string
  url: string
}

/* ─── Phase metadata (_meta.json shape) ──────────────────────────────────── */
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

/* ─── Lesson frontmatter ──────────────────────────────────────────────────── */
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
}

/* ─── Full lesson (meta + phase context) ─────────────────────────────────── */
export interface Lesson extends LessonMeta {
  phaseSlug: string
  phaseNumber: number
  phaseTitle: string
}

/* ─── Phase with lessons ──────────────────────────────────────────────────── */
export interface Phase extends PhaseMeta {
  lessons: LessonMeta[]
}

/* ─── Challenge answer (Zustand store) ───────────────────────────────────── */
export interface ChallengeAnswer {
  challengeId: string
  correct: boolean
  answeredAt: number
  attempts: number
  selectedOption: number
}

/* ─── Progress store shape ────────────────────────────────────────────────── */
export interface ProgressState {
  completedLessons: string[]
  challengeAnswers: Record<string, ChallengeAnswer>
  bookmarkedLessons: string[]
  currentPhase: string | null
  currentLesson: string | null
  lastActiveAt: number
  streakDays: number

  markLessonComplete: (lessonId: string) => void
  unmarkLessonComplete: (lessonId: string) => void
  recordChallengeAnswer: (
    challengeId: string,
    selectedOption: number,
    correct: boolean
  ) => void
  toggleBookmark: (lessonId: string) => void
  setCurrentLesson: (phaseSlug: string, lessonSlug: string) => void
  updateStreak: () => void
  reset: () => void
  getPhaseProgress: (phaseSlug: string, totalLessons: number) => number
  getTotalProgress: (totalLessons: number) => number
  getWeakAreas: () => { phaseSlug: string; accuracy: number }[]
  getReviewQueue: () => ChallengeAnswer[]
}

/* ─── CodeChallenge / Quiz component props ────────────────────────────────── */
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

/* ─── Search index entry ──────────────────────────────────────────────────── */
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

/* ─── Callout variant ─────────────────────────────────────────────────────── */
export type CalloutType = 'info' | 'tip' | 'warning' | 'critical' | 'trap' | 'senior'

/* ─── Nav item ────────────────────────────────────────────────────────────── */
export interface NavItem {
  title: string
  href: string
  description?: string
}
