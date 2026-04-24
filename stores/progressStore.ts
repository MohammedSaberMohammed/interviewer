import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  PROGRESS_STORAGE_KEY,
  XP_LEVELS,
  XP_AWARDS,
  DEFAULT_DAILY_GOAL,
  MAX_STREAK_FREEZES,
  FREEZE_EARN_INTERVAL,
} from '@/lib/constants'
import type { ChallengeAnswer } from '@/types/challenge'
import type { ProgressState, XPLevel, UserPreferences } from '@/types/progress'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function todayLocal(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function calcLevel(xp: number): XPLevel {
  if (xp >= XP_LEVELS.architect.min) return 'architect'
  if (xp >= XP_LEVELS.senior.min) return 'senior'
  if (xp >= XP_LEVELS.apprentice.min) return 'apprentice'
  return 'novice'
}

function xpToNextLevel(xp: number): number {
  const level = calcLevel(xp)
  if (level === 'architect') return 0
  const thresholds: XPLevel[] = ['novice', 'apprentice', 'senior', 'architect']
  const next = thresholds[thresholds.indexOf(level) + 1] as XPLevel
  return XP_LEVELS[next].min - xp
}

function levelProgress(xp: number): number {
  const level = calcLevel(xp)
  if (level === 'architect') return 100
  const { min } = XP_LEVELS[level]
  const thresholds: XPLevel[] = ['novice', 'apprentice', 'senior', 'architect']
  const next = thresholds[thresholds.indexOf(level) + 1] as XPLevel
  const range = XP_LEVELS[next].min - min
  return Math.round(((xp - min) / range) * 100)
}

/* ─── Default state ─────────────────────────────────────────────────────── */

const DEFAULT_PREFERENCES: UserPreferences = {
  reduceMotion: false,
  hudDimOnIdle: true,
}

const GAMIFICATION_DEFAULTS = {
  xpTotal: 0,
  xpToday: 0,
  xpByLesson: {} as Record<string, number>,
  streakFreezeCount: 0,
  lastActiveDate: null as string | null,
  level: 'novice' as XPLevel,
  dailyGoal: DEFAULT_DAILY_GOAL,
  lessonsCompletedToday: 0,
  lastDailyReset: null as string | null,
  unlockedBadges: [] as string[],
  preferences: DEFAULT_PREFERENCES,
}

/* ─── Store ─────────────────────────────────────────────────────────────── */

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      /* ── State ──────────────────────────────────────────────────────────── */
      completedLessons: [],
      challengeAnswers: {},
      bookmarkedLessons: [],
      currentPhase: null,
      currentLesson: null,
      lastActiveAt: 0,
      streakDays: 0,
      ...GAMIFICATION_DEFAULTS,

      /* ── Core actions ───────────────────────────────────────────────────── */
      markLessonComplete: (lessonId) =>
        set((state) => ({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
        })),

      unmarkLessonComplete: (lessonId) =>
        set((state) => ({
          completedLessons: state.completedLessons.filter((id) => id !== lessonId),
        })),

      recordChallengeAnswer: (challengeId, selectedOption, correct) =>
        set((state) => {
          const existing = state.challengeAnswers[challengeId]
          const updated: ChallengeAnswer = {
            challengeId,
            correct,
            answeredAt: Date.now(),
            attempts: (existing?.attempts ?? 0) + 1,
            selectedOption,
          }
          return {
            challengeAnswers: { ...state.challengeAnswers, [challengeId]: updated },
          }
        }),

      toggleBookmark: (lessonId) =>
        set((state) => ({
          bookmarkedLessons: state.bookmarkedLessons.includes(lessonId)
            ? state.bookmarkedLessons.filter((id) => id !== lessonId)
            : [...state.bookmarkedLessons, lessonId],
        })),

      setCurrentLesson: (phaseSlug, lessonSlug) =>
        set({ currentPhase: phaseSlug, currentLesson: lessonSlug }),

      // Legacy streak — kept for backward compat; checkStreak is now authoritative
      updateStreak: () => {
        const now = Date.now()
        const { lastActiveAt, streakDays } = get()
        const daysSinceLast = (now - lastActiveAt) / ONE_DAY_MS

        if (daysSinceLast < 1) {
          set({ lastActiveAt: now })
        } else if (daysSinceLast < 2) {
          set({ lastActiveAt: now, streakDays: streakDays + 1 })
        } else {
          set({ lastActiveAt: now, streakDays: 1 })
        }
      },

      reset: () =>
        set({
          completedLessons: [],
          challengeAnswers: {},
          bookmarkedLessons: [],
          currentPhase: null,
          currentLesson: null,
          lastActiveAt: 0,
          streakDays: 0,
          ...GAMIFICATION_DEFAULTS,
        }),

      /* ── Gamification actions ───────────────────────────────────────────── */

      awardXP: (amount, _reason) => {
        const { xpTotal, xpToday, level } = get()
        const newTotal = xpTotal + amount
        const newLevel = calcLevel(newTotal)
        set({
          xpTotal: newTotal,
          xpToday: xpToday + amount,
          level: newLevel,
        })
        // Level-up event is dispatched to the window so UI can react
        if (typeof window !== 'undefined' && newLevel !== level) {
          window.dispatchEvent(
            new CustomEvent('xp:levelup', { detail: { from: level, to: newLevel, xpTotal: newTotal } })
          )
        }
        // XP toast event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('xp:award', { detail: { amount, reason: _reason } }))
        }
      },

      recordLessonComplete: (phaseSlug, lessonSlug, accuracy) => {
        const state = get()
        const lessonId = `${phaseSlug}/${lessonSlug}`
        const today = todayLocal()

        // Reset daily counters if needed
        if (state.lastDailyReset !== today) {
          set({ lessonsCompletedToday: 0, xpToday: 0, lastDailyReset: today })
        }

        const alreadyCompleted = state.completedLessons.includes(lessonId)
        const lessonXP = alreadyCompleted ? 0 : XP_AWARDS.LESSON_COMPLETE

        // Mark lesson complete
        if (!alreadyCompleted) {
          set((s) => ({
            completedLessons: [...s.completedLessons, lessonId],
            xpByLesson: { ...s.xpByLesson, [lessonId]: (s.xpByLesson[lessonId] ?? 0) + lessonXP },
            lessonsCompletedToday: s.lessonsCompletedToday + 1,
          }))
        }

        // Award lesson XP
        if (lessonXP > 0) {
          get().awardXP(lessonXP, 'Lesson complete')
        }

        // Check daily goal
        const { lessonsCompletedToday, dailyGoal } = get()
        if (!alreadyCompleted && lessonsCompletedToday >= dailyGoal) {
          get().awardXP(XP_AWARDS.DAILY_GOAL_MET, 'Daily goal met!')
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('xp:dailygoal', { detail: { goal: dailyGoal } }))
          }
        }

        // Check phase completion
        const phaseCompleted = get()
          .completedLessons
          .filter((id) => id.startsWith(`${phaseSlug}/`))
        const allPhaseIds = phaseCompleted // used for badge checks below

        // Unlock phase-completion badge checks happen via badge system listeners
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('lesson:complete', {
              detail: { phaseSlug, lessonSlug, accuracy, completedLessons: get().completedLessons },
            })
          )
        }

        // Update streak
        get().checkStreak()
      },

      checkStreak: () => {
        const { lastActiveDate, streakDays, streakFreezeCount } = get()
        const today = todayLocal()

        if (lastActiveDate === today) {
          // Already counted today — no change
          return
        }

        if (lastActiveDate === null) {
          // First ever activity
          set({ streakDays: 1, lastActiveDate: today })
          return
        }

        // Compute how many days since last active
        const last = new Date(lastActiveDate)
        const now = new Date(today)
        const diffDays = Math.round((now.getTime() - last.getTime()) / ONE_DAY_MS)

        if (diffDays === 1) {
          // Active yesterday — extend streak
          const newStreak = streakDays + 1
          // Earn a freeze every FREEZE_EARN_INTERVAL days, up to MAX
          const earnedFreeze = newStreak % FREEZE_EARN_INTERVAL === 0
          const newFreezeCount = earnedFreeze
            ? Math.min(streakFreezeCount + 1, MAX_STREAK_FREEZES)
            : streakFreezeCount
          set({ streakDays: newStreak, lastActiveDate: today, streakFreezeCount: newFreezeCount })
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('streak:earned', { detail: { streakDays: newStreak } }))
          }
        } else if (diffDays === 2 && streakFreezeCount > 0) {
          // Missed exactly one day but has a freeze — auto-use it
          const newStreak = streakDays + 1
          const newFreezeCount = streakFreezeCount - 1
          set({ streakDays: newStreak, lastActiveDate: today, streakFreezeCount: newFreezeCount })
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('streak:freeze-used', { detail: { remaining: newFreezeCount } }))
            window.dispatchEvent(new CustomEvent('streak:earned', { detail: { streakDays: newStreak } }))
          }
        } else {
          // Missed a day with no freeze — streak broken
          if (typeof window !== 'undefined' && streakDays > 0) {
            window.dispatchEvent(new CustomEvent('streak:broken', { detail: { previous: streakDays } }))
          }
          set({ streakDays: 1, lastActiveDate: today })
        }
      },

      useStreakFreeze: () => {
        const { streakFreezeCount } = get()
        if (streakFreezeCount <= 0) return false
        set({ streakFreezeCount: streakFreezeCount - 1 })
        return true
      },

      unlockBadge: (badgeId) => {
        const { unlockedBadges } = get()
        if (unlockedBadges.includes(badgeId)) return
        set({ unlockedBadges: [...unlockedBadges, badgeId] })
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('badge:unlocked', { detail: { badgeId } }))
        }
      },

      resetDailyCounters: () =>
        set({ lessonsCompletedToday: 0, xpToday: 0, lastDailyReset: todayLocal() }),

      /* ── Selectors ──────────────────────────────────────────────────────── */
      getPhaseProgress: (phaseSlug, totalLessons) => {
        if (totalLessons === 0) return 0
        const { completedLessons } = get()
        const phaseCompleted = completedLessons.filter((id) =>
          id.startsWith(`${phaseSlug}/`)
        ).length
        return Math.round((phaseCompleted / totalLessons) * 100)
      },

      getTotalProgress: (totalLessons) => {
        if (totalLessons === 0) return 0
        const { completedLessons } = get()
        return Math.round((completedLessons.length / totalLessons) * 100)
      },

      getWeakAreas: () => {
        const { challengeAnswers } = get()
        const phaseMap: Record<string, { correct: number; total: number }> = {}

        for (const answer of Object.values(challengeAnswers)) {
          const phaseSlug = answer.challengeId.split('/')[0]
          if (!phaseSlug) continue
          if (!phaseMap[phaseSlug]) phaseMap[phaseSlug] = { correct: 0, total: 0 }
          phaseMap[phaseSlug].total += 1
          if (answer.correct) phaseMap[phaseSlug].correct += 1
        }

        return Object.entries(phaseMap)
          .map(([phaseSlug, { correct, total }]) => ({
            phaseSlug,
            accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
          }))
          .filter(({ accuracy }) => accuracy < 70)
          .sort((a, b) => a.accuracy - b.accuracy)
      },

      getReviewQueue: () => {
        const { challengeAnswers } = get()
        return Object.values(challengeAnswers)
          .filter((a) => !a.correct)
          .sort((a, b) => b.answeredAt - a.answeredAt)
          .slice(0, 20)
      },

      getXPToNextLevel: () => xpToNextLevel(get().xpTotal),
      getLevelProgress: () => levelProgress(get().xpTotal),
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          }
        }
        return localStorage
      }),
      skipHydration: true,
      // Migrate old persisted state — silently fill missing gamification fields
      merge: (persisted: unknown, current: ProgressState) => {
        const p = (persisted ?? {}) as Partial<ProgressState>
        return {
          ...current,
          ...p,
          // Ensure gamification fields have defaults if missing in old data
          xpTotal:               p.xpTotal               ?? 0,
          xpToday:               p.xpToday               ?? 0,
          xpByLesson:            p.xpByLesson            ?? {},
          streakFreezeCount:     p.streakFreezeCount     ?? 0,
          lastActiveDate:        p.lastActiveDate        ?? null,
          level:                 p.level                 ?? calcLevel(p.xpTotal ?? 0),
          dailyGoal:             p.dailyGoal             ?? DEFAULT_DAILY_GOAL,
          lessonsCompletedToday: p.lessonsCompletedToday ?? 0,
          lastDailyReset:        p.lastDailyReset        ?? null,
          unlockedBadges:        p.unlockedBadges        ?? [],
          preferences:           { ...DEFAULT_PREFERENCES, ...(p.preferences ?? {}) },
        }
      },
    }
  )
)
