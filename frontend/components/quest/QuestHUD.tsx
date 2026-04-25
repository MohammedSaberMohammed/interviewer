'use client'

import { useRouter } from 'next/navigation'
import { useProgressStore } from '@/stores/progressStore'
import { QuestStepper } from './QuestStepper'
import { StreakBadge } from './StreakBadge'
import { cn } from '@/lib/utils'

interface QuestHUDProps {
  phaseSlug: string
  totalSteps: number
  currentStep: number
  xpEarnedThisSession: number
  className?: string
}

export function QuestHUD({
  phaseSlug,
  totalSteps,
  currentStep,
  xpEarnedThisSession,
  className,
}: QuestHUDProps) {
  const router = useRouter()
  const streakDays = useProgressStore((s) => s.streakDays)

  return (
    <div
      className={cn(
        'sticky top-14 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur-sm',
        className,
      )}
    >
      {/* Exit */}
      <button
        type="button"
        onClick={() => router.push(`/phases/${phaseSlug}`)}
        aria-label="Exit quest and return to phase"
        className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Step progress */}
      <QuestStepper
        totalSteps={totalSteps}
        currentStep={currentStep}
        className="min-w-0 flex-1"
      />

      {/* Streak */}
      <StreakBadge count={streakDays} className="shrink-0" />

      {/* XP delta */}
      {xpEarnedThisSession > 0 && (
        <span
          className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
          aria-label={`${xpEarnedThisSession} XP earned this session`}
        >
          +{xpEarnedThisSession} XP
        </span>
      )}
    </div>
  )
}
