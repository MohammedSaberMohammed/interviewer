'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useProgressStore } from '@/stores/progressStore'
import { IsometricCube } from '@/components/ui/IsometricCube'
import { cn } from '@/lib/utils'
import type { Phase, PhaseLevel } from '@/types'

interface PhaseRoadmapProps {
  phases: Phase[]
  techSlug: string
}

const LEVEL_CUBE_COLOR: Record<PhaseLevel, string> = {
  junior: 'cyan',
  mid: 'violet',
  senior: 'amber',
}

const LEVEL_ACCENT: Record<PhaseLevel, string> = {
  junior:  'oklch(0.72 0.18 195)',
  mid:     'oklch(0.68 0.25 320)',
  senior:  'oklch(0.78 0.18 85)',
}

const LEVEL_BADGE: Record<PhaseLevel, string> = {
  junior:  'bg-[oklch(0.72_0.18_195/0.12)] border-[oklch(0.72_0.18_195/0.3)] text-brand-cyan',
  mid:     'bg-[oklch(0.68_0.25_320/0.12)] border-[oklch(0.68_0.25_320/0.3)] text-brand-magenta',
  senior:  'bg-[oklch(0.78_0.18_85/0.12)] border-[oklch(0.78_0.18_85/0.3)] text-brand-amber',
}

const LEVEL_LABEL: Record<PhaseLevel, string> = {
  junior: 'Junior',
  mid: 'Mid-Level',
  senior: 'Senior',
}

function ProgressRing({ pct, size = 48 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${pct}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="oklch(0.72 0.18 195)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease', filter: 'drop-shadow(0 0 6px oklch(0.72 0.18 195 / 0.7))' }}
      />
      <text
        x={size / 2} y={size / 2 + 4}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        style={{ fill: 'var(--color-primary)' }}
      >
        {pct}%
      </text>
    </svg>
  )
}

export function PhaseRoadmap({ phases, techSlug }: PhaseRoadmapProps) {
  const [mounted, setMounted] = useState(false)
  const technologies = useProgressStore((s) => s.technologies)

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  const completedLessons: string[] = mounted ? (technologies[techSlug]?.completedLessons ?? []) : []

  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      <div className="flex flex-col gap-2">
        {phases.map((phase, i) => {
          const totalLessons = phase.lessons.length
          const completedInPhase = phase.lessons.filter((l) =>
            completedLessons.includes(`${techSlug}/${phase.slug}/${l.slug}`)
          ).length
          const pct = totalLessons === 0 ? 0 : Math.round((completedInPhase / totalLessons) * 100)
          const isComplete = pct === 100
          const isStarted = pct > 0 && !isComplete
          const showStartHere = i === 0 && !isStarted && !isComplete && mounted

          const accentColor = isComplete ? 'oklch(0.72 0.20 145)' : LEVEL_ACCENT[phase.level]
          const cubeColor = LEVEL_CUBE_COLOR[phase.level]

          const href = `/${techSlug}/phases/${phase.slug}`

          return (
            <motion.div
              key={phase.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-32px' }}
              transition={{ duration: 0.32, ease: [0.2, 0, 0, 1], delay: Math.min(i * 0.025, 0.25) }}
            >
              <Link href={href} className="group block">
                <div className={cn(
                  'relative flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 transition-all duration-250',
                  isComplete
                    ? 'border-[oklch(0.72_0.20_145/0.25)]'
                    : isStarted
                      ? 'border-[oklch(0.72_0.18_195/0.3)] shadow-[0_0_0_1px_oklch(0.72_0.18_195/0.08),0_4px_16px_oklch(0.72_0.18_195/0.12)]'
                      : 'border-border group-hover:border-primary/25',
                  'group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_24px_oklch(0_0_0/0.1)]',
                )}>
                  {/* Left accent bar */}
                  <div
                    className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl"
                    style={{ background: accentColor }}
                    aria-hidden
                  />

                  {/* Cube */}
                  <div className={cn('hidden sm:block shrink-0 ml-1', isComplete && 'opacity-40')}>
                    <IsometricCube color={cubeColor} size={52} />
                  </div>

                  {/* Main content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Phase {String(phase.number).padStart(2, '0')}
                      </span>
                      <span className={cn(
                        'rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em]',
                        LEVEL_BADGE[phase.level]
                      )}>
                        {LEVEL_LABEL[phase.level]}
                      </span>
                      {showStartHere && (
                        <span className="flex items-center gap-1 rounded-full border border-[oklch(0.72_0.18_195/0.4)] bg-[oklch(0.72_0.18_195/0.1)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-brand-cyan">
                          <span className="relative flex size-1.5">
                            <span className="animate-ping absolute inline-flex size-full rounded-full bg-[oklch(0.72_0.18_195)] opacity-75" />
                            <span className="relative inline-flex size-1.5 rounded-full bg-[oklch(0.72_0.18_195)]" />
                          </span>
                          Start Here
                        </span>
                      )}
                    </div>

                    <h2 className={cn(
                      'text-[15px] font-semibold leading-snug transition-colors',
                      isComplete
                        ? 'text-muted-foreground'
                        : 'text-foreground group-hover:text-primary',
                    )}>
                      {phase.title}
                    </h2>
                    {phase.subtitle && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{phase.subtitle}</p>
                    )}

                    <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                      {phase.lessons.length} lessons · {phase.estimatedHours}h
                    </p>
                  </div>

                  {/* Right: state indicator */}
                  <div className="shrink-0 pr-1">
                    {mounted && isComplete && (
                      <CheckCircle2 className="size-5 text-[oklch(0.72_0.20_145)]" />
                    )}
                    {mounted && isStarted && <ProgressRing pct={pct} size={44} />}
                    {(!mounted || (!isStarted && !isComplete)) && (
                      <ArrowRight className={cn(
                        'size-4 text-muted-foreground transition-all duration-200',
                        mounted ? 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5' : 'opacity-0',
                      )} />
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}

        {/* End node */}
        <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-dashed border-[oklch(0.78_0.18_85/0.3)] py-5">
          <div className="flex size-8 items-center justify-center rounded-full border border-[oklch(0.78_0.18_85/0.3)] bg-[oklch(0.78_0.18_85/0.08)]">
            <span className="text-sm">🏆</span>
          </div>
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            Senior-ready
          </p>
        </div>
      </div>
    </div>
  )
}
