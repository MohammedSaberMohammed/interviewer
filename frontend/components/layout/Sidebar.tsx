'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Lock } from 'lucide-react'
import { useProgressStore } from '@/stores/progressStore'
import type { LessonMeta } from '@/types'

interface SidebarProps {
  techSlug: string
  phaseSlug: string
  phaseTitle: string
  lessons: LessonMeta[]
  className?: string
}

export function Sidebar({ techSlug, phaseSlug, phaseTitle, lessons, className }: SidebarProps) {
  const pathname = usePathname()
  const technologies = useProgressStore((s) => s.technologies)
  const completedLessons = technologies[techSlug]?.completedLessons ?? []

  return (
    <aside className={cn('w-full', className)} aria-label="Phase lessons">
      <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {phaseTitle}
      </p>
      <nav>
        <ul className="space-y-px">
          {lessons.map((lesson) => {
            const href = `/${techSlug}/phases/${phaseSlug}/${lesson.slug}`
            const isActive = pathname === href
            const isComplete = completedLessons.includes(`${phaseSlug}/${lesson.slug}`)
            const isPlaceholder = lesson.status === 'draft'

            return (
              <li key={lesson.slug}>
                <Link
                  href={isPlaceholder ? '#' : href}
                  aria-current={isActive ? 'page' : undefined}
                  aria-disabled={isPlaceholder}
                  onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
                  className={cn(
                    'group relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors',
                    isActive
                      ? 'bg-primary/8 text-primary font-medium dark:bg-primary/12'
                      : isPlaceholder
                        ? 'text-muted-foreground/40 cursor-not-allowed'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                      style={{ background: 'linear-gradient(180deg, #6366F1, #8B5CF6)' }}
                    />
                  )}

                  {isComplete ? (
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" aria-label="Completed" />
                  ) : isPlaceholder ? (
                    <Lock className="h-3 w-3 shrink-0 text-muted-foreground/30" aria-label="Coming soon" />
                  ) : (
                    <Circle className="h-3 w-3 shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" aria-label="Not started" />
                  )}

                  <span className="line-clamp-2 leading-snug">{lesson.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
