'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Shuffle, ChevronDown, ChevronUp, HelpCircle, Code2, X, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import { useProgressStore } from '@/stores/progressStore'
import { useEffect, useRef } from 'react'
import type { ExtractedChallenge, Difficulty } from '@/types'

type DifficultyFilter = Difficulty | 'all'
type TypeFilter = 'all' | 'quiz' | 'challenge'
type StatusFilter = 'all' | 'not-started' | 'completed'

interface ChallengesExplorerProps {
  challenges: ExtractedChallenge[]
  phases: { slug: string; number: number; title: string }[]
}

const DIFFICULTY_DOTS: Record<Difficulty, string> = {
  foundation:   'bg-emerald-500',
  intermediate: 'bg-blue-500',
  advanced:     'bg-violet-500',
  expert:       'bg-red-500',
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  foundation:   'Foundation',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
  expert:       'Expert',
}

function TypeIcon({ type }: { type: 'quiz' | 'challenge' }) {
  if (type === 'quiz') return <HelpCircle className="h-3.5 w-3.5 shrink-0 text-[oklch(0.85_0.20_320)]" aria-hidden="true" />
  return <Code2 className="h-3.5 w-3.5 shrink-0 text-brand-cyan" aria-hidden="true" />
}

export function ChallengesExplorer({ challenges, phases }: ChallengesExplorerProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const technologies = useProgressStore((s) => s.technologies)

  useEffect(() => {
    useProgressStore.persist.rehydrate()
    setMounted(true)
  }, [])

  const [query, setQuery]               = useState('')
  const [phaseFilter, setPhaseFilter]   = useState<string>('all')
  const [difficulties, setDifficulties] = useState<Set<Difficulty>>(new Set())
  const [types, setTypes]               = useState<Set<TypeFilter>>(new Set())
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())
  const searchRef = useRef<HTMLInputElement>(null)

  // Collect all answered challenge IDs from progress store
  const answeredIds = useMemo(() => {
    if (!mounted) return new Set<string>()
    const all = new Set<string>()
    for (const tech of Object.values(technologies)) {
      for (const id of Object.keys(tech.challengeAnswers ?? {})) {
        all.add(id)
      }
    }
    return all
  }, [mounted, technologies])

  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      if (phaseFilter !== 'all' && c.phaseSlug !== phaseFilter) return false
      if (difficulties.size > 0 && !difficulties.has(c.difficulty as Difficulty)) return false
      if (types.size > 0) {
        const matchType = (types.has('quiz') && c.type === 'quiz') || (types.has('challenge') && c.type === 'challenge')
        if (!matchType) return false
      }
      if (statusFilter === 'completed' && !answeredIds.has(c.id)) return false
      if (statusFilter === 'not-started' && answeredIds.has(c.id)) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        const haystack = `${c.title ?? ''} ${c.prompt ?? ''} ${c.lessonTitle} ${c.phaseTitle}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [challenges, phaseFilter, difficulties, types, statusFilter, answeredIds, query])

  // Group: phaseSlug → lessonSlug → challenges
  const grouped = useMemo(() => {
    const byPhase = new Map<
      string,
      { phaseTitle: string; phaseNumber: number; lessons: Map<string, { lessonTitle: string; challenges: ExtractedChallenge[] }> }
    >()
    for (const c of filtered) {
      if (!byPhase.has(c.phaseSlug)) {
        byPhase.set(c.phaseSlug, { phaseTitle: c.phaseTitle, phaseNumber: c.phaseNumber, lessons: new Map() })
      }
      const phase = byPhase.get(c.phaseSlug)!
      if (!phase.lessons.has(c.lessonSlug)) {
        phase.lessons.set(c.lessonSlug, { lessonTitle: c.lessonTitle, challenges: [] })
      }
      phase.lessons.get(c.lessonSlug)!.challenges.push(c)
    }
    return byPhase
  }, [filtered])

  // Auto-expand first phase when filter changes
  const groupedKeys = useMemo(() => [...grouped.keys()], [grouped])
  useEffect(() => {
    if (groupedKeys.length > 0) {
      setExpandedPhases(new Set([groupedKeys[0]!]))
    }
  }, [groupedKeys.join(',')])

  const toggleDifficulty = useCallback((d: Difficulty) => {
    setDifficulties((prev) => {
      const next = new Set(prev)
      next.has(d) ? next.delete(d) : next.add(d)
      return next
    })
  }, [])

  const toggleType = useCallback((t: 'quiz' | 'challenge') => {
    setTypes((prev) => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }, [])

  const togglePhaseExpanded = useCallback((slug: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }, [])

  const handleSurpriseMe = useCallback(() => {
    if (filtered.length === 0) return
    const pick = filtered[Math.floor(Math.random() * filtered.length)]!
    router.push(`/challenges/${pick.id}`)
  }, [filtered, router])

  const hasActiveFilters = phaseFilter !== 'all' || difficulties.size > 0 || types.size > 0 || statusFilter !== 'all' || query.trim() !== ''

  const clearFilters = useCallback(() => {
    setQuery('')
    setPhaseFilter('all')
    setDifficulties(new Set())
    setTypes(new Set())
    setStatusFilter('all')
  }, [])

  return (
    <div className="flex gap-6 items-start">

      {/* ── Filters sidebar ────────────────────────────────── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col gap-5 sticky top-20">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search challenges…"
            aria-label="Search challenges"
            className="w-full rounded-xl border border-border bg-card pl-8 pr-3 py-2 text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Phase filter */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phase</p>
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            aria-label="Filter by phase"
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-colors cursor-pointer"
          >
            <option value="all">All Phases</option>
            {phases.map((p) => (
              <option key={p.slug} value={p.slug}>
                Phase {p.number} · {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Difficulty</p>
          <div className="space-y-1.5">
            {(['foundation', 'intermediate', 'advanced', 'expert'] as Difficulty[]).map((d) => (
              <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={difficulties.has(d)}
                  onChange={() => toggleDifficulty(d)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                    difficulties.has(d)
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card group-hover:border-primary/40'
                  )}
                >
                  {difficulties.has(d) && (
                    <svg className="h-2.5 w-2.5 text-primary" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </span>
                <span className={cn('h-2 w-2 shrink-0 rounded-full', DIFFICULTY_DOTS[d])} aria-hidden="true" />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {DIFFICULTY_LABELS[d]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</p>
          <div className="space-y-1.5">
            {([
              { key: 'quiz' as const, label: 'Quiz', icon: <HelpCircle className="h-3.5 w-3.5 text-[oklch(0.85_0.20_320)]" aria-hidden="true" /> },
              { key: 'challenge' as const, label: 'Code Challenge', icon: <Code2 className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" /> },
            ] as const).map(({ key, label, icon }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={types.has(key)} onChange={() => toggleType(key)} className="sr-only" />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                    types.has(key)
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card group-hover:border-primary/40'
                  )}
                >
                  {types.has(key) && (
                    <svg className="h-2.5 w-2.5 text-primary" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </span>
                {icon}
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</p>
          <div className="space-y-1.5">
            {([
              { key: 'all' as const, label: 'All' },
              { key: 'not-started' as const, label: 'Not Started' },
              { key: 'completed' as const, label: 'Completed' },
            ]).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === key}
                  onChange={() => setStatusFilter(key)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                    statusFilter === key
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card group-hover:border-primary/40'
                  )}
                >
                  {statusFilter === key && (
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                  )}
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}

        {/* Surprise Me */}
        <button
          type="button"
          onClick={handleSurpriseMe}
          disabled={filtered.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_4px_16px_oklch(0.68_0.25_320/0.4)]"
          style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 195), oklch(0.68 0.25 320))' }}
        >
          <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
          Surprise Me
        </button>

      </aside>

      {/* ── Main: grouped challenge list ───────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground tabular-nums">{filtered.length}</span>{' '}
            challenge{filtered.length !== 1 ? 's' : ''} found
          </p>
          {/* Mobile: Surprise Me */}
          <button
            type="button"
            onClick={handleSurpriseMe}
            disabled={filtered.length === 0}
            className="lg:hidden flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, oklch(0.72 0.18 195), oklch(0.68 0.25 320))' }}
          >
            <Shuffle className="h-3 w-3" aria-hidden="true" />
            Surprise Me
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-muted/20 py-16 text-center">
            <Search className="h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
            <p className="text-sm font-medium text-muted-foreground">No challenges match your filters</p>
            <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="space-y-3">
            {[...grouped.entries()].map(([phaseSlug, phase]) => {
              const isExpanded = expandedPhases.has(phaseSlug)
              const phaseTotal = [...phase.lessons.values()].reduce((s, l) => s + l.challenges.length, 0)

              return (
                <div key={phaseSlug} className="rounded-2xl border border-border bg-card overflow-hidden">
                  {/* Phase header */}
                  <button
                    type="button"
                    onClick={() => togglePhaseExpanded(phaseSlug)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 hover:bg-accent/50 transition-colors text-left"
                    aria-expanded={isExpanded}
                  >
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
                      Phase {phase.phaseNumber}
                    </span>
                    <span className="text-sm font-semibold text-foreground flex-1 min-w-0 truncate">
                      {phase.phaseTitle}
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {phaseTotal}
                    </span>
                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    }
                  </button>

                  {/* Lessons + challenges */}
                  {isExpanded && (
                    <div className="border-t border-border">
                      {[...phase.lessons.entries()].map(([lessonSlug, lesson], lessonIdx) => (
                        <div key={lessonSlug} className={cn(lessonIdx > 0 && 'border-t border-border/50')}>
                          {/* Lesson sub-header */}
                          <div className="flex items-center gap-2 px-5 py-2 bg-muted/30">
                            <BookmarkIcon />
                            <Link
                              href={`/${lesson.challenges[0]?.techSlug}/phases/${phaseSlug}/${lessonSlug}`}
                              className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors truncate"
                            >
                              {lesson.lessonTitle}
                            </Link>
                          </div>

                          {/* Challenge rows */}
                          {lesson.challenges.map((c, ci) => {
                            const isAnswered = mounted && answeredIds.has(c.id)
                            const label = c.title ?? (c.type === 'quiz' ? 'Quiz' : 'Code Challenge')

                            return (
                              <Link
                                key={c.id}
                                href={`/challenges/${c.id}`}
                                className={cn(
                                  'group flex items-center gap-3 px-5 py-3 transition-colors',
                                  ci > 0 && 'border-t border-border/30',
                                  'hover:bg-accent/40',
                                )}
                              >
                                {/* Type icon */}
                                <TypeIcon type={c.type} />

                                {/* Title + badges */}
                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    'text-sm font-medium truncate transition-colors',
                                    isAnswered ? 'text-muted-foreground line-through decoration-muted-foreground/40' : 'text-foreground group-hover:text-primary',
                                  )}>
                                    {label}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <DifficultyBadge level={c.difficulty as Difficulty} />
                                    {isAnswered && (
                                      <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Completed</span>
                                    )}
                                  </div>
                                </div>

                                {/* Read time (estimated) */}
                                <span className="shrink-0 text-[10px] text-muted-foreground/60 tabular-nums hidden sm:block">
                                  ~3 min
                                </span>

                                {/* Arrow */}
                                <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 16 16" aria-hidden="true">
                                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </Link>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function BookmarkIcon() {
  return <Bookmark className="h-3 w-3 shrink-0 text-muted-foreground/50" aria-hidden="true" />
}
