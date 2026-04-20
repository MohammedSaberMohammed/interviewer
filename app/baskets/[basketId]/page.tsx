'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useBasketStore } from '@/stores/basketStore'
import { useBasketDialog } from '@/components/basket/BasketContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CodeChallenge } from '@/components/lesson/CodeChallenge'
import { Quiz } from '@/components/lesson/Quiz'
import {
  ArrowLeft,
  GripVertical,
  Trash2,
  ShoppingBasket,
  Plus,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import { cn } from '@/lib/utils'
import { DIFFICULTY_ORDER, DIFFICULTY_CONFIG } from '@/lib/constants'
import type { BasketQuestion, Difficulty } from '@/types'

const DIFFICULTIES: Difficulty[] = ['foundation', 'intermediate', 'advanced', 'expert']

export default function BasketDetailPage() {
  const params = useParams()
  const basketId = params.basketId as string

  const [mounted, setMounted] = useState(false)
  const basket = useBasketStore((s) => s.getBasket(basketId))
  const getQuestion = useBasketStore((s) => s.getQuestion)
  const removeQuestion = useBasketStore((s) => s.removeQuestionFromBasket)
  const reorderQuestions = useBasketStore((s) => s.reorderQuestions)
  useBasketDialog() // ensures component is inside BasketDialogProvider

  // Local ordered list (synced from store, modified by DnD)
  const [orderedIds, setOrderedIds] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<Difficulty | null>(null)

  function sortByDifficulty(ids: string[]) {
    return [...ids].sort((a, b) => {
      const qa = useBasketStore.getState().getQuestion(a)
      const qb = useBasketStore.getState().getQuestion(b)
      return (DIFFICULTY_ORDER[qa?.difficulty ?? ''] ?? 0) - (DIFFICULTY_ORDER[qb?.difficulty ?? ''] ?? 0)
    })
  }

  useEffect(() => {
    useBasketStore.persist.rehydrate()
    const b = useBasketStore.getState().getBasket(basketId)
    if (b) {
      const sorted = sortByDifficulty(b.questionIds)
      setOrderedIds(sorted)
      useBasketStore.getState().reorderQuestions(basketId, sorted)
    }
    setMounted(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep local list in sync when items are added/removed externally
  useEffect(() => {
    if (!mounted || !basket) return
    // Preserve existing order for items already in list; append new ones sorted
    const existing = orderedIds.filter((id) => basket.questionIds.includes(id))
    const added = basket.questionIds.filter((id) => !orderedIds.includes(id))
    const next = [...existing, ...sortByDifficulty(added)]
    setOrderedIds(next)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket?.questionIds.join(',')])

  // ── Drag-and-drop state ─────────────────────────────────────────────────
  const dragIdxRef = useRef<number | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  function handleDragStart(idx: number) {
    dragIdxRef.current = idx
    setDragIdx(idx)
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverIdx(idx)
  }

  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    const from = dragIdxRef.current
    if (from === null || from === idx) { reset(); return }
    const next = [...orderedIds]
    const [item] = next.splice(from, 1)
    if (item) next.splice(idx, 0, item)
    setOrderedIds(next)
    reorderQuestions(basketId, next)
    reset()
  }

  function handleDragEnd() { reset() }

  function reset() {
    dragIdxRef.current = null
    setDragIdx(null)
    setOverIdx(null)
  }

  // ── Render ──────────────────────────────────────────────────────────────
  const allItems = orderedIds.map((id) => getQuestion(id)).filter(Boolean) as BasketQuestion[]
  const questions = activeFilter ? allItems.filter((q) => q.difficulty === activeFilter) : allItems

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Back + title */}
        <div className="mb-6">
          <Link
            href="/baskets"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All baskets
          </Link>

          {!mounted ? (
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          ) : !basket ? (
            <div className="rounded-xl border border-border bg-muted/20 p-8 text-center">
              <ShoppingBasket className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="font-medium">Basket not found</p>
              <Link href="/baskets" className="text-sm text-muted-foreground hover:text-primary mt-1 block">
                Back to baskets
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <ShoppingBasket className="h-5 w-5 text-[#512BD4] dark:text-violet-300" />
                    <h1 className="text-2xl font-bold">{basket.name}</h1>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {questions.length} item{questions.length !== 1 ? 's' : ''}
                    {allItems.length > 1 && !activeFilter && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground/60">
                        <ArrowUpDown className="h-3 w-3" />
                        Drag to reorder
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Difficulty filter pills */}
              {allItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveFilter(null)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      activeFilter === null
                        ? 'border-[#512BD4] bg-[#512BD4] text-white'
                        : 'border-border text-muted-foreground hover:border-[#512BD4]/40 hover:text-[#512BD4]',
                    )}
                  >
                    All ({allItems.length})
                  </button>
                  {DIFFICULTIES.filter((d) => allItems.some((q) => q.difficulty === d)).map((d) => {
                    const cfg = DIFFICULTY_CONFIG[d]
                    const count = allItems.filter((q) => q.difficulty === d).length
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setActiveFilter(activeFilter === d ? null : d)}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                          activeFilter === d
                            ? `${cfg.bgClass} ${cfg.textClass} border-transparent`
                            : 'border-border text-muted-foreground hover:border-current',
                          activeFilter === d && 'opacity-100',
                        )}
                      >
                        {cfg.label} ({count})
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Empty state */}
              {questions.length === 0 && (
                <div className="mt-8 flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border">
                  <ShoppingBasket className="h-8 w-8 text-muted-foreground/30 mb-3" />
                  {activeFilter ? (
                    <>
                      <p className="font-medium mb-1">No {DIFFICULTY_CONFIG[activeFilter].label.toLowerCase()} items</p>
                      <p className="text-sm text-muted-foreground mb-4">Try a different difficulty filter.</p>
                      <Button size="sm" variant="outline" onClick={() => setActiveFilter(null)}>
                        Show all
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="font-medium mb-1">No items yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Browse lessons and click &ldquo;Add to basket&rdquo; on any question or lesson.
                      </p>
                      <Link href="/phases">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Browse lessons
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}

              {/* Question list (DnD) */}
              {questions.length > 0 && (
                <div className="mt-6 space-y-3">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      draggable={!activeFilter}
                      onDragStart={(e) => {
                        if ((e.target as HTMLElement).closest('[data-no-drag]')) {
                          e.preventDefault()
                          return
                        }
                        if (!activeFilter) handleDragStart(idx)
                      }}
                      onDragOver={(e) => !activeFilter && handleDragOver(e, idx)}
                      onDrop={(e) => !activeFilter && handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        'group relative rounded-xl border bg-card transition-all duration-150',
                        dragIdx === idx && 'opacity-50 scale-[0.98]',
                        overIdx === idx && dragIdx !== idx && 'border-[#512BD4]/50 ring-2 ring-[#512BD4]/20',
                        dragIdx === null && 'border-border hover:border-[#512BD4]/20',
                      )}
                    >
                      {/* Card header */}
                      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2.5 rounded-t-xl">
                        {/* Drag handle */}
                        <div
                          className="cursor-grab active:cursor-grabbing touch-none"
                          aria-label="Drag to reorder"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                        </div>

                        <span className="text-xs font-medium text-muted-foreground">
                          {idx + 1}.
                        </span>

                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <span className="text-xs font-medium truncate">
                            {q.lessonTitle}
                          </span>
                          <DifficultyBadge level={q.difficulty as Difficulty} />
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => {
                            removeQuestion(basketId, q.id)
                            setOrderedIds((prev) => prev.filter((id) => id !== q.id))
                          }}
                          aria-label="Remove from basket"
                          className="rounded p-1 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Item preview — data-no-drag prevents draggable parent from stealing click events */}
                      <div className="px-3 py-1" data-no-drag>
                        {q.type === 'challenge' ? (
                          <CodeChallenge
                            id={`basket-preview-${q.id}`}
                            question={q.question}
                            code={q.code ?? ''}
                            language={q.language ?? 'csharp'}
                            options={q.options ?? []}
                            correctAnswer={q.correctAnswer ?? 0}
                            explanation={q.explanation ?? ''}
                            difficulty={q.difficulty as Difficulty}
                          />
                        ) : q.type === 'quiz' ? (
                          <Quiz
                            id={`basket-preview-${q.id}`}
                            question={q.question}
                            options={q.options ?? []}
                            correctAnswer={q.correctAnswer ?? 0}
                            explanation={q.explanation ?? ''}
                            difficulty={q.difficulty as Difficulty}
                          />
                        ) : (
                          /* Lesson item */
                          <Link
                            href={`/phases/${q.phaseSlug}/${q.lessonSlug}`}
                            className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 my-2 hover:border-primary/30 hover:bg-accent transition-all group"
                          >
                            <BookOpen className="h-4 w-4 shrink-0 text-[#512BD4] dark:text-violet-300 mt-0.5" aria-hidden="true" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium group-hover:text-primary transition-colors">{q.lessonTitle}</p>
                              {q.summary && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{q.summary}</p>
                              )}
                              <p className="text-xs text-muted-foreground/60 mt-1">{q.phaseTitle}</p>
                            </div>
                            <DifficultyBadge level={q.difficulty as Difficulty} />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
