'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useBasketStore } from '@/stores/basketStore'
import { useBasketDialog } from './BasketContext'
import { ShoppingBasket, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SelectBasketDialog() {
  const { state, closeAll, openCreateForQuestion } = useBasketDialog()
  const baskets = useBasketStore((s) => s.baskets)
  const addQuestionToBasket = useBasketStore((s) => s.addQuestionToBasket)
  const isInBasket = useBasketStore((s) => s.isInBasket)
  const [selected, setSelected] = useState<string | null>(null)

  function handleAdd() {
    if (!selected || !state.pendingQuestion) return
    addQuestionToBasket(selected, state.pendingQuestion)
    closeAll()
    setSelected(null)
  }

  function handleNewBasket() {
    if (state.pendingQuestion) {
      openCreateForQuestion(state.pendingQuestion)
    }
  }

  return (
    <Dialog open={state.selectOpen} onOpenChange={(open) => { if (!open) { closeAll(); setSelected(null) } }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add to template</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-1">
          {baskets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No templates yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {baskets.map((basket) => {
                const alreadyIn = state.pendingQuestion
                  ? isInBasket(basket.id, state.pendingQuestion.id)
                  : false
                const isSelected = selected === basket.id

                return (
                  <button
                    key={basket.id}
                    onClick={() => !alreadyIn && setSelected(basket.id)}
                    disabled={alreadyIn}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                      alreadyIn
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30 cursor-default'
                        : isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40 hover:bg-accent'
                    )}
                  >
                    <ShoppingBasket className={cn(
                      'h-4 w-4 shrink-0',
                      alreadyIn ? 'text-emerald-500' : isSelected ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span className={cn('flex-1 font-medium', alreadyIn && 'text-muted-foreground')}>
                      {basket.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {basket.questionIds.length} Q
                    </span>
                    {alreadyIn && <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                  </button>
                )
              })}
            </div>
          )}

          <button
            onClick={handleNewBasket}
            className="w-full flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create new template
          </button>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => { closeAll(); setSelected(null) }}>
            Cancel
          </Button>
          <Button size="sm" disabled={!selected} onClick={handleAdd}>
            Add to template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
