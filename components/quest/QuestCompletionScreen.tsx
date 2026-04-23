'use client'

import Link from 'next/link'
import { useProgressStore } from '@/stores/progressStore'
import { StreakBadge } from './StreakBadge'
import { BADGES } from '@/lib/constants'

interface QuestCompletionScreenProps {
  phaseSlug: string
  lessonSlug: string
  lessonTitle: string
  xpEarned: number
  accuracy: number
  nextLesson?: { slug: string; title: string } | null
  newlyUnlockedBadges?: string[]
}

export function QuestCompletionScreen({
  phaseSlug,
  lessonSlug,
  lessonTitle,
  xpEarned,
  accuracy,
  nextLesson,
  newlyUnlockedBadges = [],
}: QuestCompletionScreenProps) {
  const streakDays = useProgressStore((s) => s.streakDays)

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      {/* Hero panel */}
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 text-4xl" aria-hidden="true">✅</div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quest complete!</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lessonTitle}</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-800/60">
            <p className="text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">+{xpEarned}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">XP earned</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-800/60">
            <p className="text-xl font-bold tabular-nums text-slate-800 dark:text-slate-100">{accuracy}%</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Accuracy</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-800/60">
            <StreakBadge count={streakDays} className="text-lg" />
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Streak</p>
          </div>
        </div>

        {/* Badges unlocked */}
        {newlyUnlockedBadges.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-[#6366F1] dark:text-indigo-400">Badges unlocked</p>
            <div className="flex justify-center gap-2">
              {newlyUnlockedBadges.map((id) => {
                const badge = BADGES.find((b) => b.id === id)
                return badge ? (
                  <span key={id} className="text-2xl" title={badge.title} aria-label={badge.title}>
                    {badge.icon}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="flex w-full max-w-sm flex-col gap-2">
        {nextLesson ? (
          <Link
            href={`/phases/${phaseSlug}/${nextLesson.slug}`}
            className="btn-brand w-full"
          >
            Continue to {nextLesson.title}
          </Link>
        ) : (
          <Link
            href={`/phases/${phaseSlug}`}
            className="btn-brand w-full"
          >
            Phase complete — back to phase
          </Link>
        )}
        <Link
          href="/progress"
          className="flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          View my progress
        </Link>
      </div>
    </div>
  )
}
