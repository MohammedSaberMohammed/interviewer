'use client'

import { useEffect, useState } from 'react'
import { ShoppingBasket, Check } from 'lucide-react'
import { useBasketStore } from '@/stores/basketStore'
import { useBasketDialog } from './BasketContext'
import { cn } from '@/lib/utils'
import type { BasketQuestion } from '@/types'

interface AddToBasketButtonProps {
  question: BasketQuestion
  className?: string
}

export function AddToBasketButton({ question, className }: AddToBasketButtonProps) {
  const [mounted, setMounted] = useState(false)
  const baskets = useBasketStore((s) => s.baskets)
  const isInAnyBasket = useBasketStore((s) => s.isInAnyBasket)
  const { openCreateForQuestion, openSelect } = useBasketDialog()

  useEffect(() => {
    useBasketStore.persist.rehydrate()
    setMounted(true)
  }, [])

  if (!mounted) return null

  const inAnyBasket = isInAnyBasket(question.id)

  function handleClick() {
    if (baskets.length === 0) {
      openCreateForQuestion(question)
    } else {
      openSelect(question)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={inAnyBasket ? 'Added to template' : 'Add to template'}
      aria-label={inAnyBasket ? 'Already in a template' : 'Add question to template'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
        inAnyBasket
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400'
          : 'border-border text-muted-foreground hover:border-[#6366F1]/40 hover:bg-[#6366F1]/5 hover:text-[#6366F1] dark:hover:border-indigo-500/40 dark:hover:text-indigo-300',
        className,
      )}
    >
      {inAnyBasket ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <ShoppingBasket className="h-3.5 w-3.5" />
      )}
      {inAnyBasket ? 'In template' : 'Add to template'}
    </button>
  )
}
