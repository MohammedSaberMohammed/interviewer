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
        <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
      </div>
    )
  }

  const isComplete = store.completedLessons.includes(lessonId)
  const isBookmarked = store.bookmarkedLessons.includes(lessonId)

  const handleComplete = () => {
    if (isComplete) {
      store.unmarkLessonComplete(lessonId)
    } else {
      store.markLessonComplete(lessonId)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={isComplete ? 'default' : 'outline'}
        size="sm"
        className={cn('gap-1.5 text-xs', isComplete && 'bg-green-600 hover:bg-green-700 border-green-600')}
        onClick={handleComplete}
        aria-pressed={isComplete}
      >
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        {isComplete ? 'Completed' : 'Mark Complete'}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={() => store.toggleBookmark(lessonId)}
        aria-pressed={isBookmarked}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        ) : (
          <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </Button>
    </div>
  )
}
