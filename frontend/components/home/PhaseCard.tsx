import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import { PHASE_LEVEL_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Phase } from '@/types'

interface PhaseCardProps {
  phase: Phase
  techSlug: string
  completedCount?: number
  className?: string
}

const EMOJI_BG: Record<string, string> = {
  blue:   'bg-blue-100 dark:bg-blue-900/30',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30',
  violet: 'bg-violet-100 dark:bg-violet-900/30',
  purple: 'bg-purple-100 dark:bg-purple-900/30',
  amber:  'bg-amber-100 dark:bg-amber-900/30',
  teal:   'bg-teal-100 dark:bg-teal-900/30',
  rose:   'bg-rose-100 dark:bg-rose-900/30',
  cyan:   'bg-cyan-100 dark:bg-cyan-900/30',
  green:  'bg-green-100 dark:bg-green-900/30',
  orange: 'bg-orange-100 dark:bg-orange-900/30',
  slate:  'bg-slate-100 dark:bg-slate-800/50',
}

export function PhaseCard({ phase, techSlug, completedCount = 0, className }: PhaseCardProps) {
  const levelConfig = PHASE_LEVEL_CONFIG[phase.level]
  const emojiBg = EMOJI_BG[phase.color] ?? EMOJI_BG.indigo
  const totalLessons = phase.lessons.length
  const isComplete = totalLessons > 0 && completedCount === totalLessons
  const pct = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100)

  return (
    <Link href={`/${techSlug}/phases/${phase.slug}`} className={cn('group block', className)}>
      <div className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card',
        'transition-all duration-200',
        'hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_32px_oklch(0_0_0/0.10)]',
        'dark:hover:border-primary/35 dark:hover:shadow-[0_12px_32px_oklch(0_0_0/0.5)]',
      )}>
        {/* ── Card header: phase number + emoji + badges ── */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-xl', emojiBg)}>
              {phase.emoji}
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Phase {phase.number}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {isComplete && (
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                ✓ Done
              </span>
            )}
            <span className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-medium',
              levelConfig.bgClass,
              levelConfig.textClass,
            )}>
              {levelConfig.label}
            </span>
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Title + subtitle */}
          <div>
            <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {phase.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {phase.subtitle}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {phase.estimatedHours}h
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" aria-hidden="true" />
              {totalLessons} lessons
            </span>
          </div>

          {/* Progress */}
          {totalLessons > 0 && (
            <div className="mt-auto space-y-1">
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
                  aria-label={`${pct}% complete`}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {completedCount} / {totalLessons} lessons
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
