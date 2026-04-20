'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface XPEntry {
  id: number
  amount: number
  reason: string
  visible: boolean
}

let _nextId = 0

export function XPToastProvider() {
  const [entries, setEntries] = useState<XPEntry[]>([])

  const handleAward = useCallback((e: Event) => {
    const { amount, reason } = (e as CustomEvent<{ amount: number; reason: string }>).detail
    const id = ++_nextId
    setEntries((prev) => [...prev, { id, amount, reason, visible: false }])

    // Trigger enter transition on next tick
    requestAnimationFrame(() => {
      setEntries((prev) => prev.map((x) => (x.id === id ? { ...x, visible: true } : x)))
    })

    // Begin exit
    setTimeout(() => {
      setEntries((prev) => prev.map((x) => (x.id === id ? { ...x, visible: false } : x)))
    }, 2000)

    // Remove from DOM
    setTimeout(() => {
      setEntries((prev) => prev.filter((x) => x.id !== id))
    }, 2400)
  }, [])

  useEffect(() => {
    window.addEventListener('xp:award', handleAward)
    return () => window.removeEventListener('xp:award', handleAward)
  }, [handleAward])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
    >
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/80 transition-all duration-200"
          style={{
            opacity: entry.visible ? 1 : 0,
            transform: entry.visible ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <span className="text-base" aria-hidden="true">⚡</span>
          <span className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
            +{entry.amount} XP
          </span>
          {entry.reason && (
            <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
              {entry.reason}
            </span>
          )}
        </div>
      ))}
    </div>,
    document.body,
  )
}
