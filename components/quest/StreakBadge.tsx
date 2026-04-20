'use client'

import { cn } from '@/lib/utils'

interface StreakBadgeProps {
  count: number
  at_risk?: boolean
  className?: string
}

export function StreakBadge({ count, at_risk = false, className }: StreakBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium tabular-nums',
        'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
        at_risk && 'animate-pulse',
        className,
      )}
      aria-label={`${count}-day streak${at_risk ? ', at risk' : ''}`}
    >
      <span aria-hidden="true" className="text-base leading-none">🔥</span>
      <span>{count}</span>
    </span>
  )
}
