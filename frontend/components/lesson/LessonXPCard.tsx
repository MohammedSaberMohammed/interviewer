'use client'

import { useEffect, useState } from 'react'
import { useProgressStore } from '@/stores/progressStore'

interface LessonXPCardProps {
  techSlug: string
}

export function LessonXPCard({ techSlug }: LessonXPCardProps) {
  const [mounted, setMounted] = useState(false)
  const streakDays = useProgressStore((s) => s.streakDays)
  const lessonsCompletedToday = useProgressStore((s) => s.lessonsCompletedToday)
  const technologies = useProgressStore((s) => s.technologies)

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  const xpToday = mounted ? (technologies[techSlug]?.xpToday ?? 0) : 0
  const streak = mounted ? streakDays : 0
  const todayLessons = mounted ? lessonsCompletedToday : 0

  return (
    <div
      className="mt-5 rounded-xl border border-border p-4"
      style={{
        background: 'linear-gradient(135deg, oklch(0.68 0.25 320 / 0.10), oklch(0.72 0.18 195 / 0.07))',
      }}
    >
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[oklch(0.85_0.20_320)]">
        Session earnings
      </p>
      <p className="mt-1.5 font-display text-2xl font-semibold text-foreground">
        +{xpToday}{' '}
        <span className="text-sm font-normal text-muted-foreground">XP</span>
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {todayLessons} lesson{todayLessons !== 1 ? 's' : ''} today
        {streak > 0 && (
          <> · {streak}-day streak 🔥</>
        )}
      </p>
    </div>
  )
}
