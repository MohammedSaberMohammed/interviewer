'use client'

import { cn } from '@/lib/utils'

interface QuestStepperProps {
  totalSteps: number
  currentStep: number // 0-based index
  className?: string
}

export function QuestStepper({ totalSteps, currentStep, className }: QuestStepperProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep + 1}
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
      className={cn('flex items-center gap-1', className)}
    >
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 flex-1 rounded-full transition-colors duration-200',
            i < currentStep
              ? 'bg-emerald-500 dark:bg-emerald-400'
              : i === currentStep
                ? 'animate-pulse bg-[#512BD4]'
                : 'bg-slate-200 dark:bg-slate-700',
          )}
        />
      ))}
    </div>
  )
}
