'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Code2, HelpCircle, BookOpen, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import { CodeChallenge } from '@/components/lesson/CodeChallenge'
import { Quiz } from '@/components/lesson/Quiz'
import { LessonContextProvider } from '@/components/lesson/LessonContext'
import type { ExtractedChallenge, Difficulty } from '@/types'

type FilterTab = 'all' | 'quiz' | 'code'

interface ChallengesExplorerProps {
  challenges: ExtractedChallenge[]
}

function EmptyPanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-muted/20 p-12 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
      >
        <Layers className="h-7 w-7 text-white" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold text-foreground">Select a challenge</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick one from the list to practice
        </p>
      </div>
    </div>
  )
}

export function ChallengesExplorer({ challenges }: ChallengesExplorerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(challenges[0]?.id ?? null)
  const [filter, setFilter] = useState<FilterTab>('all')

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? challenges
        : challenges.filter((c) => (filter === 'quiz' ? c.type === 'quiz' : c.type === 'challenge')),
    [challenges, filter],
  )

  // Group: techSlug → phaseSlug → lessonSlug
  const grouped = useMemo(() => {
    const byTech = new Map<
      string,
      {
        techTitle: string
        phases: Map<
          string,
          {
            phaseTitle: string
            phaseNumber: number
            lessons: Map<string, { lessonTitle: string; challenges: ExtractedChallenge[] }>
          }
        >
      }
    >()

    for (const c of filtered) {
      if (!byTech.has(c.techSlug)) {
        byTech.set(c.techSlug, { techTitle: c.techTitle, phases: new Map() })
      }
      const tech = byTech.get(c.techSlug)!
      if (!tech.phases.has(c.phaseSlug)) {
        tech.phases.set(c.phaseSlug, { phaseTitle: c.phaseTitle, phaseNumber: c.phaseNumber, lessons: new Map() })
      }
      const phase = tech.phases.get(c.phaseSlug)!
      if (!phase.lessons.has(c.lessonSlug)) {
        phase.lessons.set(c.lessonSlug, { lessonTitle: c.lessonTitle, challenges: [] })
      }
      phase.lessons.get(c.lessonSlug)!.challenges.push(c)
    }
    return byTech
  }, [filtered])

  const selected = selectedId ? challenges.find((c) => c.id === selectedId) ?? null : null
  const quizCount = challenges.filter((c) => c.type === 'quiz').length
  const codeCount = challenges.filter((c) => c.type === 'challenge').length

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: challenges.length },
    { key: 'quiz', label: 'Quiz', count: quizCount },
    { key: 'code', label: 'Code', count: codeCount },
  ]

  return (
    <div className="flex gap-6 min-h-[calc(100vh-200px)]">
      {/* ── Left panel: challenge list ─────────────────────── */}
      <div className="w-80 shrink-0 flex flex-col">
        {/* Filter tabs */}
        <div className="mb-4 flex gap-1 rounded-xl bg-muted/60 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                filter === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 tabular-nums text-[10px] font-semibold leading-none',
                  filter === tab.key ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grouped list */}
        <div className="flex-1 space-y-8 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No challenges match this filter.</p>
          ) : (
            [...grouped.entries()].map(([techSlug, tech]) => (
              <div key={techSlug}>
                {/* Technology heading */}
                <div className="mb-3 flex items-center gap-2">
                  <Link
                    href={`/${techSlug}/phases`}
                    className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                  >
                    {tech.techTitle}
                  </Link>
                  <span className="flex-1 border-t border-border" />
                </div>

                <div className="space-y-6">
                  {[...tech.phases.entries()].map(([phaseSlug, phase]) => (
                    <section key={phaseSlug}>
                      {/* Phase heading */}
                      <Link
                        href={`/${techSlug}/phases/${phaseSlug}`}
                        className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 hover:text-primary transition-colors"
                      >
                        Phase {phase.phaseNumber} · {phase.phaseTitle}
                      </Link>

                      <div className="space-y-3">
                        {[...phase.lessons.entries()].map(([lessonSlug, lesson]) => (
                          <div key={lessonSlug}>
                            {/* Lesson sub-heading */}
                            <p className="mb-1.5 truncate text-xs font-medium text-muted-foreground">
                              {lesson.lessonTitle}
                            </p>

                            {/* Challenge items */}
                            <div className="space-y-1">
                              {lesson.challenges.map((c) => {
                                const isSelected = selectedId === c.id
                                const Icon = c.type === 'quiz' ? HelpCircle : Code2
                                const label = c.title ?? (c.type === 'quiz' ? 'Quiz' : 'Code Challenge')

                                return (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setSelectedId(c.id)}
                                    className={cn(
                                      'group relative flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all',
                                      isSelected
                                        ? 'border-primary/30 bg-primary/5'
                                        : 'border-border bg-card hover:border-primary/20 hover:bg-accent',
                                    )}
                                  >
                                    {isSelected && (
                                      <span
                                        className="absolute inset-y-0 left-0 w-0.5 rounded-l-lg"
                                        style={{ background: 'linear-gradient(180deg, #6366F1, #8B5CF6)' }}
                                      />
                                    )}

                                    <Icon
                                      className={cn(
                                        'h-3.5 w-3.5 shrink-0 transition-colors',
                                        isSelected ? 'text-primary' : 'text-muted-foreground/50 group-hover:text-muted-foreground',
                                      )}
                                      aria-hidden="true"
                                    />

                                    <div className="min-w-0 flex-1">
                                      <p
                                        className={cn(
                                          'truncate text-xs font-medium leading-snug transition-colors',
                                          isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary',
                                        )}
                                      >
                                        {label}
                                      </p>
                                      <DifficultyBadge level={c.difficulty as Difficulty} />
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Right panel: challenge viewer ─────────────────── */}
      <div className="flex-1 min-w-0">
        {selected ? (
          <LessonContextProvider
            value={{
              techSlug: selected.techSlug,
              lessonSlug: selected.lessonSlug,
              phaseSlug: selected.phaseSlug,
              lessonTitle: selected.lessonTitle,
              phaseTitle: selected.phaseTitle,
              phaseNumber: selected.phaseNumber,
            }}
          >
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Link
                href={`/${selected.techSlug}/phases/${selected.phaseSlug}/${selected.lessonSlug}`}
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                {selected.lessonTitle}
              </Link>
              <span>·</span>
              <Link
                href={`/challenges/${selected.id}`}
                className="hover:text-primary transition-colors"
              >
                Open full page ↗
              </Link>
            </div>

            {selected.type === 'challenge' ? (
              <CodeChallenge
                id={selected.id}
                title={selected.title}
                prompt={selected.prompt}
                code={selected.code ?? ''}
                language={selected.language}
                options={selected.options}
                correctAnswer={selected.correctAnswer}
                explanation={selected.explanation}
                difficulty={selected.difficulty as Difficulty}
              />
            ) : (
              <Quiz
                id={selected.id}
                question={selected.prompt ?? ''}
                options={selected.options}
                correctAnswer={selected.correctAnswer}
                explanation={selected.explanation}
                difficulty={selected.difficulty as Difficulty}
              />
            )}
          </LessonContextProvider>
        ) : (
          <EmptyPanel />
        )}
      </div>
    </div>
  )
}
