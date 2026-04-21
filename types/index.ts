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
  resetDailyCounters: () => void

  // ── Selectors ─────────────────────────────────────────────────────────────
  getPhaseProgress: (phaseSlug: string, totalLessons: number) => number
  getTotalProgress: (totalLessons: number) => number
  getWeakAreas: () => { phaseSlug: string; accuracy: number }[]
  getReviewQueue: () => ChallengeAnswer[]
  getXPToNextLevel: () => number
  getLevelProgress: () => number // 0–100
}

/* ─── Extracted challenge (parsed from MDX source) ───────────────────────── */
export interface ExtractedChallenge {
  id: string
  type: 'challenge' | 'quiz'
  title?: string
  prompt?: string        // description/question text
  code?: string          // CodeChallenge only
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
  id: string           // e.g. "01-csharp-core/clr-cts-cls/challenge-1" or "phaseSlug/lessonSlug"
  type: 'challenge' | 'quiz' | 'lesson'
  title: string        // "Code Challenge", "Quiz", or lesson title
  question?: string    // challenge/quiz: the prompt text
  options?: string[]   // challenge/quiz only
  correctAnswer?: number // challenge/quiz only
  explanation?: string // challenge/quiz only
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
