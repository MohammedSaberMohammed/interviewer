import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface PhaseProgressBarProps {
  completed: number
  total: number
  showLabel?: boolean
  className?: string
}

export function PhaseProgressBar({ completed, total, showLabel = true, className }: PhaseProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Progress value={pct} className="h-2 flex-1" aria-label={`${pct}% complete`} />
      {showLabel && (
        <span className="text-xs tabular-nums text-muted-foreground w-16 text-right shrink-0">
          {completed}/{total} ({pct}%)
        </span>
      )}
    </div>
  )
}
