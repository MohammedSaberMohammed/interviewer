'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, BookmarkPlus, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProgressStore } from '@/stores/progressStore'
import { cn } from '@/lib/utils'

interface LessonActionsProps {
  techSlug: string
  phaseSlug: string
  lessonSlug: string
}

export function LessonActions({ techSlug, phaseSlug, lessonSlug }: LessonActionsProps) {
  const [mounted, setMounted] = useState(false)
  const store = useProgressStore()
  const lessonId = `${phaseSlug}/${lessonSlug}`

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <div className="h-9 w-36 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  const techProgress = store.technologies[techSlug]
  const isComplete = techProgress?.completedLessons.includes(lessonId) ?? false
  const isBookmarked = techProgress?.bookmarkedLessons.includes(lessonId) ?? false

  return (
    <div className="flex items-center gap-2">
      {/* Primary action */}
      <button
        type="button"
        onClick={() => isComplete ? store.unmarkLessonComplete(techSlug, lessonId) : store.markLessonComplete(techSlug, lessonId)}
        aria-pressed={isComplete}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-250',
          isComplete
            ? 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20 dark:text-emerald-400'
            : 'text-[oklch(0.08_0.02_270)] hover:-translate-y-0.5',
        )}
        style={isComplete ? undefined : {
          background: 'linear-gradient(135deg, oklch(0.72 0.18 195), oklch(0.68 0.25 320))',
          boxShadow: '0 0 28px oklch(0.72 0.18 195 / 0.4)',
        }}
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        {isComplete ? 'Completed' : 'Mark Complete'}
      </button>

      {/* Bookmark */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => store.toggleBookmark(techSlug, lessonId)}
        aria-pressed={isBookmarked}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        ) : (
          <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
        )}
        {isBookmarked ? 'Saved' : 'Bookmark'}
      </Button>
    </div>
  )
}
