'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useBasketStore } from '@/stores/basketStore'
import { useBasketDialog } from '@/components/basket/BasketContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ShoppingBasket, Plus, Trash2, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InterviewTemplatesPage() {
  const [mounted, setMounted] = useState(false)
  const baskets = useBasketStore((s) => s.baskets)
  const deleteBasket = useBasketStore((s) => s.deleteBasket)
  const { openCreate } = useBasketDialog()

  useEffect(() => {
    useBasketStore.persist.rehydrate()
    setMounted(true)
  }, [])

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Interview Templates</h1>
            <p className="text-muted-foreground text-sm">
              Curate question sets for each candidate interview.
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            New template
          </Button>
        </div>

        {!mounted ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : baskets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border">
            <ShoppingBasket className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="font-medium mb-1">No templates yet</p>
            <p className="text-sm text-muted-foreground mb-5">
              Create a template to start collecting questions for a candidate interview.
            </p>
            <Button onClick={openCreate} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create your first template
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {baskets.map((basket) => (
              <div
                key={basket.id}
                className="group relative flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-[#512BD4]/30 hover:bg-accent/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#512BD4]/10">
                  <ShoppingBasket className="h-5 w-5 text-[#512BD4] dark:text-violet-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/interview-templates/${basket.id}`}
                    className="font-semibold text-[15px] hover:text-[#512BD4] transition-colors before:absolute before:inset-0 before:rounded-xl"
                  >
                    {basket.name}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{basket.questionIds.length} question{basket.questionIds.length !== 1 ? 's' : ''}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(basket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); deleteBasket(basket.id) }}
                    aria-label={`Delete ${basket.name}`}
                    className="relative z-10 rounded-md p-1.5 text-muted-foreground/40 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-[#512BD4]/60 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
