'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Lock } from 'lucide-react'
import { useProgressStore } from '@/stores/progressStore'
import type { LessonMeta } from '@/types/lesson'

interface SidebarProps {
  phaseSlug: string
  phaseTitle: string
  lessons: LessonMeta[]
  className?: string
}

export function Sidebar({ phaseSlug, phaseTitle, lessons, className }: SidebarProps) {
  const pathname = usePathname()
  const completedLessons = useProgressStore((s) => s.completedLessons)

  return (
    <aside className={cn('w-full', className)} aria-label="Phase lessons">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {phaseTitle}
        </p>
      </div>
      <nav>
        <ul className="space-y-0.5">
          {lessons.map((lesson) => {
            const href = `/phases/${phaseSlug}/${lesson.slug}`
            const isActive = pathname === href
            const isComplete = completedLessons.includes(`${phaseSlug}/${lesson.slug}`)
            const isPlaceholder = lesson.status === 'draft'

            return (
              <li key={lesson.slug}>
                <Link
                  href={isPlaceholder ? '#' : href}
                  aria-current={isActive ? 'page' : undefined}
                  aria-disabled={isPlaceholder}
                  className={cn(
                    'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : isPlaceholder
                        ? 'text-muted-foreground/50 cursor-not-allowed'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                  onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-label="Completed" />
                  ) : isPlaceholder ? (
                    <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" aria-label="Coming soon" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" aria-label="Not started" />
                  )}
                  <span className="line-clamp-2 leading-tight">{lesson.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
