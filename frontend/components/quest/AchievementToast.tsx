'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { BADGES } from '@/lib/constants'

interface AchievementEntry {
  id: number
  badgeId: string
  visible: boolean
}

let _nextId = 0

export function AchievementToastProvider() {
  const [entries, setEntries] = useState<AchievementEntry[]>([])
  const router = useRouter()

  const handleUnlock = useCallback((e: Event) => {
    const { badgeId } = (e as CustomEvent<{ badgeId: string }>).detail
    const id = ++_nextId
    setEntries((prev) => [...prev, { id, badgeId, visible: false }])

    requestAnimationFrame(() => {
      setEntries((prev) => prev.map((x) => (x.id === id ? { ...x, visible: true } : x)))
    })

    setTimeout(() => {
      setEntries((prev) => prev.map((x) => (x.id === id ? { ...x, visible: false } : x)))
    }, 3600)

    setTimeout(() => {
      setEntries((prev) => prev.filter((x) => x.id !== id))
    }, 4000)
  }, [])

  useEffect(() => {
    window.addEventListener('badge:unlocked', handleUnlock)
    return () => window.removeEventListener('badge:unlocked', handleUnlock)
  }, [handleUnlock])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
    >
      {entries.map((entry) => {
        const badge = BADGES.find((b) => b.id === entry.badgeId)
        if (!badge) return null
        return (
          <button
            key={entry.id}
            onClick={() => router.push('/progress')}
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-[#6366F1]/30 bg-white px-4 py-3 shadow-sm dark:border-[#6366F1]/40 dark:bg-slate-900 transition-all duration-220"
            style={{
              opacity: entry.visible ? 1 : 0,
              transform: entry.visible ? 'translateY(0)' : 'translateY(8px)',
            }}
            aria-label={`Badge unlocked: ${badge.title}. Click to view on progress page.`}
          >
            <span className="text-2xl" aria-hidden="true">{badge.icon}</span>
            <div className="text-left">
              <p className="text-xs font-medium text-[#6366F1] dark:text-indigo-400">Badge unlocked</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{badge.title}</p>
            </div>
          </button>
        )
      })}
    </div>,
    document.body,
  )
}
