'use client'

import { useEffect, useState } from 'react'
import { useProgressStore } from '@/stores/progressStore'

interface PhaseSidebarProgressProps {
  techSlug: string
  phaseSlug: string
  totalLessons: number
}

export function PhaseSidebarProgress({ techSlug, phaseSlug, totalLessons }: PhaseSidebarProgressProps) {
  const [mounted, setMounted] = useState(false)
  const technologies = useProgressStore((s) => s.technologies)

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  const completedLessons = mounted ? (technologies[techSlug]?.completedLessons ?? []) : []
  const completed = completedLessons.filter((id) => id.startsWith(`${phaseSlug}/`)).length
  const pct = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100)

  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-muted-foreground">Your Progress</dt>
      <dd className="text-xs font-semibold text-primary tabular-nums">{mounted ? pct : 0}%</dd>
    </div>
  )
}
