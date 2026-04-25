'use client'

import { useState, useRef } from 'react'
import { useProgressStore } from '@/stores/progressStore'
import { XP_AWARDS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface TapToSpotProps {
  id: string
  techSlug?: string
  code: string
  language?: string
  hotspotLineNumbers: number[]
  correctLineNumbers: number[]
  prompt: string
  explanation: string
}

type LineState = 'idle' | 'selected-correct' | 'selected-wrong' | 'missed'

export function TapToSpot({
  id,
  techSlug = 'dotnet',
  code = '',
  hotspotLineNumbers = [],
  correctLineNumbers = [],
  prompt,
  explanation,
}: TapToSpotProps) {
  const lines = code.split('\n')
  const [lineStates, setLineStates] = useState<Record<number, LineState>>({})
  const [revealed, setRevealed] = useState(false)
  const [firstTry, setFirstTry] = useState(true)
  const awardXP = useProgressStore((s) => s.awardXP)
  const startTimeRef = useRef(Date.now())

  const isHotspot = (lineNum: number) => hotspotLineNumbers.includes(lineNum)
  const isCorrect = (lineNum: number) => correctLineNumbers.includes(lineNum)

  function handleLineClick(lineNum: number) {
    if (revealed || !isHotspot(lineNum)) return

    const correct = isCorrect(lineNum)

    setLineStates((prev) => ({ ...prev, [lineNum]: correct ? 'selected-correct' : 'selected-wrong' }))

    if (correct) {
      // Mark missed correct lines that weren't tapped
      const missed: Record<number, LineState> = {}
      for (const n of correctLineNumbers) {
        if (!lineStates[n] && n !== lineNum) missed[n] = 'missed'
      }
      setLineStates((prev) => ({ ...prev, ...missed, [lineNum]: 'selected-correct' }))
      setRevealed(true)

      const xp = XP_AWARDS.STEP_COMPLETE + (firstTry ? XP_AWARDS.CORRECT_FIRST_TRY : 0)
      awardXP(techSlug, xp, firstTry ? 'Correct on first try!' : 'Spotted the bug!')
    } else {
      setFirstTry(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Prompt */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <p className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{prompt}</p>
        {!revealed && (
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Tap the line you think is the problem</p>
        )}
      </div>

      {/* Code lines */}
      <div className="overflow-x-auto bg-slate-950 font-mono text-sm">
        {lines.map((line, idx) => {
          const lineNum = idx + 1
          const state = lineStates[lineNum] ?? 'idle'
          const clickable = isHotspot(lineNum) && !revealed

          return (
            <div
              key={lineNum}
              onClick={() => handleLineClick(lineNum)}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onKeyDown={(e) => e.key === 'Enter' && handleLineClick(lineNum)}
              aria-label={clickable ? `Line ${lineNum}: tap to select as buggy` : undefined}
              className={cn(
                'flex items-center gap-3 px-4 py-1.5 transition-colors',
                clickable && 'cursor-pointer hover:bg-white/5',
                state === 'selected-correct' && 'bg-emerald-950/60 ring-1 ring-inset ring-emerald-500/40',
                state === 'selected-wrong' && 'bg-rose-950/60 ring-1 ring-inset ring-rose-500/40',
                state === 'missed' && 'bg-amber-950/60 ring-1 ring-inset ring-amber-500/40',
              )}
            >
              <span className="w-5 shrink-0 select-none text-right text-xs text-slate-600">
                {lineNum}
              </span>
              <span className="flex-1 text-slate-200 whitespace-pre">{line || ' '}</span>
              {state === 'selected-correct' && (
                <span className="shrink-0 text-emerald-400 text-xs" aria-label="Correct">✓</span>
              )}
              {state === 'selected-wrong' && (
                <span className="shrink-0 text-rose-400 text-xs" aria-label="Wrong">✗</span>
              )}
              {state === 'missed' && (
                <span className="shrink-0 text-amber-400 text-xs" aria-label="Missed">!</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div
          className="px-4 py-3 bg-emerald-50 border-t border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800"
          aria-live="polite"
        >
          <p className="text-[13px] font-medium text-emerald-700 dark:text-emerald-300 mb-0.5">Explanation</p>
          <p className="text-[13px] text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  )
}
