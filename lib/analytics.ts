/* ─── Analytics wrapper ─────────────────────────────────────────────────────
 * No-op in development. In production, swap the `track` body for your
 * analytics provider (PostHog, Plausible, etc.).
 * ─────────────────────────────────────────────────────────────────────────── */

const IS_PROD = process.env.NODE_ENV === 'production'

function track(event: string, properties?: Record<string, unknown>): void {
  if (!IS_PROD) return
  // Replace with your provider:
  // posthog.capture(event, properties)
  // plausible(event, { props: properties })
  console.debug('[analytics]', event, properties)
}

/* ─── Typed event helpers ───────────────────────────────────────────────── */

export const analytics = {
  questStepStarted(lessonId: string, stepId: string, stepIndex: number) {
    track('quest_step_started', { lessonId, stepId, stepIndex })
  },
  questStepCompleted(lessonId: string, stepId: string, correct: boolean, attempts: number, timeMs: number) {
    track('quest_step_completed', { lessonId, stepId, correct, attempts, timeMs })
  },
  questLessonCompleted(lessonId: string, xpEarned: number, accuracy: number, totalTimeMs: number) {
    track('quest_lesson_completed', { lessonId, xpEarned, accuracy, totalTimeMs })
  },
  streakDayEarned(streakCount: number) {
    track('streak_day_earned', { streakCount })
  },
  streakBroken(previousStreakCount: number) {
    track('streak_broken', { previousStreakCount })
  },
  streakFreezeUsed(remainingFreezes: number) {
    track('streak_freeze_used', { remainingFreezes })
  },
  levelUp(fromLevel: string, toLevel: string, xpTotal: number) {
    track('level_up', { fromLevel, toLevel, xpTotal })
  },
  badgeUnlocked(badgeId: string) {
    track('badge_unlocked', { badgeId })
  },
  articleModeToggled(on: boolean) {
    track('article_mode_toggled', { on })
  },
  dailyGoalMet(goalCount: number) {
    track('daily_goal_met', { goalCount })
  },
}
