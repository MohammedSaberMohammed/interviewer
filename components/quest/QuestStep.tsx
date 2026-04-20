'use client'

import { useQuestContext } from './QuestContext'
import { cn } from '@/lib/utils'

interface QuestStepProps {
  id: string
  prompt?: string
  children: React.ReactNode
}

/**
 * Wraps a logical step in quest-mode lessons.
 * When used inside a QuestLayout (questMode enabled), only the active step is shown.
 * Outside of quest mode (article mode), all steps render normally.
 */
export function QuestStep({ id, prompt, children }: QuestStepProps) {
  const ctx = useQuestContext()

  // Article mode — render everything flat
  if (!ctx || !ctx.questMode) {
    return (
      <section data-quest-step={id} className="mb-8">
        {prompt && (
          <p className="mb-3 text-[15px] font-medium text-slate-700 dark:text-slate-300">
            {prompt}
          </p>
        )}
        {children}
      </section>
    )
  }

  const isActive = ctx.activeStepId === id
  const stepIndex = ctx.stepIds.indexOf(id)
  const isDone = stepIndex < ctx.stepIds.indexOf(ctx.activeStepId)

  return (
    <section
      data-quest-step={id}
      aria-hidden={!isActive}
      className={cn(
        'transition-opacity duration-200',
        isActive ? 'opacity-100' : 'hidden',
      )}
    >
      {prompt && (
        <p className="mb-3 text-[15px] font-medium text-slate-700 dark:text-slate-300">
          {prompt}
        </p>
      )}
      {children}
    </section>
  )
}
