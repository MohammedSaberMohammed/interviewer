'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBasket } from 'lucide-react'
import { useBasketStore } from '@/stores/basketStore'
import { useBasketDialog } from './BasketContext'

export function FloatingBasketButton() {
  const [mounted, setMounted] = useState(false)
  const baskets = useBasketStore((s) => s.baskets)
  const { openCreate } = useBasketDialog()
  const totalQuestions = baskets.reduce((acc, b) => acc + b.questionIds.length, 0)

  useEffect(() => {
    useBasketStore.persist.rehydrate()
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
      {/* New basket button */}
      <div className="group relative">
        <button
          type="button"
          onClick={openCreate}
          aria-label="New interview template"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#6366F1]/30 bg-white shadow-md transition-all hover:scale-105 hover:border-[#6366F1] hover:shadow-lg dark:bg-slate-900 dark:border-indigo-500/30 dark:hover:border-indigo-400"
        >
          <ShoppingBasket className="h-5 w-5 text-[#6366F1] dark:text-indigo-300" />
          {totalQuestions > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#6366F1] text-[10px] font-bold text-white">
              {totalQuestions > 99 ? '99+' : totalQuestions}
            </span>
          )}
        </button>
        {/* Tooltip */}
        <div className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
          New interview template
          <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 border-b border-r border-border bg-popover" />
        </div>
      </div>

      {/* View templates link (only shown if templates exist) */}
      {baskets.length > 0 && (
        <Link
          href="/interview-templates"
          className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:border-[#6366F1]/40 hover:text-[#6366F1] dark:bg-slate-900"
        >
          {baskets.length} template{baskets.length !== 1 ? 's' : ''}
        </Link>
      )}
    </div>
  )
}
