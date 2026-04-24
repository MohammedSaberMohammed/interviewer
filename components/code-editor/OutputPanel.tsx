'use client'

import { cn } from '@/lib/utils'
import type { RunCodeResponse } from '@/types/code-editor'

interface OutputPanelProps {
  result: RunCodeResponse | null
  isRunning: boolean
}

export function OutputPanel({ result, isRunning }: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full p-4 font-mono text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        Output
      </p>

      {isRunning && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Running…
        </div>
      )}

      {!isRunning && result === null && (
        <p className="text-muted-foreground">Click <strong>Run</strong> to execute your code.</p>
      )}

      {!isRunning && result !== null && (
        <div className="space-y-3">
          {/* Pass / Fail banner */}
          <div
            className={cn(
              'rounded-md px-3 py-2 text-sm font-semibold',
              result.passed
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
            )}
          >
            {result.passed ? '✅ Passed' : '❌ Failed'}
          </div>

          {/* Details when failed */}
          {!result.passed && (
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-muted-foreground">Expected: </span>
                <code className="text-foreground">{result.expected}</code>
              </div>
              <div>
                <span className="text-muted-foreground">Got: </span>
                <code className="text-foreground">{result.actual || '(empty)'}</code>
              </div>
            </div>
          )}

          {/* Compiler / runtime error */}
          {result.error && (
            <div className="rounded-md bg-muted px-3 py-2 text-xs text-rose-600 dark:text-rose-400 whitespace-pre-wrap break-words">
              {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
