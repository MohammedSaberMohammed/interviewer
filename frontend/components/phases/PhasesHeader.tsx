'use client'

import { useEffect, useState } from 'react'
import { useProgressStore } from '@/stores/progressStore'

interface PhasesHeaderProps {
  techSlug: string
  totalLessons: number
  techTitle?: string
}

export function PhasesHeader({ techSlug, totalLessons, techTitle }: PhasesHeaderProps) {
  const [mounted, setMounted] = useState(false)
  const technologies = useProgressStore((s) => s.technologies)

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  const completedLessons = mounted ? (technologies[techSlug]?.completedLessons ?? []) : []
  const completed = completedLessons.length
  const pct = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100)

  /* SVG ring constants */
  const r = 26
  const circ = 2 * Math.PI * r
  const stroke = circ - (pct / 100) * circ

  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{techTitle ? `${techTitle} Curriculum` : 'Curriculum Phases'}</h1>
        <p className="mt-1.5 text-muted-foreground max-w-xl">
          {techTitle
            ? `Browse all learning phases for ${techTitle} interview preparation.`
            : '13 phases covering everything from C# fundamentals to distributed system design.'}
        </p>
      </div>

      {/* Global progress ring */}
      {mounted && (
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-soft)]">
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
            {/* Track */}
            <circle
              cx="32" cy="32" r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-muted"
            />
            {/* Progress */}
            <circle
              cx="32" cy="32" r={r}
              fill="none"
              stroke="url(#ring-grad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={stroke}
              transform="rotate(-90 32 32)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <text
              x="32" y="36"
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="currentColor"
              className="fill-foreground"
            >
              {pct}%
            </text>
          </svg>
          <div>
            <p className="text-sm font-semibold text-foreground">{completed} / {totalLessons}</p>
            <p className="text-xs text-muted-foreground">lessons done</p>
          </div>
        </div>
      )}
    </div>
  )
}
