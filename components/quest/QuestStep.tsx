'use client'

import { useQuestContext } from './QuestContext'
import { cn } from '@/lib/utils'

interface QuestStepProps {
  id: string
  prompt?: string
  children: React.ReactNode
}

export function QuestStep({ id, prompt, children }: QuestStepProps) {
  const ctx = useQuestContext()

  // Non-quest mode — render all steps flat with numbered indicators
  if (!ctx || !ctx.questMode) {
    const stepIndex = ctx?.stepIds?.indexOf(id) ?? -1
    const stepNumber = stepIndex >= 0 ? stepIndex + 1 : null

    return (
      <section data-quest-step={id} className="mb-10">
        {(stepNumber !== null || prompt) && (
          <div className="flex items-start gap-3 mb-4">
            {stepNumber !== null && (
              <div
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white select-none"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                {stepNumber}
              </div>
            )}
            {prompt && (
              <p className="mt-1 text-base font-semibold text-foreground leading-snug">
                {prompt}
              </p>
            )}
          </div>
        )}
        {children}
      </section>
    )
  }

  const isActive = ctx.activeStepId === id
  const stepIndex = ctx.stepIds.indexOf(id)
  const stepNumber = stepIndex + 1

  return (
    <section
      data-quest-step={id}
      aria-hidden={!isActive}
      className={cn(
        'transition-opacity duration-200',
        isActive ? 'opacity-100' : 'hidden',
      )}
    >
      {/* Step header */}
      {(stepNumber > 0 || prompt) && (
        <div className="flex items-start gap-3 mb-5">
          {stepNumber > 0 && (
            <div
              aria-label={`Step ${stepNumber}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white select-none"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            >
              {stepNumber}
            </div>
          )}
          {prompt && (
            <p className="mt-1 text-base font-semibold text-foreground leading-snug">
              {prompt}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
