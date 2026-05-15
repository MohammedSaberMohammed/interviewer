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

  const r = 26
  const circ = 2 * Math.PI * r
  const stroke = circ - (pct / 100) * circ

  return (
    <div className="flex items-start justify-between gap-6 flex-wrap">
      <div>
        <p className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[oklch(0.72_0.18_195)]">
          Quest Map
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight">
          {techTitle ? (
            <>
              <span className="block">{techTitle}</span>
              <em className="block italic font-light text-gradient-brand">Curriculum</em>
            </>
          ) : (
            'Curriculum Phases'
          )}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-lg text-[15px] leading-relaxed">
          Each phase builds on the last — from fundamentals to senior-level interview traps.
        </p>
      </div>

      {mounted && (
        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4">
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-border)" strokeWidth="5" />
            <circle
              cx="32" cy="32" r={r}
              fill="none"
              stroke="oklch(0.72 0.18 195)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={stroke}
              transform="rotate(-90 32 32)"
              style={{ transition: 'stroke-dashoffset 0.6s ease', filter: 'drop-shadow(0 0 8px oklch(0.72 0.18 195 / 0.6))' }}
            />
            <text x="32" y="36" textAnchor="middle" fontSize="12" fontWeight="700" fill="oklch(0.82 0.18 195)">
              {pct}%
            </text>
          </svg>
          <div>
            <p className="text-base font-semibold text-foreground">{completed} / {totalLessons}</p>
            <p className="text-xs text-muted-foreground">lessons complete</p>
          </div>
        </div>
      )}
    </div>
  )
}
