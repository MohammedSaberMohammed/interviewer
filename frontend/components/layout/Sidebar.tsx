'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Lock } from 'lucide-react'
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
    <aside
      className={cn(
        'w-full rounded-2xl border border-border bg-card/80 dark:bg-[oklch(0.103_0.018_264/0.90)] dark:border-[oklch(0.820_0.155_195/0.10)] backdrop-blur-xl p-5',
        className
      )}
      style={{ boxShadow: 'var(--sidebar-shadow, none)' }}
      aria-label="Phase lessons"
    >
      {/* Phase tag */}
      <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-cyan">
        {phaseTitle}
      </p>
      <p className="mb-4 font-display text-[15px] font-semibold text-foreground">Lessons</p>

      <nav>
        <ul className="flex flex-col gap-0.5">
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
                    'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs transition-all duration-200',
                    isActive
                      ? 'bg-[oklch(0.72_0.18_195/0.12)] text-[oklch(0.44_0.18_230)] dark:bg-[oklch(0.820_0.155_195/0.12)] dark:text-[oklch(0.88_0.155_195)] sidebar-item-active'
                      : isPlaceholder
                        ? 'text-muted-foreground/70 cursor-not-allowed'
                        : isComplete
                          ? 'text-foreground/60 dark:text-[oklch(0.68_0.010_264)] hover:bg-accent hover:text-foreground'
                          : 'text-foreground/60 dark:text-[oklch(0.70_0.010_264)] hover:bg-accent hover:text-foreground',
                  )}
                >
                  {/* Status dot */}
                  {isPlaceholder ? (
                    <Lock className="h-2.5 w-2.5 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                  ) : isComplete ? (
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500"
                      style={{ boxShadow: '0 0 8px oklch(0.72 0.20 145 / 0.7)' }}
                    />
                  ) : isActive ? (
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-[oklch(0.820_0.155_195)]"
                      style={{ boxShadow: '0 0 12px oklch(0.820 0.155 195 / 0.80), 0 0 4px oklch(0.820 0.155 195 / 0.90)' }}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full border border-muted-foreground/40"
                    />
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
