'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Flame, Star } from 'lucide-react'
import { useProgressStore } from '@/stores/progressStore'
import { XP_LEVELS } from '@/lib/constants'
import type { XPLevel } from '@/types'

function calcLevel(xp: number): XPLevel {
  if (xp >= XP_LEVELS.architect.min) return 'architect'
  if (xp >= XP_LEVELS.senior.min) return 'senior'
  if (xp >= XP_LEVELS.apprentice.min) return 'apprentice'
  return 'novice'
}

const LEVEL_COLORS: Record<XPLevel, string> = {
  novice:     'text-brand-cyan',
  apprentice: 'text-brand-cyan',
  senior:     'text-brand-magenta',
  architect:  'text-brand-amber',
}

export function NavXPChip() {
  const [mounted, setMounted] = useState(false)
  const technologies = useProgressStore((s) => s.technologies)
  const streakDays = useProgressStore((s) => s.streakDays)

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Aggregate XP across all technologies
  const xpTotal = Object.values(technologies).reduce((sum, t) => sum + (t.xpTotal ?? 0), 0)
  if (xpTotal === 0) return null

  const level = calcLevel(xpTotal)
  const levelLabel = XP_LEVELS[level].label
  const textColor = LEVEL_COLORS[level]

  return (
    <Link
      href="/progress"
      className="hidden md:flex items-center gap-3 rounded-xl border border-border px-3 py-1.5 text-xs transition-all hover:border-primary/30 hover:bg-primary/5"
    >
      <span className="flex items-center gap-1">
        <Star className={`size-3 ${textColor}`} aria-hidden />
        <span className={`font-mono font-bold ${textColor}`}>{xpTotal.toLocaleString()}</span>
        <span className="text-muted-foreground">XP</span>
      </span>

      <span className="h-3 w-px bg-border" aria-hidden />

      <span className={`font-mono font-semibold ${textColor}`}>{levelLabel}</span>

      {streakDays > 0 && (
        <>
          <span className="h-3 w-px bg-border" aria-hidden />
          <span className="flex items-center gap-0.5">
            <Flame className="size-3 text-brand-amber" aria-hidden />
            <span className="font-mono font-bold text-brand-amber">{streakDays}</span>
          </span>
        </>
      )}
    </Link>
  )
}
