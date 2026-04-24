import Link from 'next/link'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PhaseProgressBar } from '@/components/progress/PhaseProgressBar'
import { PHASE_LEVEL_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Phase } from '@/types/phase'

interface PhaseCardProps {
  phase: Phase
  completedCount?: number
  className?: string
}

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  slate: 'bg-slate-500',
}

export function PhaseCard({ phase, completedCount = 0, className }: PhaseCardProps) {
  const levelConfig = PHASE_LEVEL_CONFIG[phase.level]
  const dotColor = COLOR_MAP[phase.color] ?? 'bg-primary'
  const totalLessons = phase.lessons.length
  const isComplete = totalLessons > 0 && completedCount === totalLessons

  return (
    <Link href={`/phases/${phase.slug}`} className={cn('group block', className)}>
      <Card className={cn(
        'h-full transition-all duration-200',
        'hover:shadow-lg hover:-translate-y-0.5',
        'border-border group-hover:border-primary/30'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg', dotColor, 'bg-opacity-15')}
                aria-hidden="true"
              >
                {phase.emoji}
              </span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Phase {phase.number}</p>
                <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                  {phase.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Badge variant="secondary" className={cn('text-xs', levelConfig.bgClass, levelConfig.textClass, 'border-0')}>
                {levelConfig.label}
              </Badge>
              {isComplete && (
                <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-0">
                  ✓
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-2">{phase.subtitle}</p>

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

          {totalLessons > 0 && (
            <PhaseProgressBar completed={completedCount} total={totalLessons} showLabel={false} />
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalLessons} completed
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
