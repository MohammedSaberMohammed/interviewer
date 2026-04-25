/* ─── Difficulty ──────────────────────────────────────────────────────────── */
export type Difficulty = 'foundation' | 'intermediate' | 'advanced' | 'expert'

/* ─── Phase level ─────────────────────────────────────────────────────────── */
export type PhaseLevel = 'junior' | 'mid' | 'senior'

/* ─── Docs link ───────────────────────────────────────────────────────────── */
export interface DocsLinkItem {
  label: string
  url: string
}

/* ─── Technology metadata (_tech.json shape) ─────────────────────────────── */
export interface TechnologyMeta {
  slug: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  status: 'active' | 'coming-soon'
  order: number
  defaultLanguage: string
  docsBaseUrl: string
  keywords: string[]
  estimatedTotalHours: number
}

/* ─── Per-technology progress ─────────────────────────────────────────────── */
export interface TechnologyProgress {
  completedLessons: string[]
  challengeAnswers: Record<string, ChallengeAnswer>
  bookmarkedLessons: string[]
  xpTotal: number
  xpToday: number
  xpByLesson: Record<string, number>
  level: XPLevel
  unlockedBadges: string[]
  currentPhase: string | null
  currentLesson: string | null
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
  questMode?: boolean // enables step-by-step quest rendering
}

/* ─── Full lesson (meta + phase context) ─────────────────────────────────── */
export interface Lesson extends LessonMeta {
  techSlug: string
  techTitle: string
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

/* ─── Gamification level ──────────────────────────────────────────────────── */
export type XPLevel = 'novice' | 'apprentice' | 'senior' | 'architect'

/* ─── User preferences ────────────────────────────────────────────────────── */
export interface UserPreferences {
  reduceMotion: boolean
  hudDimOnIdle: boolean
}

/* ─── Badge definition ────────────────────────────────────────────────────── */
export interface BadgeDefinition {
  id: string
  title: string
  description: string
  icon: string
}

/* ─── Progress store shape ────────────────────────────────────────────────── */
export interface ProgressState {
  // ── Global (shared across all technologies) ────────────────────────────────
  streakDays: number
  streakFreezeCount: number
  lastActiveDate: string | null // 'YYYY-MM-DD' local
  dailyGoal: number
  lessonsCompletedToday: number
  lastDailyReset: string | null // 'YYYY-MM-DD'
  preferences: UserPreferences
  lastActiveAt: number

  // ── Per-technology ─────────────────────────────────────────────────────────
  technologies: Record<string, TechnologyProgress>

  // ── Core actions (all take techSlug as first param) ───────────────────────
  markLessonComplete: (techSlug: string, lessonId: string) => void
  unmarkLessonComplete: (techSlug: string, lessonId: string) => void
  recordChallengeAnswer: (
    techSlug: string,
    challengeId: string,
    selectedOption: number,
    correct: boolean
  ) => void
  toggleBookmark: (techSlug: string, lessonId: string) => void
  setCurrentLesson: (techSlug: string, phaseSlug: string, lessonSlug: string) => void
  reset: () => void

  // ── Gamification actions ──────────────────────────────────────────────────
  awardXP: (techSlug: string, amount: number, reason: string) => void
  recordLessonComplete: (techSlug: string, phaseSlug: string, lessonSlug: string, accuracy: number) => void
  checkStreak: () => void
  useStreakFreeze: () => boolean
  unlockBadge: (techSlug: string, badgeId: string) => void
  resetDailyCounters: () => void

  // ── Selectors (take techSlug) ─────────────────────────────────────────────
  getPhaseProgress: (techSlug: string, phaseSlug: string, totalLessons: number) => number
  getTotalProgress: (techSlug: string, totalLessons: number) => number
  getWeakAreas: (techSlug: string) => { phaseSlug: string; accuracy: number }[]
  getReviewQueue: (techSlug: string) => ChallengeAnswer[]
  getXPToNextLevel: (techSlug: string) => number
  getLevelProgress: (techSlug: string) => number
}

/* ─── Extracted challenge (parsed from MDX source) ───────────────────────── */
export interface ExtractedChallenge {
  id: string
  type: 'challenge' | 'quiz'
  title?: string
  prompt?: string        // description/question text
  code?: string          // CodeChallenge only
  language?: string      // code language (defaults to tech's defaultLanguage)
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: Difficulty
  techSlug: string
  techTitle: string
  phaseSlug: string
  lessonSlug: string
  lessonTitle: string
  phaseTitle: string
  phaseNumber: number
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
  techSlug: string
  techTitle: string
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

/* ─── Basket ──────────────────────────────────────────────────────────────── */
export interface Basket {
  id: string
  name: string
  createdAt: number
  questionIds: string[]
  techSlug: string
}

export interface BasketQuestion {
  id: string
  type: 'challenge' | 'quiz' | 'lesson'
  title: string
  question?: string
  options?: string[]
  correctAnswer?: number
  explanation?: string
  code?: string
  language?: string
  summary?: string
  difficulty: string
  lessonSlug: string
  phaseSlug: string
  techSlug: string
  lessonTitle: string
  phaseTitle: string
  phaseNumber: number
  addedAt: number
}
