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
import type { ChallengeAnswer, ProgressState, TechnologyProgress, XPLevel, UserPreferences } from '@/types'

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

/* ─── Defaults ──────────────────────────────────────────────────────────── */

const DEFAULT_PREFERENCES: UserPreferences = {
  reduceMotion: false,
  hudDimOnIdle: true,
}

function defaultTechProgress(): TechnologyProgress {
  return {
    completedLessons: [],
    challengeAnswers: {},
    bookmarkedLessons: [],
    xpTotal: 0,
    xpToday: 0,
    xpByLesson: {},
    level: 'novice',
    unlockedBadges: [],
    currentPhase: null,
    currentLesson: null,
  }
}

/* ─── Helper to ensure tech entry exists ────────────────────────────────── */

function ensureTech(technologies: Record<string, TechnologyProgress>, techSlug: string): TechnologyProgress {
  return technologies[techSlug] ?? defaultTechProgress()
}

/* ─── Store ─────────────────────────────────────────────────────────────── */

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      /* ── Global state ───────────────────────────────────────────────────── */
      streakDays: 0,
      streakFreezeCount: 0,
      lastActiveDate: null,
      dailyGoal: DEFAULT_DAILY_GOAL,
      lessonsCompletedToday: 0,
      lastDailyReset: null,
      preferences: DEFAULT_PREFERENCES,
      lastActiveAt: 0,

      /* ── Per-technology state ────────────────────────────────────────────── */
      technologies: {},

      /* ── Core actions ───────────────────────────────────────────────────── */

      markLessonComplete: (techSlug, lessonId) =>
        set((state) => {
          const tech = ensureTech(state.technologies, techSlug)
          if (tech.completedLessons.includes(lessonId)) return {}
          return {
            technologies: {
              ...state.technologies,
              [techSlug]: {
                ...tech,
                completedLessons: [...tech.completedLessons, lessonId],
              },
            },
          }
        }),

      unmarkLessonComplete: (techSlug, lessonId) =>
        set((state) => {
          const tech = ensureTech(state.technologies, techSlug)
          return {
            technologies: {
              ...state.technologies,
              [techSlug]: {
                ...tech,
                completedLessons: tech.completedLessons.filter((id) => id !== lessonId),
              },
            },
          }
        }),

      recordChallengeAnswer: (techSlug, challengeId, selectedOption, correct) =>
        set((state) => {
          const tech = ensureTech(state.technologies, techSlug)
          const existing = tech.challengeAnswers[challengeId]
          const updated: ChallengeAnswer = {
            challengeId,
            correct,
            answeredAt: Date.now(),
            attempts: (existing?.attempts ?? 0) + 1,
            selectedOption,
          }
          return {
            technologies: {
              ...state.technologies,
              [techSlug]: {
                ...tech,
                challengeAnswers: { ...tech.challengeAnswers, [challengeId]: updated },
              },
            },
          }
        }),

      toggleBookmark: (techSlug, lessonId) =>
        set((state) => {
          const tech = ensureTech(state.technologies, techSlug)
          const bookmarked = tech.bookmarkedLessons.includes(lessonId)
          return {
            technologies: {
              ...state.technologies,
              [techSlug]: {
                ...tech,
                bookmarkedLessons: bookmarked
                  ? tech.bookmarkedLessons.filter((id) => id !== lessonId)
                  : [...tech.bookmarkedLessons, lessonId],
              },
            },
          }
        }),

      setCurrentLesson: (techSlug, phaseSlug, lessonSlug) =>
        set((state) => {
          const tech = ensureTech(state.technologies, techSlug)
          return {
            technologies: {
              ...state.technologies,
              [techSlug]: { ...tech, currentPhase: phaseSlug, currentLesson: lessonSlug },
            },
          }
        }),

      reset: () =>
        set({
          streakDays: 0,
          streakFreezeCount: 0,
          lastActiveDate: null,
          dailyGoal: DEFAULT_DAILY_GOAL,
          lessonsCompletedToday: 0,
          lastDailyReset: null,
          preferences: DEFAULT_PREFERENCES,
          lastActiveAt: 0,
          technologies: {},
        }),

      /* ── Gamification actions ───────────────────────────────────────────── */

      awardXP: (techSlug, amount, _reason) => {
        const state = get()
        const tech = ensureTech(state.technologies, techSlug)
        const newTotal = tech.xpTotal + amount
        const newLevel = calcLevel(newTotal)
        const prevLevel = tech.level

        set((s) => ({
          technologies: {
            ...s.technologies,
            [techSlug]: {
              ...ensureTech(s.technologies, techSlug),
              xpTotal: newTotal,
              xpToday: tech.xpToday + amount,
              level: newLevel,
            },
          },
        }))

        if (typeof window !== 'undefined') {
          if (newLevel !== prevLevel) {
            window.dispatchEvent(
              new CustomEvent('xp:levelup', { detail: { from: prevLevel, to: newLevel, xpTotal: newTotal, techSlug } })
            )
          }
          window.dispatchEvent(new CustomEvent('xp:award', { detail: { amount, reason: _reason, techSlug } }))
        }
      },

      recordLessonComplete: (techSlug, phaseSlug, lessonSlug, accuracy) => {
        const state = get()
        const tech = ensureTech(state.technologies, techSlug)
        const lessonId = `${phaseSlug}/${lessonSlug}`
        const today = todayLocal()

        // Reset daily counters if needed (global)
        if (state.lastDailyReset !== today) {
          set({ lessonsCompletedToday: 0, lastDailyReset: today })
          // Also reset today's XP in tech
          set((s) => ({
            technologies: {
              ...s.technologies,
              [techSlug]: { ...ensureTech(s.technologies, techSlug), xpToday: 0 },
            },
          }))
        }

        const alreadyCompleted = tech.completedLessons.includes(lessonId)
        const lessonXP = alreadyCompleted ? 0 : XP_AWARDS.LESSON_COMPLETE

        if (!alreadyCompleted) {
          set((s) => {
            const t = ensureTech(s.technologies, techSlug)
            return {
              lessonsCompletedToday: s.lessonsCompletedToday + 1,
              technologies: {
                ...s.technologies,
                [techSlug]: {
                  ...t,
                  completedLessons: [...t.completedLessons, lessonId],
                  xpByLesson: { ...t.xpByLesson, [lessonId]: (t.xpByLesson[lessonId] ?? 0) + lessonXP },
                },
              },
            }
          })
        }

        if (lessonXP > 0) get().awardXP(techSlug, lessonXP, 'Lesson complete')

        // Check daily goal
        const { lessonsCompletedToday, dailyGoal } = get()
        if (!alreadyCompleted && lessonsCompletedToday >= dailyGoal) {
          get().awardXP(techSlug, XP_AWARDS.DAILY_GOAL_MET, 'Daily goal met!')
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('xp:dailygoal', { detail: { goal: dailyGoal, techSlug } }))
          }
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('lesson:complete', {
              detail: {
                techSlug,
                phaseSlug,
                lessonSlug,
                accuracy,
                completedLessons: get().technologies[techSlug]?.completedLessons ?? [],
              },
            })
          )
        }

        get().checkStreak()
      },

      checkStreak: () => {
        const { lastActiveDate, streakDays, streakFreezeCount } = get()
        const today = todayLocal()

        if (lastActiveDate === today) return

        if (lastActiveDate === null) {
          set({ streakDays: 1, lastActiveDate: today, lastActiveAt: Date.now() })
          return
        }

        const last = new Date(lastActiveDate)
        const now = new Date(today)
        const diffDays = Math.round((now.getTime() - last.getTime()) / ONE_DAY_MS)

        if (diffDays === 1) {
          const newStreak = streakDays + 1
          const earnedFreeze = newStreak % FREEZE_EARN_INTERVAL === 0
          const newFreezeCount = earnedFreeze
            ? Math.min(streakFreezeCount + 1, MAX_STREAK_FREEZES)
            : streakFreezeCount
          set({ streakDays: newStreak, lastActiveDate: today, streakFreezeCount: newFreezeCount, lastActiveAt: Date.now() })
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('streak:earned', { detail: { streakDays: newStreak } }))
          }
        } else if (diffDays === 2 && streakFreezeCount > 0) {
          const newStreak = streakDays + 1
          const newFreezeCount = streakFreezeCount - 1
          set({ streakDays: newStreak, lastActiveDate: today, streakFreezeCount: newFreezeCount, lastActiveAt: Date.now() })
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('streak:freeze-used', { detail: { remaining: newFreezeCount } }))
            window.dispatchEvent(new CustomEvent('streak:earned', { detail: { streakDays: newStreak } }))
          }
        } else {
          if (typeof window !== 'undefined' && streakDays > 0) {
            window.dispatchEvent(new CustomEvent('streak:broken', { detail: { previous: streakDays } }))
          }
          set({ streakDays: 1, lastActiveDate: today, lastActiveAt: Date.now() })
        }
      },

      useStreakFreeze: () => {
        const { streakFreezeCount } = get()
        if (streakFreezeCount <= 0) return false
        set({ streakFreezeCount: streakFreezeCount - 1 })
        return true
      },

      unlockBadge: (techSlug, badgeId) => {
        const state = get()
        const tech = ensureTech(state.technologies, techSlug)
        if (tech.unlockedBadges.includes(badgeId)) return
        set((s) => ({
          technologies: {
            ...s.technologies,
            [techSlug]: {
              ...ensureTech(s.technologies, techSlug),
              unlockedBadges: [...ensureTech(s.technologies, techSlug).unlockedBadges, badgeId],
            },
          },
        }))
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('badge:unlocked', { detail: { badgeId, techSlug } }))
        }
      },

      resetDailyCounters: () =>
        set({ lessonsCompletedToday: 0, lastDailyReset: todayLocal() }),

      /* ── Selectors ──────────────────────────────────────────────────────── */

      getPhaseProgress: (techSlug, phaseSlug, totalLessons) => {
        if (totalLessons === 0) return 0
        const tech = ensureTech(get().technologies, techSlug)
        const count = tech.completedLessons.filter((id) => id.startsWith(`${phaseSlug}/`)).length
        return Math.round((count / totalLessons) * 100)
      },

      getTotalProgress: (techSlug, totalLessons) => {
        if (totalLessons === 0) return 0
        const tech = ensureTech(get().technologies, techSlug)
        return Math.round((tech.completedLessons.length / totalLessons) * 100)
      },

      getWeakAreas: (techSlug) => {
        const tech = ensureTech(get().technologies, techSlug)
        const phaseMap: Record<string, { correct: number; total: number }> = {}
        for (const answer of Object.values(tech.challengeAnswers)) {
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

      getReviewQueue: (techSlug) => {
        const tech = ensureTech(get().technologies, techSlug)
        return Object.values(tech.challengeAnswers)
          .filter((a) => !a.correct)
          .sort((a, b) => b.answeredAt - a.answeredAt)
          .slice(0, 20)
      },

      getXPToNextLevel: (techSlug) => {
        const tech = ensureTech(get().technologies, techSlug)
        return xpToNextLevel(tech.xpTotal)
      },

      getLevelProgress: (techSlug) => {
        const tech = ensureTech(get().technologies, techSlug)
        return levelProgress(tech.xpTotal)
      },
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
      // Migrate v1 → v2: move per-tech fields under technologies.dotnet
      migrate: (persistedState: unknown, version: number) => {
        const p = (persistedState ?? {}) as Record<string, unknown>
        if (version === 0 || !('technologies' in p)) {
          // v1 data: migrate to v2
          const dotnetProgress: TechnologyProgress = {
            completedLessons: (p['completedLessons'] as string[]) ?? [],
            challengeAnswers: (p['challengeAnswers'] as Record<string, ChallengeAnswer>) ?? {},
            bookmarkedLessons: (p['bookmarkedLessons'] as string[]) ?? [],
            xpTotal: (p['xpTotal'] as number) ?? 0,
            xpToday: (p['xpToday'] as number) ?? 0,
            xpByLesson: (p['xpByLesson'] as Record<string, number>) ?? {},
            level: (p['level'] as XPLevel) ?? 'novice',
            unlockedBadges: (p['unlockedBadges'] as string[]) ?? [],
            currentPhase: (p['currentPhase'] as string | null) ?? null,
            currentLesson: (p['currentLesson'] as string | null) ?? null,
          }
          return {
            streakDays: (p['streakDays'] as number) ?? 0,
            streakFreezeCount: (p['streakFreezeCount'] as number) ?? 0,
            lastActiveDate: (p['lastActiveDate'] as string | null) ?? null,
            dailyGoal: (p['dailyGoal'] as number) ?? DEFAULT_DAILY_GOAL,
            lessonsCompletedToday: (p['lessonsCompletedToday'] as number) ?? 0,
            lastDailyReset: (p['lastDailyReset'] as string | null) ?? null,
            preferences: (p['preferences'] as UserPreferences) ?? { reduceMotion: false, hudDimOnIdle: true },
            lastActiveAt: (p['lastActiveAt'] as number) ?? 0,
            technologies: { dotnet: dotnetProgress },
          }
        }
        return persistedState
      },
      version: 1,
    }
  )
)
