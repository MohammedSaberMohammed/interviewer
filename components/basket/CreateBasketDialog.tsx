'use client'

import { useState, useRef, useEffect } from 'react'
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

export function CreateBasketDialog() {
  const { state, closeAll } = useBasketDialog()
  const createBasket = useBasketStore((s) => s.createBasket)
  const addQuestionToBasket = useBasketStore((s) => s.addQuestionToBasket)
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.createOpen) {
      setName('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [state.createOpen])

  function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    const basket = createBasket(trimmed)
    if (state.postCreateAction === 'add' && state.pendingQuestion) {
      addQuestionToBasket(basket.id, state.pendingQuestion)
    }
    closeAll()
  }

  return (
    <Dialog open={state.createOpen} onOpenChange={(open) => !open && closeAll()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New candidate basket</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <p className="text-sm text-muted-foreground">
            Give your basket a name — for example: &ldquo;John interview&rdquo; or &ldquo;Senior .NET 2024&rdquo;.
          </p>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Basket name…"
            maxLength={60}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-0 transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeAll} size="sm">
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()} size="sm">
            Create basket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
