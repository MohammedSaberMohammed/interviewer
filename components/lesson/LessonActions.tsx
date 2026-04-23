'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, BookmarkPlus, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProgressStore } from '@/stores/progressStore'
import { cn } from '@/lib/utils'

interface LessonActionsProps {
  phaseSlug: string
  lessonSlug: string
}

export function LessonActions({ phaseSlug, lessonSlug }: LessonActionsProps) {
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

  const isComplete = store.completedLessons.includes(lessonId)
  const isBookmarked = store.bookmarkedLessons.includes(lessonId)

  return (
    <div className="flex items-center gap-2">
      {/* Primary action */}
      <button
        type="button"
        onClick={() => isComplete ? store.unmarkLessonComplete(lessonId) : store.markLessonComplete(lessonId)}
        aria-pressed={isComplete}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
          isComplete
            ? 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20 dark:text-emerald-400'
            : 'btn-brand',
        )}
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        {isComplete ? 'Completed' : 'Mark Complete'}
      </button>

      {/* Bookmark */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => store.toggleBookmark(lessonId)}
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
