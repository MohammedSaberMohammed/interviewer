'use client'

import { useEffect } from 'react'
import { useProgressStore } from '@/stores/progressStore'

/**
 * Listens for lesson:complete events and unlocks badges based on criteria.
 * Runs silently in the background; the AchievementToast handles the UI.
 */
export function BadgeChecker() {
  const unlockBadge = useProgressStore((s) => s.unlockBadge)
  const streakDays = useProgressStore((s) => s.streakDays)
  const technologies = useProgressStore((s) => s.technologies)

  // Streak-based badges — check whenever streak changes
  useEffect(() => {
    if (streakDays >= 7)  unlockBadge('dotnet', 'streak-keeper')
    if (streakDays >= 30) unlockBadge('dotnet', 'streak-legend')
  }, [streakDays, unlockBadge])

  // Study-time badges — checked on each lesson complete event
  useEffect(() => {
    function onLessonComplete(e: Event) {
      const { techSlug, phaseSlug, completedLessons: all } = (
        e as CustomEvent<{
          techSlug: string
          phaseSlug: string
          lessonSlug: string
          accuracy: number
          completedLessons: string[]
        }>
      ).detail

      // Foundation Solid — complete Phase 1
      const phase1Done = all.filter((id) => id.startsWith('01-csharp-core/')).length
      const PHASE1_TOTAL = 15
      if (phase1Done >= PHASE1_TOTAL) unlockBadge(techSlug, 'foundation-solid')

      // Memory Wizard — complete Phase 4
      const phase4Done = all.filter((id) => id.startsWith('04-memory-gc/')).length
      const PHASE4_TOTAL = 15
      if (phase4Done >= PHASE4_TOTAL) unlockBadge(techSlug, 'memory-wizard')

      // Trap Hunter — complete all of Phase 13
      const phase13Done = all.filter((id) => id.startsWith('13-interview-traps/')).length
      const PHASE13_TOTAL = 20
      if (phase13Done >= PHASE13_TOTAL) unlockBadge(techSlug, 'trap-hunter')

      // First Trap Spotted — first Phase 13 challenge answered
      if (phaseSlug === '13-interview-traps') unlockBadge(techSlug, 'first-trap-spotted')

      // Senior Certified — all 13 phases complete
      const TOTAL_LESSONS = 220
      if (all.length >= TOTAL_LESSONS) unlockBadge(techSlug, 'senior-certified')

      // Study time badges
      const hour = new Date().getHours()
      if (hour >= 22 || hour < 4) {
        // Night Owl — track in localStorage (outside Zustand; 5 sessions needed)
        const key = 'night-owl-sessions'
        const count = parseInt(localStorage.getItem(key) ?? '0') + 1
        localStorage.setItem(key, String(count))
        if (count >= 5) unlockBadge(techSlug, 'night-owl')
      }
      if (hour >= 5 && hour < 8) {
        const key = 'early-bird-sessions'
        const count = parseInt(localStorage.getItem(key) ?? '0') + 1
        localStorage.setItem(key, String(count))
        if (count >= 5) unlockBadge(techSlug, 'early-bird')
      }

      // Weekend Warrior
      const day = new Date().getDay()
      if (day === 6 || day === 0) {
        const key = 'weekend-warrior-days'
        const existing = new Set(JSON.parse(localStorage.getItem(key) ?? '[]') as number[])
        existing.add(day)
        localStorage.setItem(key, JSON.stringify([...existing]))
        if (existing.has(0) && existing.has(6)) unlockBadge(techSlug, 'weekend-warrior')
      }
    }

    window.addEventListener('lesson:complete', onLessonComplete)
    return () => window.removeEventListener('lesson:complete', onLessonComplete)
  }, [unlockBadge])

  // Accuracy-based badges — check when challenge answers change across all techs
  useEffect(() => {
    for (const [techSlug, tech] of Object.entries(technologies)) {
      const challengeAnswers = tech.challengeAnswers

      // Async Master — 100% accuracy on Phase 5
      const phase5Answers = Object.values(challengeAnswers).filter((a) =>
        a.challengeId.startsWith('05-'),
      )
      if (phase5Answers.length > 0 && phase5Answers.every((a) => a.correct)) {
        unlockBadge(techSlug, 'async-master')
      }

      // Perfect Phase — 100% accuracy on any full phase
      const byPhase: Record<string, { correct: number; total: number }> = {}
      for (const a of Object.values(challengeAnswers)) {
        const phase = a.challengeId.split('/')[0]
        if (!phase) continue
        if (!byPhase[phase]) byPhase[phase] = { correct: 0, total: 0 }
        byPhase[phase].total++
        if (a.correct) byPhase[phase].correct++
      }
      const MIN_ANSWERS = 5
      for (const stats of Object.values(byPhase)) {
        if (stats.total >= MIN_ANSWERS && stats.correct === stats.total) {
          unlockBadge(techSlug, 'perfect-phase')
          break
        }
      }
    }
  }, [technologies, unlockBadge])

  return null
}
