'use client'

import { useEffect, useState } from 'react'
import { useProgressStore } from '@/stores/progressStore'

interface PhaseDetailProgressProps {
  techSlug: string
  phaseSlug: string
  totalLessons: number
}

export function PhaseDetailProgress({ techSlug, phaseSlug, totalLessons }: PhaseDetailProgressProps) {
  const [mounted, setMounted] = useState(false)
  const technologies = useProgressStore((s) => s.technologies)

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  const completedLessons = mounted ? (technologies[techSlug]?.completedLessons ?? []) : []
  const completed = completedLessons.filter((id) => id.startsWith(`${phaseSlug}/`)).length
  const pct = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100)

  if (!mounted || completed === 0) return null

  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Your Progress</span>
        <span className="text-xs font-semibold tabular-nums text-primary">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? 'oklch(0.72 0.20 145)'
              : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
          }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{completed} of {totalLessons} lessons completed</p>
    </div>
  )
}
