'use client'

import { useEffect } from 'react'
import { useProgressStore } from '@/stores/progressStore'
import { analytics } from '@/lib/analytics'
import { XPToastProvider } from './XPToast'
import { AchievementToastProvider } from './AchievementToast'
import { LevelUpModal } from './LevelUpModal'
import { BadgeChecker } from './BadgeChecker'

/**
 * Client-only providers that sit at the root layout.
 * Handles: XP toasts, achievement toasts, level-up modal, badge checking,
 * streak hydration on first mount, and daily counter resets.
 */
export function GamificationProviders() {
  const checkStreak = useProgressStore((s) => s.checkStreak)
  const resetDailyCounters = useProgressStore((s) => s.resetDailyCounters)
  const lastDailyReset = useProgressStore((s) => s.lastDailyReset)

  useEffect(() => {
    // Hydrate the store (skipHydration is true — must call manually)
    useProgressStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    // Run streak check on app load
    checkStreak()

    // Reset daily counters if the date rolled over
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    if (lastDailyReset && lastDailyReset !== todayStr) {
      resetDailyCounters()
    }
  }, [checkStreak, resetDailyCounters, lastDailyReset])

  // Wire analytics to store events
  useEffect(() => {
    const onStreakEarned = (e: Event) => {
      analytics.streakDayEarned((e as CustomEvent<{ streakDays: number }>).detail.streakDays)
    }
    const onStreakBroken = (e: Event) => {
      analytics.streakBroken((e as CustomEvent<{ previous: number }>).detail.previous)
    }
    const onStreakFreezeUsed = (e: Event) => {
      analytics.streakFreezeUsed((e as CustomEvent<{ remaining: number }>).detail.remaining)
    }
    const onLevelUp = (e: Event) => {
      const { from, to, xpTotal } = (e as CustomEvent<{ from: string; to: string; xpTotal: number }>).detail
      analytics.levelUp(from, to, xpTotal)
    }
    const onBadgeUnlocked = (e: Event) => {
      analytics.badgeUnlocked((e as CustomEvent<{ badgeId: string }>).detail.badgeId)
    }
    const onDailyGoal = (e: Event) => {
      analytics.dailyGoalMet((e as CustomEvent<{ goal: number }>).detail.goal)
    }

    window.addEventListener('streak:earned', onStreakEarned)
    window.addEventListener('streak:broken', onStreakBroken)
    window.addEventListener('streak:freeze-used', onStreakFreezeUsed)
    window.addEventListener('xp:levelup', onLevelUp)
    window.addEventListener('badge:unlocked', onBadgeUnlocked)
    window.addEventListener('xp:dailygoal', onDailyGoal)

    return () => {
      window.removeEventListener('streak:earned', onStreakEarned)
      window.removeEventListener('streak:broken', onStreakBroken)
      window.removeEventListener('streak:freeze-used', onStreakFreezeUsed)
      window.removeEventListener('xp:levelup', onLevelUp)
      window.removeEventListener('badge:unlocked', onBadgeUnlocked)
      window.removeEventListener('xp:dailygoal', onDailyGoal)
    }
  }, [])

  return (
    <>
      <XPToastProvider />
      <AchievementToastProvider />
      <LevelUpModal />
      <BadgeChecker />
    </>
  )
}
