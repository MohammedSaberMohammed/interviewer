'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Code2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProgressStore } from '@/stores/progressStore'
import { DifficultyBadge } from './DifficultyBadge'
import { DocsLink } from './DocsLink'
import type { Difficulty } from '@/types'

interface CodeChallengeProps {
  id: string
  difficulty?: Difficulty
  // Accept both 'prompt' (original) and 'description'/'question' (AI-generated MDX)
  prompt?: string
  description?: string
  question?: string
  title?: string
  code: string
  language?: string
  options: string[]
  correctAnswer: number
  explanation: string
  hints?: string[]
  docsLinks?: { label: string; url: string }[]
}

export function CodeChallenge({
  id,
  difficulty = 'foundation',
  prompt,
  description,
  question,
  title,
  code,
  language = 'csharp',
  options = [],
  correctAnswer,
  explanation,
  hints,
  docsLinks,
}: CodeChallengeProps) {
  const displayPrompt = prompt ?? description ?? question ?? ''
  const displayTitle = title ?? 'Code Challenge'
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const recordChallengeAnswer = useProgressStore((s) => s.recordChallengeAnswer)

  const isCorrect = submitted && selected === correctAnswer

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    setShowExplanation(true)
    recordChallengeAnswer(id, selected, selected === correctAnswer)
  }

  const handleRetry = () => {
    setSelected(null)
    setSubmitted(false)
    setShowExplanation(false)
  }

  return (
    <div className="my-6 rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold">{displayTitle}</span>
        </div>
        <DifficultyBadge level={difficulty} />
      </div>

      <div className="p-4 space-y-4">
        {/* Prompt */}
        {displayPrompt && <p className="text-sm font-medium leading-relaxed">{displayPrompt}</p>}

        {/* Code block */}
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="border-b border-border bg-muted/50 px-3 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">{language}</span>
          </div>
          <pre className="overflow-x-auto bg-[#f6f8fa] dark:bg-[#0d1117] p-4 text-sm font-mono leading-relaxed">
            <code className={`language-${language}`}>{code}</code>
          </pre>
        </div>

        {/* Question */}
        <p className="text-sm text-muted-foreground">What is the output?</p>

        {/* Options */}
        <div className="space-y-2" role="radiogroup" aria-label="Answer options">
          {options.map((option, i) => {
            const isSelected = selected === i
            const isCorrectOption = i === correctAnswer
            let optionClass = 'border-border bg-background hover:bg-accent hover:border-primary/30'

            if (submitted) {
              if (isCorrectOption) optionClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
              else if (isSelected && !isCorrectOption) optionClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
            } else if (isSelected) {
              optionClass = 'border-primary bg-accent'
            }

            return (
              <button
                key={i}
                role="radio"
                aria-checked={isSelected}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm font-mono transition-all',
                  optionClass,
                  !submitted && 'cursor-pointer',
                  submitted && 'cursor-default'
                )}
              >
                <span className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold font-sans',
                  isSelected && !submitted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground text-muted-foreground'
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {submitted && isCorrectOption && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                {submitted && isSelected && !isCorrectOption && <XCircle className="h-4 w-4 shrink-0 text-rose-500" />}
              </button>
            )
          })}
        </div>

        {/* Hints */}
        {hints && hints.length > 0 && !submitted && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => setHintIndex(Math.min(hintIndex + 1, hints.length))}
            disabled={hintIndex >= hints.length}
          >
            {hintIndex === 0 ? 'Show hint' : hintIndex >= hints.length ? 'No more hints' : 'Next hint'}
          </Button>
        )}
        {hintIndex > 0 && hints && (
          <p className="text-xs rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-2 text-amber-800 dark:text-amber-200">
            💡 {hints[hintIndex - 1]}
          </p>
        )}

        {/* Actions */}
        {!submitted ? (
          <Button size="sm" onClick={handleSubmit} disabled={selected === null} className="w-full sm:w-auto">
            Submit Answer
          </Button>
        ) : (
          <div className="space-y-3">
            <div className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
            )}>
              {isCorrect
                ? <><CheckCircle2 className="h-4 w-4 shrink-0" /> Correct!</>
                : <><XCircle className="h-4 w-4 shrink-0" /> Incorrect — see explanation below</>
              }
            </div>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-expanded={showExplanation}
            >
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showExplanation && 'rotate-180')} />
              {showExplanation ? 'Hide' : 'Show'} explanation
            </button>
            {showExplanation && (
              <p className="text-sm rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-foreground/90">
                {explanation}
              </p>
            )}

            {docsLinks && docsLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {docsLinks.map((l) => (
                  <DocsLink key={l.url} href={l.url}>{l.label}</DocsLink>
                ))}
              </div>
            )}

            {!isCorrect && (
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
