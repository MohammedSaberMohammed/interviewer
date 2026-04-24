'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Timer, RotateCcw, ChevronRight, Trophy, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import { cn } from '@/lib/utils'
import type { LessonMeta } from '@/types/lesson'

interface InterviewLesson extends LessonMeta {
  phaseSlug: string
  phaseTitle: string
}

interface InterviewModeProps {
  lessons: InterviewLesson[]
}

type SessionStatus = 'idle' | 'running' | 'finished'

const SESSION_DURATION = 20 // minutes
const QUESTIONS_PER_SESSION = 10

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function InterviewMode({ lessons }: InterviewModeProps) {
  const [status, setStatus] = useState<SessionStatus>('idle')
  const [queue, setQueue] = useState<InterviewLesson[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION * 60)
  const [selfScores, setSelfScores] = useState<Record<number, boolean>>({})

  const startSession = useCallback(() => {
    const selected = shuffle(lessons).slice(0, QUESTIONS_PER_SESSION)
    setQueue(selected)
    setCurrentIdx(0)
    setRevealed(false)
    setSelfScores({})
    setTimeLeft(SESSION_DURATION * 60)
    setStatus('running')
  }, [lessons])

  // Timer countdown
  useEffect(() => {
    if (status !== 'running') return
    if (timeLeft <= 0) {
      setStatus('finished')
      return
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [status, timeLeft])

  const currentLesson = queue[currentIdx]
  const isLast = currentIdx === queue.length - 1

  const handleSelfScore = (correct: boolean) => {
    setSelfScores((s) => ({ ...s, [currentIdx]: correct }))
  }

  const handleNext = () => {
    if (isLast) {
      setStatus('finished')
    } else {
      setCurrentIdx((i) => i + 1)
      setRevealed(false)
    }
  }

  // ── Idle / setup ──────────────────────────────────────────────────────────
  if (status === 'idle') {
    if (lessons.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="font-semibold mb-1">No lessons available yet</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Publish at least one lesson to start interview mode.
            </p>
            <Button render={<Link href="/phases/01-csharp-core" />}>Go to Phase 1</Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Timer className="h-5 w-5 text-primary" aria-hidden="true" />
            Ready to be interviewed?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="text-muted-foreground text-xs mb-1">Questions</p>
              <p className="font-bold text-lg">{Math.min(QUESTIONS_PER_SESSION, lessons.length)}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="text-muted-foreground text-xs mb-1">Time limit</p>
              <p className="font-bold text-lg">{SESSION_DURATION} min</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="text-muted-foreground text-xs mb-1">Pool size</p>
              <p className="font-bold text-lg">{lessons.length} lessons</p>
            </div>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Questions are drawn randomly from all published lessons</li>
            <li>Reveal the answer when you&apos;re ready, then self-score honestly</li>
            <li>Session ends when time runs out or you finish all questions</li>
          </ul>
          <Button onClick={startSession} size="lg" className="w-full sm:w-auto">
            Start Interview Session
          </Button>
        </CardContent>
      </Card>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (status === 'finished') {
    const answered = Object.keys(selfScores).length
    const correct = Object.values(selfScores).filter(Boolean).length
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-500" aria-hidden="true" />
              Session Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <p className="text-muted-foreground text-xs mb-1">Score</p>
                <p className={cn('font-bold text-2xl', pct >= 80 ? 'text-green-600 dark:text-green-400' : pct >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-rose-600 dark:text-rose-400')}>
                  {pct}%
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <p className="text-muted-foreground text-xs mb-1">Correct</p>
                <p className="font-bold text-2xl">{correct}/{answered}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <p className="text-muted-foreground text-xs mb-1">Time used</p>
                <p className="font-bold text-2xl">{formatTime(SESSION_DURATION * 60 - timeLeft)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={startSession} className="gap-2">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                New Session
              </Button>
              <Button variant="outline" render={<Link href="/progress" />}>View Progress</Button>
            </div>
          </CardContent>
        </Card>

        {/* Per-question review */}
        <div>
          <h2 className="text-base font-semibold mb-3">Question Review</h2>
          <div className="space-y-2">
            {queue.map((lesson, i) => (
              <div
                key={lesson.slug}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-4 py-3',
                  selfScores[i] === true
                    ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                    : selfScores[i] === false
                    ? 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/20'
                    : 'border-border bg-card'
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.phaseTitle}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <DifficultyBadge level={lesson.difficulty} />
                  <Link
                    href={`/phases/${lesson.phaseSlug}/${lesson.slug}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Running ────────────────────────────────────────────────────────────────
  if (!currentLesson) return null

  const timerWarning = timeLeft <= 120 // last 2 minutes

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2">
        <span className="text-sm text-muted-foreground">
          Question {currentIdx + 1} of {queue.length}
        </span>
        <span
          className={cn(
            'font-mono text-sm font-semibold flex items-center gap-1.5',
            timerWarning ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'
          )}
          aria-live="polite"
          aria-label={`Time remaining: ${formatTime(timeLeft)}`}
        >
          <Timer className="h-3.5 w-3.5" aria-hidden="true" />
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Question card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-1">{currentLesson.phaseTitle}</p>
              <CardTitle className="text-xl leading-snug">{currentLesson.title}</CardTitle>
            </div>
            <DifficultyBadge level={currentLesson.difficulty} className="shrink-0 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentLesson.summary && (
            <p className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
              {currentLesson.summary}
            </p>
          )}

          {!revealed ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground italic">
                Take a moment to think through your answer, then reveal it.
              </p>
              <Button onClick={() => setRevealed(true)} variant="outline" className="gap-2">
                Reveal Answer Guide
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Answer Guide
                </p>
                <p className="text-sm">
                  Visit the full lesson for a deep explanation, code examples, and embedded challenges.
                </p>
                <Link
                  href={`/phases/${currentLesson.phaseSlug}/${currentLesson.slug}`}
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open lesson →
                </Link>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">How did you do?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelfScore(true)}
                    className={cn(
                      'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                      selfScores[currentIdx] === true
                        ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                        : 'border-border hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-950/20'
                    )}
                  >
                    Got it ✓
                  </button>
                  <button
                    onClick={() => handleSelfScore(false)}
                    className={cn(
                      'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                      selfScores[currentIdx] === false
                        ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                        : 'border-border hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'
                    )}
                  >
                    Missed it ✗
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={selfScores[currentIdx] === undefined}
                  className="gap-2"
                >
                  {isLast ? 'Finish Session' : 'Next Question'}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center" aria-hidden="true">
        {queue.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-colors',
              i < currentIdx
                ? selfScores[i]
                  ? 'bg-green-500'
                  : 'bg-rose-400'
                : i === currentIdx
                ? 'bg-primary'
                : 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  )
}
