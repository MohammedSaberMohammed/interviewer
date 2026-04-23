'use client'

import Link from 'next/link'
import { useShallow } from 'zustand/react/shallow'
import { useProgressStore } from '@/stores/progressStore'
import { StreakBadge } from './StreakBadge'

interface DailyQuestCardProps {
  /** Best next lesson to suggest — derived from calling code */
  nextQuestHref?: string
  nextQuestTitle?: string
}

export function DailyQuestCard({ nextQuestHref, nextQuestTitle }: DailyQuestCardProps) {
  const { streakDays, streakFreezeCount, dailyGoal, lessonsCompletedToday } = useProgressStore(
    useShallow((s) => ({
      streakDays: s.streakDays,
      streakFreezeCount: s.streakFreezeCount,
      dailyGoal: s.dailyGoal,
      lessonsCompletedToday: s.lessonsCompletedToday,
    })),
  )

  const pct = Math.min(100, Math.round((lessonsCompletedToday / dailyGoal) * 100))
  const goalMet = lessonsCompletedToday >= dailyGoal

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Today&apos;s goal</h3>
        <StreakBadge count={streakDays} />
      </div>

      {/* Progress bar */}
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{lessonsCompletedToday} of {dailyGoal} quests</span>
        {goalMet && <span className="font-medium text-emerald-600 dark:text-emerald-400">Goal met!</span>}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={lessonsCompletedToday}
          aria-valuemin={0}
          aria-valuemax={dailyGoal}
          aria-label={`${lessonsCompletedToday} of ${dailyGoal} daily quests complete`}
        />
      </div>

      {/* Freeze count */}
      {streakFreezeCount > 0 && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {streakFreezeCount} streak freeze{streakFreezeCount > 1 ? 's' : ''} banked
        </p>
      )}

      {/* CTA */}
      {nextQuestHref && !goalMet && (
        <Link
          href={nextQuestHref}
          className="btn-brand mt-4 w-full"
        >
          {nextQuestTitle ? `Start: ${nextQuestTitle}` : "Start today's quest"}
        </Link>
      )}
      {goalMet && (
        <p className="mt-4 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          Come back tomorrow to keep your streak 🔥
        </p>
      )}
    </div>
  )
}
