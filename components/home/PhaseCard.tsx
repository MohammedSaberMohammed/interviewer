import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import { Gem3D } from '@/components/ui/Gem3D'
import { PHASE_LEVEL_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Phase } from '@/types'

interface PhaseCardProps {
  phase: Phase
  completedCount?: number
  className?: string
}

/* Tailwind-safe gradient bg tints per phase color for the illustration strip */
const CARD_TINT: Record<string, string> = {
  blue:   'from-blue-950 to-blue-900',
  indigo: 'from-indigo-950 to-indigo-900',
  violet: 'from-violet-950 to-violet-900',
  purple: 'from-purple-950 to-purple-900',
  amber:  'from-amber-950 to-amber-900',
  teal:   'from-teal-950 to-teal-900',
  rose:   'from-rose-950 to-rose-900',
  cyan:   'from-cyan-950 to-cyan-900',
  green:  'from-green-950 to-green-900',
  orange: 'from-orange-950 to-orange-900',
  slate:  'from-slate-900 to-slate-800',
}

export function PhaseCard({ phase, completedCount = 0, className }: PhaseCardProps) {
  const levelConfig = PHASE_LEVEL_CONFIG[phase.level]
  const cardTint = CARD_TINT[phase.color] ?? CARD_TINT.indigo
  const totalLessons = phase.lessons.length
  const isComplete = totalLessons > 0 && completedCount === totalLessons
  const pct = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100)

  return (
    <Link href={`/phases/${phase.slug}`} className={cn('group block', className)}>
      <div className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card',
        'transition-all duration-200',
        'hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_32px_oklch(0_0_0/0.10)]',
        'dark:hover:border-primary/35 dark:hover:shadow-[0_12px_32px_oklch(0_0_0/0.5)]',
      )}>
        {/* ── Illustration strip (dark gradient + 3D gem) ── */}
        <div className={cn(
          'relative flex items-center justify-center py-7 bg-gradient-to-br',
          cardTint,
        )}>
          {/* Subtle grid texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <Gem3D color={phase.color} emoji={phase.emoji} size={90} />

          {/* Phase number pill */}
          <span className="absolute top-3 left-3 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70 backdrop-blur-sm">
            Phase {phase.number}
          </span>

          {/* Level badge */}
          <span className={cn(
            'absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-medium',
            levelConfig.bgClass,
            levelConfig.textClass,
          )}>
            {levelConfig.label}
          </span>

          {/* Complete badge */}
          {isComplete && (
            <span className="absolute bottom-3 right-3 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/30">
              ✓ Done
            </span>
          )}
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
