import { cn } from '@/lib/utils'
import { DIFFICULTY_CONFIG } from '@/lib/constants'
import type { Difficulty } from '@/types/content'

interface DifficultyBadgeProps {
  level: Difficulty
  className?: string
}

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[level] ?? DIFFICULTY_CONFIG['foundation']
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bgClass,
        config.textClass,
        className
      )}
    >
      {config.label}
    </span>
  )
}
