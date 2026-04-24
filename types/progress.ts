import type { ChallengeAnswer } from './challenge'

export type XPLevel = 'novice' | 'apprentice' | 'senior' | 'architect'

export interface UserPreferences {
  reduceMotion: boolean
  hudDimOnIdle: boolean
}

export interface BadgeDefinition {
  id: string
  title: string
  description: string
  icon: string
}

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
  recordChallengeAnswer: (challengeId: string, selectedOption: number, correct: boolean) => void
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
