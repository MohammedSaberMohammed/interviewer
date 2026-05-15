'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Lock, CheckCircle2, ArrowRight, Zap } from 'lucide-react'
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

const LEVEL_LABEL: Record<PhaseLevel, { label: string; color: string; bg: string }> = {
  junior: {
    label: 'Junior',
    color: 'text-[oklch(0.82_0.18_195)]',
    bg: 'bg-[oklch(0.72_0.18_195/0.12)] border-[oklch(0.72_0.18_195/0.25)]',
  },
  mid: {
    label: 'Mid',
    color: 'text-[oklch(0.85_0.20_320)]',
    bg: 'bg-[oklch(0.68_0.25_320/0.12)] border-[oklch(0.68_0.25_320/0.25)]',
  },
  senior: {
    label: 'Senior',
    color: 'text-[oklch(0.88_0.18_85)]',
    bg: 'bg-[oklch(0.78_0.18_85/0.12)] border-[oklch(0.78_0.18_85/0.25)]',
  },
}

function ProgressRing({ pct, size = 48 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="4" />
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
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="oklch(0.82 0.18 195)">
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
    <div className="relative mx-auto max-w-4xl px-4 py-8">
      {/* Vertical center line */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
        style={{ background: 'linear-gradient(to bottom, transparent, oklch(1 0 0 / 0.07) 10%, oklch(1 0 0 / 0.07) 90%, transparent)' }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-0">
        {phases.map((phase, i) => {
          const isLeft = i % 2 === 0
          const totalLessons = phase.lessons.length
          const completedInPhase = phase.lessons.filter((l) =>
            completedLessons.includes(`${techSlug}/${phase.slug}/${l.slug}`)
          ).length
          const pct = totalLessons === 0 ? 0 : Math.round((completedInPhase / totalLessons) * 100)
          const isComplete = pct === 100
          const isStarted = pct > 0 && !isComplete
          const isFirst = i === 0
          const showStartHere = isFirst && !isStarted && !isComplete

          const levelStyle = LEVEL_LABEL[phase.level]
          const cubeColor = LEVEL_CUBE_COLOR[phase.level]

          // First incomplete lesson link
          const firstIncompleteLesson = phase.lessons.find(
            (l) => !completedLessons.includes(`${techSlug}/${phase.slug}/${l.slug}`)
          )
          const href = firstIncompleteLesson
            ? `/${techSlug}/phases/${phase.slug}/${firstIncompleteLesson.slug}`
            : `/${techSlug}/phases/${phase.slug}`

          return (
            <div key={phase.slug} className="relative flex items-center">
              {/* Connector line segment above (except first) */}
              {i > 0 && (
                <div
                  className="pointer-events-none absolute left-1/2 -top-6 h-12 w-px -translate-x-1/2"
                  style={{ background: isComplete ? 'oklch(0.72 0.20 145 / 0.4)' : 'oklch(1 0 0 / 0.07)' }}
                  aria-hidden
                />
              )}

              {/* Node dot on center line */}
              <div className={cn(
                'absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full border-2 transition-all duration-300',
                isComplete
                  ? 'size-5 border-[oklch(0.72_0.20_145)] bg-[oklch(0.72_0.20_145/0.2)]'
                  : isStarted
                    ? 'size-5 border-[oklch(0.72_0.18_195)] bg-[oklch(0.72_0.18_195/0.15)]'
                    : 'size-4 border-border bg-card',
              )}>
                {isComplete && <CheckCircle2 className="size-3 text-[oklch(0.72_0.20_145)]" />}
                {isStarted && <div className="size-2 rounded-full bg-[oklch(0.72_0.18_195)]" style={{ boxShadow: '0 0 8px oklch(0.72 0.18 195 / 0.8)' }} />}
              </div>

              {/* Card — alternates left/right */}
              <motion.div
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                className={cn('mb-10 w-[46%]', isLeft ? 'mr-auto pr-6' : 'ml-auto pl-6')}
              >
                <Link href={href} className="group block">
                  <div className={cn(
                    'relative overflow-hidden rounded-2xl border p-5 transition-all duration-300',
                    'bg-[oklch(0.13_0.022_270)] backdrop-blur-sm',
                    isComplete
                      ? 'border-[oklch(0.72_0.20_145/0.3)] shadow-[0_0_0_1px_oklch(0.72_0.20_145/0.1)]'
                      : isStarted
                        ? 'border-[oklch(0.72_0.18_195/0.35)] shadow-[var(--shadow-glow-cyan)]'
                        : 'border-border hover:border-[oklch(0.72_0.18_195/0.25)]',
                    'group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_32px_oklch(0_0_0/0.4)]',
                  )}>

                    {/* Start Here pulse badge */}
                    {showStartHere && mounted && (
                      <div className="absolute -top-2 right-4 z-10 flex items-center gap-1.5 rounded-full border border-[oklch(0.72_0.18_195/0.4)] bg-[oklch(0.72_0.18_195/0.12)] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[oklch(0.82_0.18_195)]">
                        <span className="relative flex size-1.5">
                          <span className="animate-ping absolute inline-flex size-full rounded-full bg-[oklch(0.72_0.18_195)] opacity-75" />
                          <span className="relative inline-flex size-1.5 rounded-full bg-[oklch(0.72_0.18_195)]" />
                        </span>
                        Start Here
                      </div>
                    )}

                    {/* Completion checkmark overlay */}
                    {isComplete && (
                      <div className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-[oklch(0.72_0.20_145/0.15)] border border-[oklch(0.72_0.20_145/0.3)]">
                        <CheckCircle2 className="size-4 text-[oklch(0.8_0.20_145)]" />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Cube visual */}
                      <div className={cn('shrink-0 transition-all duration-300', isComplete ? 'opacity-60' : 'opacity-100')}>
                        <IsometricCube color={cubeColor} size={64} />
                      </div>

                      <div className="min-w-0 flex-1 pt-1">
                        {/* Phase number + level */}
                        <div className="mb-1.5 flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Phase {String(phase.number).padStart(2, '0')}
                          </span>
                          <span className={cn('rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em]', levelStyle.bg, levelStyle.color)}>
                            {levelStyle.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-[oklch(0.82_0.18_195)] transition-colors">
                          {phase.title}
                        </h3>

                        {/* Subtitle */}
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {phase.subtitle}
                        </p>

                        {/* Footer: lessons count + progress / locked */}
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {phase.lessons.length} lessons · {phase.estimatedHours}h
                          </span>

                          {mounted && isStarted && (
                            <ProgressRing pct={pct} size={44} />
                          )}
                          {mounted && isComplete && (
                            <span className="font-mono text-[10px] font-bold text-[oklch(0.8_0.20_145)] uppercase tracking-wide">
                              Complete
                            </span>
                          )}
                          {mounted && !isStarted && !isComplete && (
                            <div className="flex items-center gap-1 text-[oklch(0.82_0.18_195)] opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="font-mono text-[10px] font-semibold">Begin</span>
                              <ArrowRight className="size-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hover glow */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'radial-gradient(ellipse 60% 40% at 30% 20%, oklch(0.72 0.18 195 / 0.05) 0%, transparent 70%)' }}
                      aria-hidden
                    />
                  </div>
                </Link>
              </motion.div>
            </div>
          )
        })}

        {/* End node */}
        <div className="flex flex-col items-center gap-3 pb-8">
          <div className="flex size-10 items-center justify-center rounded-full border border-[oklch(0.78_0.18_85/0.3)] bg-[oklch(0.78_0.18_85/0.08)]">
            <Zap className="size-5 text-[oklch(0.88_0.18_85)]" />
          </div>
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            Senior-ready
          </p>
        </div>
      </div>
    </div>
  )
}
