'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Flame, BookOpen, Target, RotateCcw, Zap } from 'lucide-react'
import { useProgressStore } from '@/stores/progressStore'
import { PhaseProgressBar } from './PhaseProgressBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DailyQuestCard } from '@/components/quest/DailyQuestCard'
import { BADGES, XP_LEVELS } from '@/lib/constants'
import type { Phase } from '@/types/phase'

interface ProgressDashboardProps {
  phases: Phase[]
}

export function ProgressDashboard({ phases }: ProgressDashboardProps) {
  const [mounted, setMounted] = useState(false)
  const store = useProgressStore()

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-16 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalLessons = phases.reduce((acc, p) => acc + p.lessons.length, 0)
  const totalProgress = store.getTotalProgress(totalLessons)
  const weakAreas = store.getWeakAreas()
  const bookmarks = store.bookmarkedLessons

  const handleReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      store.reset()
    }
  }

  const levelConfig = XP_LEVELS[store.level]
  const levelProgress = store.getLevelProgress()
  const xpToNext = store.getXPToNextLevel()

  return (
    <div className="space-y-8">
      {/* Daily quest + XP level side-by-side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyQuestCard
          nextQuestHref="/phases/01-csharp-core"
          nextQuestTitle="Phase 1 — C# Core"
        />

        {/* Level + XP card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Level</h3>
            <span className="rounded-full bg-[#512BD4]/10 px-2.5 py-0.5 text-xs font-semibold text-[#512BD4] dark:bg-violet-950/40 dark:text-violet-300">
              {levelConfig.label}
            </span>
          </div>
          <p className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {store.xpTotal.toLocaleString()} <span className="text-sm font-normal text-slate-400">XP</span>
          </p>
          {store.level !== 'architect' && (
            <>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#512BD4] to-violet-400 transition-all duration-300"
                  style={{ width: `${levelProgress}%` }}
                  role="progressbar"
                  aria-valuenow={levelProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${levelProgress}% to next level`}
                />
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {xpToNext.toLocaleString()} XP to {
                  store.level === 'novice' ? 'Apprentice' :
                  store.level === 'apprentice' ? 'Senior' : 'Architect'
                }
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProgress}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {store.completedLessons.length} of {totalLessons} lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" /> Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{store.streakDays}</p>
            <p className="text-xs text-muted-foreground mt-1">
              days in a row
              {store.streakFreezeCount > 0 && ` · ${store.streakFreezeCount} freeze${store.streakFreezeCount > 1 ? 's' : ''}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-500" /> Challenges Answered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Object.keys(store.challengeAnswers).length}</p>
            <p className="text-xs text-muted-foreground mt-1">total attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {BADGES.map((badge) => {
            const unlocked = store.unlockedBadges.includes(badge.id)
            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-3 text-center transition-colors ${
                  unlocked
                    ? 'border-[#512BD4]/30 bg-[#512BD4]/5 dark:border-violet-500/30 dark:bg-violet-950/20'
                    : 'border-slate-200 bg-slate-50 opacity-40 dark:border-slate-800 dark:bg-slate-900/60'
                }`}
                title={badge.description}
              >
                <span className="text-2xl" aria-hidden="true">{badge.icon}</span>
                <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{badge.title}</p>
                {!unlocked && (
                  <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{badge.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Phase progress */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Phase Progress</h2>
        <div className="space-y-3">
          {phases.map((phase) => {
            const completed = store.completedLessons.filter((id) =>
              id.startsWith(`${phase.slug}/`)
            ).length
            return (
              <div key={phase.slug} className="flex items-center gap-4">
                <Link
                  href={`/phases/${phase.slug}`}
                  className="w-40 shrink-0 text-sm font-medium hover:text-primary transition-colors truncate"
                >
                  <span aria-hidden="true">{phase.emoji}</span> {phase.title}
                </Link>
                <div className="flex-1">
                  <PhaseProgressBar completed={completed} total={phase.lessons.length} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weak areas */}
      {weakAreas.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Weak Areas</h2>
          <div className="space-y-2">
            {weakAreas.map(({ phaseSlug, accuracy }) => (
              <div key={phaseSlug} className="flex items-center justify-between rounded-lg border border-border bg-rose-50 dark:bg-rose-950/20 px-4 py-2">
                <Link href={`/phases/${phaseSlug}`} className="text-sm font-medium hover:text-primary transition-colors">
                  {phaseSlug}
                </Link>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">{accuracy}% accuracy</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Bookmarks</h2>
          <div className="flex flex-wrap gap-2">
            {bookmarks.map((id) => {
              const [phaseSlug, lessonSlug] = id.split('/') as [string, string]
              return (
                <Link
                  key={id}
                  href={`/phases/${phaseSlug}/${lessonSlug}`}
                  className="rounded-full border border-border bg-muted px-3 py-1 text-xs hover:bg-accent transition-colors"
                >
                  {lessonSlug}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {store.completedLessons.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-border bg-muted/20">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
          <h3 className="font-semibold mb-1">No progress yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start with Phase 1 to begin tracking your journey.</p>
          <Button render={<Link href="/phases/01-csharp-core" />}>Start Phase 1</Button>
        </div>
      )}

      {/* Reset */}
      <div className="pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset All Progress
        </Button>
      </div>
    </div>
  )
}
