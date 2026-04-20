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
  questMode?: boolean // enables step-by-step quest rendering
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

/* ─── Gamification level ──────────────────────────────────────────────────── */
export type XPLevel = 'novice' | 'apprentice' | 'senior' | 'architect'

/* ─── User preferences ────────────────────────────────────────────────────── */
export interface UserPreferences {
  readAsArticle: boolean
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
  // ── Core progress ─────────────────────────────────────────────────────────
  completedLessons: string[]
  challengeAnswers: Record<string, ChallengeAnswer>
  bookmarkedLessons: string[]
  currentPhase: string | null
  currentLesson: string | null
  lastActiveAt: number

  // ── XP ────────────────────────────────────────────────────────────────────
  xpTotal: number
  xpToday: number
  xpByLesson: Record<string, number>

  // ── Streak ────────────────────────────────────────────────────────────────
  streakDays: number
  streakFreezeCount: number
  lastActiveDate: string | null // 'YYYY-MM-DD' local

  // ── Level ─────────────────────────────────────────────────────────────────
  level: XPLevel

  // ── Daily goal ────────────────────────────────────────────────────────────
  dailyGoal: number
  lessonsCompletedToday: number
  lastDailyReset: string | null // 'YYYY-MM-DD'

  // ── Badges ────────────────────────────────────────────────────────────────
  unlockedBadges: string[]

  // ── Preferences ───────────────────────────────────────────────────────────
  preferences: UserPreferences

  // ── Core actions ──────────────────────────────────────────────────────────
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

  // ── Gamification actions ──────────────────────────────────────────────────
  awardXP: (amount: number, reason: string) => void
  recordLessonComplete: (phaseSlug: string, lessonSlug: string, accuracy: number) => void
  checkStreak: () => void
  useStreakFreeze: () => boolean
  unlockBadge: (badgeId: string) => void
  setReadAsArticle: (on: boolean) => void
  resetDailyCounters: () => void

  // ── Selectors ─────────────────────────────────────────────────────────────
  getPhaseProgress: (phaseSlug: string, totalLessons: number) => number
  getTotalProgress: (totalLessons: number) => number
  getWeakAreas: () => { phaseSlug: string; accuracy: number }[]
  getReviewQueue: () => ChallengeAnswer[]
  getXPToNextLevel: () => number
  getLevelProgress: () => number // 0–100
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

/* ─── Basket ──────────────────────────────────────────────────────────────── */
export interface Basket {
  id: string
  name: string
  createdAt: number
  questionIds: string[] // ordered list
}

export interface BasketQuestion {
  id: string           // e.g. "01-csharp-core/clr-cts-cls/challenge-1"
  type: 'challenge' | 'quiz'
  title: string        // "Code Challenge" or "Quiz"
  question: string     // the prompt/question text
  options: string[]
  correctAnswer: number
  explanation: string
  code?: string
  language?: string
  difficulty: string
  lessonSlug: string
  phaseSlug: string
  lessonTitle: string
  phaseTitle: string
  phaseNumber: number
  addedAt: number
}
