'use client'

import { useEffect, useState } from 'react'
import { useProgressStore } from '@/stores/progressStore'
import { DailyQuestCard } from '@/components/quest/DailyQuestCard'
import { XP_LEVELS } from '@/lib/constants'

/**
 * Shown on the homepage hero only after client hydration.
 * Displays the daily quest card + current level for returning users.
 */
export function GamificationWidget() {
  const [mounted, setMounted] = useState(false)
  const xpTotal = useProgressStore((s) => s.xpTotal)
  const level = useProgressStore((s) => s.level)
  const completedLessons = useProgressStore((s) => s.completedLessons)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only show for users who have started
  if (!mounted || completedLessons.length === 0) return null

  const levelConfig = XP_LEVELS[level]

  return (
    <div className="mx-auto mt-8 w-full max-w-sm">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Welcome back</span>
        <span className="font-medium text-[#512BD4] dark:text-violet-400">
          {levelConfig.label} · {xpTotal.toLocaleString()} XP
        </span>
      </div>
      <DailyQuestCard
        nextQuestHref="/phases/01-csharp-core"
        nextQuestTitle="Continue where you left off"
      />
    </div>
  )
}
