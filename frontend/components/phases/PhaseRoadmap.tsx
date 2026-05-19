'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { useProgressStore } from '@/stores/progressStore'
import { cn } from '@/lib/utils'
import type { Phase, PhaseLevel } from '@/types'

interface PhaseRoadmapProps {
  phases: Phase[]
  techSlug: string
}

/* ── Level visual config ──────────────────────────────────────────────────── */
const LEVEL_CFG: Record<PhaseLevel, {
  accent: string
  glow: string
  softBg: string
  border: string
  badgeCls: string
  label: string
}> = {
  junior: {
    accent:   'oklch(0.820 0.155 195)',
    glow:     'oklch(0.820 0.155 195 / 0.45)',
    softBg:   'oklch(0.820 0.155 195 / 0.10)',
    border:   'oklch(0.820 0.155 195 / 0.35)',
    badgeCls: 'bg-[oklch(0.820_0.155_195/0.10)] border-[oklch(0.820_0.155_195/0.28)] text-[oklch(0.88_0.155_195)]',
    label:    'Junior',
  },
  mid: {
    accent:   'oklch(0.68 0.25 320)',
    glow:     'oklch(0.68 0.25 320 / 0.45)',
    softBg:   'oklch(0.68 0.25 320 / 0.10)',
    border:   'oklch(0.68 0.25 320 / 0.35)',
    badgeCls: 'bg-[oklch(0.68_0.25_320/0.10)] border-[oklch(0.68_0.25_320/0.28)] text-[oklch(0.80_0.22_320)]',
    label:    'Mid-Level',
  },
  senior: {
    accent:   'oklch(0.78 0.18 85)',
    glow:     'oklch(0.78 0.18 85 / 0.45)',
    softBg:   'oklch(0.78 0.18 85 / 0.10)',
    border:   'oklch(0.78 0.18 85 / 0.35)',
    badgeCls: 'bg-[oklch(0.78_0.18_85/0.10)] border-[oklch(0.78_0.18_85/0.28)] text-[oklch(0.88_0.18_85)]',
    label:    'Senior',
  },
}

/* ── Phase Node (the circle on the spine) ──────────────────────────────── */
function PhaseNode({
  number, isComplete, isCurrent, cfg,
}: {
  number: number
  isComplete: boolean
  isCurrent: boolean
  cfg: (typeof LEVEL_CFG)[PhaseLevel]
}) {
  const sz = isCurrent ? 60 : 52

  return (
    <div className="relative flex items-center justify-center" style={{ width: sz, height: sz }}>
      {/* Outer breathing ring for current step */}
      {isCurrent && (
        <span
          className="absolute rounded-full animate-ping"
          style={{
            inset: -10,
            background: cfg.accent,
            opacity: 0.20,
            animationDuration: '2.4s',
          }}
          aria-hidden
        />
      )}

      {/* Second static halo */}
      {isCurrent && (
        <span
          className="absolute rounded-full"
          style={{
            inset: -6,
            border: `1px solid ${cfg.accent}`,
            opacity: 0.30,
          }}
          aria-hidden
        />
      )}

      {/* Main circle */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full border-2 font-mono font-bold transition-all duration-300"
        style={{
          width: sz,
          height: sz,
          borderColor: isComplete ? 'oklch(0.72 0.20 145)' : cfg.accent,
          background:  isComplete ? 'oklch(0.72 0.20 145 / 0.14)' : cfg.softBg,
          color:       isComplete ? 'oklch(0.82 0.20 145)' : cfg.accent,
          boxShadow: `0 0 ${isCurrent ? 28 : 16}px ${
            isComplete ? 'oklch(0.72 0.20 145 / 0.45)' : cfg.glow
          }`,
          fontSize: isCurrent ? '15px' : '13px',
        }}
      >
        {isComplete
          ? <CheckCircle2 style={{ width: 20, height: 20, color: 'oklch(0.72 0.20 145)' }} />
          : <span>{String(number).padStart(2, '0')}</span>
        }
      </div>
    </div>
  )
}

/* ── Phase Card (lesson phase info panel) ──────────────────────────────── */
function PhaseCard({
  phase, state, isCurrent, cfg, mounted, align,
}: {
  phase: Phase
  state: { pct: number; isComplete: boolean; isStarted: boolean }
  isCurrent: boolean
  cfg: (typeof LEVEL_CFG)[PhaseLevel]
  mounted: boolean
  align: 'left' | 'right'
}) {
  return (
    <div
      className={cn(
        'relative w-full rounded-2xl border bg-card overflow-hidden transition-all duration-250',
        'group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_28px_oklch(0_0_0/0.30)]',
        state.isComplete
          ? 'border-[oklch(0.72_0.20_145/0.20)] opacity-70 group-hover:opacity-85'
          : 'border-border',
      )}
      style={
        isCurrent ? {
          borderColor: cfg.border,
          boxShadow: `0 0 0 1px ${cfg.softBg}, 0 4px 24px ${cfg.glow.replace('0.45', '0.18')}`,
        } : undefined
      }
    >
      {/* Accent bar on the inward side (right for left-aligned card, left for right-aligned) */}
      <div
        className="absolute top-0 bottom-0 w-[3px]"
        style={{
          [align === 'right' ? 'left' : 'right']: 0,
          borderRadius: align === 'right' ? '12px 0 0 12px' : '0 12px 12px 0',
          background: state.isComplete ? 'oklch(0.72 0.20 145)' : cfg.accent,
          boxShadow: `0 0 10px ${state.isComplete ? 'oklch(0.72 0.20 145 / 0.50)' : cfg.glow}`,
        }}
        aria-hidden
      />

      <div className={cn('p-3.5 space-y-1.5', align === 'right' ? 'pl-5' : 'pr-5')}>
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn(
            'rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em]',
            cfg.badgeCls,
          )}>
            {cfg.label}
          </span>

          {isCurrent && mounted && !state.isStarted && (
            <span className="flex items-center gap-1 rounded-full border border-[oklch(0.820_0.155_195/0.40)] bg-[oklch(0.820_0.155_195/0.10)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[oklch(0.88_0.155_195)]">
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute size-full rounded-full bg-[oklch(0.820_0.155_195)] opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[oklch(0.820_0.155_195)]" />
              </span>
              Start Here
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className={cn(
          'text-[13px] font-semibold leading-snug transition-colors',
          state.isComplete
            ? 'text-muted-foreground'
            : 'text-foreground group-hover:text-primary',
        )}>
          {phase.title}
        </h2>

        {phase.subtitle && (
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {phase.subtitle}
          </p>
        )}

        {/* Meta + progress */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="font-mono text-[10px] text-muted-foreground">
            {phase.lessons.length} lessons · {phase.estimatedHours}h
          </span>
          {mounted && state.isStarted && (
            <span className="font-mono text-[10px] font-bold" style={{ color: cfg.accent }}>
              {state.pct}%
            </span>
          )}
        </div>

        {mounted && state.isStarted && (
          <div className="h-1 w-full rounded-full bg-border/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${state.pct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
              style={{ background: cfg.accent, boxShadow: `0 0 6px ${cfg.accent}` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main roadmap ──────────────────────────────────────────────────────── */
export function PhaseRoadmap({ phases, techSlug }: PhaseRoadmapProps) {
  const [mounted, setMounted] = useState(false)
  const technologies = useProgressStore((s) => s.technologies)

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  const completedLessons: string[] = mounted
    ? (technologies[techSlug]?.completedLessons ?? [])
    : []

  /* Derive per-phase state */
  const phaseStates = phases.map((phase) => {
    const total = phase.lessons.length
    const done = phase.lessons.filter((l) =>
      completedLessons.includes(`${techSlug}/${phase.slug}/${l.slug}`)
    ).length
    const pct = total === 0 ? 0 : Math.round((done / total) * 100)
    return { pct, isComplete: pct === 100, isStarted: pct > 0 && pct < 100 }
  })

  /* Current = first in-progress phase, or first incomplete phase */
  const currentIdx: number = mounted
    ? (() => {
        const inProg = phaseStates.findIndex((s) => s.isStarted)
        if (inProg !== -1) return inProg
        const firstInc = phaseStates.findIndex((s) => !s.isComplete)
        return firstInc !== -1 ? firstInc : -1
      })()
    : 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 pb-28">
      <div className="relative">

        {/* ── Vertical spine ─────────────────────────────────────────── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px pointer-events-none"
          style={{
            top: 30,
            bottom: 30,
            background: 'linear-gradient(to bottom, oklch(0.820 0.155 195 / 0.45) 0%, oklch(0.68 0.25 320 / 0.30) 55%, oklch(0.78 0.18 85 / 0.22) 100%)',
          }}
          aria-hidden
        />

        {/* ── Phase rows ─────────────────────────────────────────────── */}
        {phases.map((phase, i) => {
          const state = phaseStates[i]!
          const isCurrent = mounted && i === currentIdx
          const cfg = LEVEL_CFG[phase.level]
          const isLeft = i % 2 === 0
          const href = `/${techSlug}/phases/${phase.slug}`

          return (
            <motion.div
              key={phase.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-24px' }}
              transition={{ duration: 0.38, ease: [0.2, 0, 0, 1], delay: Math.min(i * 0.04, 0.30) }}
            >
              {/* ── Desktop zigzag (sm+) ─────────────────────────── */}
              <div
                className="hidden sm:grid items-center"
                style={{ gridTemplateColumns: '1fr 64px 1fr', minHeight: '112px' }}
              >
                {/* Left slot */}
                <div className="flex items-center justify-end pr-4">
                  {isLeft ? (
                    <Link href={href} className="group block w-full max-w-[300px]">
                      <PhaseCard phase={phase} state={state} isCurrent={isCurrent} cfg={cfg} mounted={mounted} align="right" />
                    </Link>
                  ) : (
                    /* Ghost spacer with faint tick */
                    <div className="h-px w-8 ml-auto rounded-full" style={{ background: cfg.accent, opacity: 0.18 }} />
                  )}
                </div>

                {/* Center node */}
                <div className="flex items-center justify-center z-10">
                  <PhaseNode
                    number={phase.number}
                    isComplete={state.isComplete}
                    isCurrent={isCurrent}
                    cfg={cfg}
                  />
                </div>

                {/* Right slot */}
                <div className="flex items-center justify-start pl-4">
                  {!isLeft ? (
                    <Link href={href} className="group block w-full max-w-[300px]">
                      <PhaseCard phase={phase} state={state} isCurrent={isCurrent} cfg={cfg} mounted={mounted} align="left" />
                    </Link>
                  ) : (
                    <div className="h-px w-8 rounded-full" style={{ background: cfg.accent, opacity: 0.18 }} />
                  )}
                </div>
              </div>

              {/* ── Mobile linear (< sm) ─────────────────────────── */}
              <div className="flex sm:hidden items-center gap-4 py-2">
                <div className="shrink-0 z-10">
                  <PhaseNode
                    number={phase.number}
                    isComplete={state.isComplete}
                    isCurrent={isCurrent}
                    cfg={cfg}
                  />
                </div>
                <Link href={href} className="group flex-1 min-w-0">
                  <PhaseCard phase={phase} state={state} isCurrent={isCurrent} cfg={cfg} mounted={mounted} align="left" />
                </Link>
              </div>
            </motion.div>
          )
        })}

        {/* ── End trophy node ────────────────────────────────────────── */}
        <motion.div
          className="relative flex flex-col items-center gap-3 pt-4 pb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1], delay: 0.15 }}
        >
          <div
            className="relative flex size-16 items-center justify-center rounded-full border-2 border-[oklch(0.78_0.18_85/0.50)] bg-[oklch(0.78_0.18_85/0.08)]"
            style={{ boxShadow: '0 0 32px oklch(0.78 0.18 85 / 0.30), 0 0 64px oklch(0.78 0.18 85 / 0.12)' }}
          >
            <span className="text-2xl" role="img" aria-label="trophy">🏆</span>
          </div>
          <div className="text-center">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[oklch(0.88_0.18_85)]">
              Senior-Ready
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Complete all phases to master the interview
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
