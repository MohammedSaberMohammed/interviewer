import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { PROGRESS_STORAGE_KEY } from '@/lib/constants'
import type { ChallengeAnswer, ProgressState } from '@/types'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      /* ── State ─────────────────────────────────────────────────────────── */
      completedLessons: [],
      challengeAnswers: {},
      bookmarkedLessons: [],
      currentPhase: null,
      currentLesson: null,
      lastActiveAt: 0,
      streakDays: 0,

      /* ── Actions ───────────────────────────────────────────────────────── */
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

      updateStreak: () => {
        const now = Date.now()
        const { lastActiveAt, streakDays } = get()
        const daysSinceLast = (now - lastActiveAt) / ONE_DAY_MS

        if (daysSinceLast < 1) {
          // Already active today — just update timestamp
          set({ lastActiveAt: now })
        } else if (daysSinceLast < 2) {
          // Active yesterday — extend streak
          set({ lastActiveAt: now, streakDays: streakDays + 1 })
        } else {
          // Missed a day — reset
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
        }),

      /* ── Selectors ─────────────────────────────────────────────────────── */
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
          // challengeId format: "phaseSlug/lessonSlug/challengeId"
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
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      storage: createJSONStorage(() => {
        // Only use localStorage on client
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
    }
  )
)
