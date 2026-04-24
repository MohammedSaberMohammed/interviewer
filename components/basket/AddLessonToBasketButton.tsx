'use client'

import { useEffect, useState } from 'react'
import { ShoppingBasket, Check } from 'lucide-react'
import { useBasketStore } from '@/stores/basketStore'
import { useBasketDialog } from './BasketContext'
import { cn } from '@/lib/utils'
import type { Difficulty } from '@/types/content'
import type { BasketQuestion } from '@/types/basket'

interface AddLessonToBasketButtonProps {
  lessonSlug: string
  phaseSlug: string
  lessonTitle: string
  phaseTitle: string
  phaseNumber: number
  difficulty: Difficulty
  summary?: string
  /** Icon-only compact variant for use in lesson lists */
  iconOnly?: boolean
  className?: string
}

export function AddLessonToBasketButton({
  lessonSlug,
  phaseSlug,
  lessonTitle,
  phaseTitle,
  phaseNumber,
  difficulty,
  summary = '',
  iconOnly = false,
  className,
}: AddLessonToBasketButtonProps) {
  const [mounted, setMounted] = useState(false)
  const baskets = useBasketStore((s) => s.baskets)
  const isInAnyBasket = useBasketStore((s) => s.isInAnyBasket)
  const { openCreateForQuestion, openSelect } = useBasketDialog()

  useEffect(() => {
    useBasketStore.persist.rehydrate()
    setMounted(true)
  }, [])

  if (!mounted) return null

  const id = `${phaseSlug}/${lessonSlug}`
  const inAnyBasket = isInAnyBasket(id)

  const lessonItem: BasketQuestion = {
    id,
    type: 'lesson',
    title: lessonTitle,
    summary,
    difficulty,
    lessonSlug,
    phaseSlug,
    lessonTitle,
    phaseTitle,
    phaseNumber,
    addedAt: 0,
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (baskets.length === 0) {
      openCreateForQuestion(lessonItem)
    } else {
      openSelect(lessonItem)
    }
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={inAnyBasket ? 'In a template' : 'Add lesson to template'}
        aria-label={inAnyBasket ? 'Lesson already in a basket' : 'Add lesson to template'}
        className={cn(
          'flex items-center justify-center rounded-md border px-2 py-1.5 transition-colors shrink-0 text-xs font-medium gap-1',
          inAnyBasket
            ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
            : 'border-border bg-background text-muted-foreground hover:border-[#512BD4]/50 hover:text-[#512BD4] hover:bg-[#512BD4]/5 dark:hover:border-violet-500/40 dark:hover:text-violet-300',
          className,
        )}
      >
        {inAnyBasket
          ? <Check className="h-3.5 w-3.5" />
          : <ShoppingBasket className="h-3.5 w-3.5" />
        }
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={inAnyBasket ? 'In a template' : 'Add lesson to template'}
      aria-label={inAnyBasket ? 'Lesson already in a basket' : 'Add lesson to template'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
        inAnyBasket
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400'
          : 'border-border text-muted-foreground hover:border-[#512BD4]/40 hover:bg-[#512BD4]/5 hover:text-[#512BD4] dark:hover:border-violet-500/40 dark:hover:text-violet-300',
        className,
      )}
    >
      {inAnyBasket
        ? <Check className="h-3.5 w-3.5" />
        : <ShoppingBasket className="h-3.5 w-3.5" />
      }
      {inAnyBasket ? 'In template' : 'Add to template'}
    </button>
  )
}
