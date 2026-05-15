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
  novice:     'text-[oklch(0.82_0.18_195)]',
  apprentice: 'text-[oklch(0.82_0.18_195)]',
  senior:     'text-[oklch(0.85_0.20_320)]',
  architect:  'text-[oklch(0.88_0.18_85)]',
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
      className="hidden md:flex items-center gap-3 rounded-xl border border-border px-3 py-1.5 text-xs transition-all hover:border-[oklch(0.72_0.18_195/0.3)] hover:bg-[oklch(0.72_0.18_195/0.05)]"
      aria-label={`${xpTotal} XP, ${levelLabel}, ${streakDays} day streak`}
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
            <Flame className="size-3 text-[oklch(0.88_0.18_85)]" aria-hidden />
            <span className="font-mono font-bold text-[oklch(0.88_0.18_85)]">{streakDays}</span>
          </span>
        </>
      )}
    </Link>
  )
}
