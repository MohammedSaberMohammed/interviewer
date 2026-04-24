'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { XP_LEVELS } from '@/lib/constants'
import type { XPLevel } from '@/types/progress'

interface LevelUpEvent {
  from: XPLevel
  to: XPLevel
  xpTotal: number
}

export function LevelUpModal() {
  const [event, setEvent] = useState<LevelUpEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      setEvent((e as CustomEvent<LevelUpEvent>).detail)
    }
    window.addEventListener('xp:levelup', handler)
    return () => window.removeEventListener('xp:levelup', handler)
  }, [])

  if (!event) return null

  const levelConfig = XP_LEVELS[event.to]

  return (
    <Dialog open={true} onOpenChange={() => setEvent(null)}>
      <DialogContent
        className="max-w-md border-0 bg-gradient-to-b from-[#512BD4] to-[#3b1fa0] text-white shadow-lg"
        aria-describedby="levelup-description"
      >
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 text-5xl" aria-hidden="true">🎉</div>
          <DialogTitle className="text-2xl font-semibold text-white">
            Level Up!
          </DialogTitle>
          <p className="mt-1 text-lg font-medium text-violet-200">
            You are now <span className="text-white">{levelConfig.label}</span>
          </p>
        </DialogHeader>

        <DialogDescription id="levelup-description" className="mt-3 text-center text-[15px] leading-relaxed text-violet-100">
          {levelConfig.message}
        </DialogDescription>

        <div className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-center text-sm text-violet-200">
          Total XP: <span className="font-semibold tabular-nums text-white">{event.xpTotal.toLocaleString()}</span>
        </div>

        <button
          onClick={() => setEvent(null)}
          className="mt-5 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-[#512BD4] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          autoFocus
        >
          Keep going
        </button>
      </DialogContent>
    </Dialog>
  )
}
