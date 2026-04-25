'use client'

import { useEffect, useState } from 'react'
import { useProgressStore } from '@/stores/progressStore'
import { DailyQuestCard } from '@/components/quest/DailyQuestCard'
import { XP_LEVELS } from '@/lib/constants'

/**
 * Shown on the homepage hero only after client hydration.
 * Displays the daily quest card + current level for returning users.
 * Uses the first technology with progress, or 'dotnet' as default.
 */
export function GamificationWidget() {
  const [mounted, setMounted] = useState(false)
  const technologies = useProgressStore((s) => s.technologies)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Find the first tech with progress, fall back to 'dotnet'
  const activeTech = Object.entries(technologies).find(([, t]) => t.completedLessons.length > 0)
  if (!activeTech) return null

  const [, techProgress] = activeTech
  const { xpTotal, level, completedLessons } = techProgress

  // Only show for users who have started
  if (completedLessons.length === 0) return null

  const levelConfig = XP_LEVELS[level]

  return (
    <div className="mx-auto mt-8 w-full max-w-sm">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Welcome back</span>
        <span className="font-medium text-[#6366F1] dark:text-indigo-400">
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
