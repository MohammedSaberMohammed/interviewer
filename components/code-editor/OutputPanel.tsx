'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Clock, MemoryStick, Terminal, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CodeProblem, RunCodeResponse } from '@/types/code-editor'

interface OutputPanelProps {
  problem: CodeProblem
  result: RunCodeResponse | null
  isRunning: boolean
}

type Tab = 'cases' | 'result'

const STATUS_COLOR: Record<string, string> = {
  'Accepted':            'text-emerald-600 dark:text-emerald-400',
  'Wrong Answer':        'text-rose-600    dark:text-rose-400',
  'Compilation Error':   'text-amber-600   dark:text-amber-400',
  'Runtime Error':       'text-orange-600  dark:text-orange-400',
  'Time Limit Exceeded': 'text-violet-600  dark:text-violet-400',
}

const STATUS_BG: Record<string, string> = {
  'Accepted':            'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
  'Wrong Answer':        'bg-rose-50    border-rose-200    dark:bg-rose-950/30    dark:border-rose-800',
  'Compilation Error':   'bg-amber-50   border-amber-200   dark:bg-amber-950/30   dark:border-amber-800',
  'Runtime Error':       'bg-orange-50  border-orange-200  dark:bg-orange-950/30  dark:border-orange-800',
  'Time Limit Exceeded': 'bg-violet-50  border-violet-200  dark:bg-violet-950/30  dark:border-violet-800',
}

export function OutputPanel({ problem, result, isRunning }: OutputPanelProps) {
  const [tab, setTab] = useState<Tab>('cases')

  useEffect(() => {
    if (result !== null && !isRunning) setTab('result')
  }, [result, isRunning])

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border shrink-0 px-2">
        {(['cases', 'result'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
              tab === t
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t === 'cases' ? 'Test Cases' : 'Result'}
          </button>
        ))}

        <div className="ml-auto mr-1 flex items-center gap-2">
          {isRunning && (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Running…
            </span>
          )}
          {result !== null && !isRunning && <StatusPill status={result.status} />}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'cases' && <TestCasesTab problem={problem} />}
        {tab === 'result' && <ResultTab result={result} isRunning={isRunning} />}
      </div>
    </div>
  )
}

/* ─── Status pill ────────────────────────────────────────────────────────── */
function StatusPill({ status }: { status: string }) {
  const isOk = status === 'Accepted'
  return (
    <span className={cn(
      'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
      isOk
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
    )}>
      {isOk ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {status}
    </span>
  )
}

/* ─── Test Cases tab ─────────────────────────────────────────────────────── */
function TestCasesTab({ problem }: { problem: CodeProblem }) {
  const visible = problem.testCases.filter((tc) => !tc.isHidden)
  return (
    <div className="p-3 space-y-2 font-mono text-xs">
      {visible.map((tc, i) => (
        <div key={i} className="rounded-md border border-border bg-muted/40 divide-y divide-border">
          <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            Case {i + 1}
          </p>
          <CodeRow label="Input" value={tc.input} />
          <CodeRow label="Expected" value={tc.expected} />
        </div>
      ))}
    </div>
  )
}

/* ─── Result tab ─────────────────────────────────────────────────────────── */
function ResultTab({ result, isRunning }: { result: RunCodeResponse | null; isRunning: boolean }) {
  if (isRunning) return (
    <div className="p-4 text-xs text-muted-foreground font-mono">Running your code…</div>
  )
  if (!result) return (
    <div className="p-4 text-xs text-muted-foreground font-mono">
      Press <kbd className="rounded border border-border bg-muted px-1 text-foreground">Run</kbd> to see results.
    </div>
  )

  const statusColor = STATUS_COLOR[result.status] ?? 'text-muted-foreground'
  const statusBg    = STATUS_BG[result.status]    ?? 'bg-muted border-border'
  const isCompileError  = result.status === 'Compilation Error'
  const isRuntimeError  = result.status === 'Runtime Error'
  const isExecuted      = !isCompileError

  return (
    <div className="p-3 space-y-3 font-mono text-xs">

      {/* Status + stats */}
      <div className={cn('rounded-md border px-3 py-2 flex items-center gap-4', statusBg)}>
        <span className={cn('font-bold text-sm flex items-center gap-1.5', statusColor)}>
          {result.passed
            ? <CheckCircle2 className="h-4 w-4" />
            : <XCircle className="h-4 w-4" />
          }
          {result.status}
        </span>
        {result.time && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />{result.time}s
          </span>
        )}
        {result.memory !== undefined && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <MemoryStick className="h-3 w-3" />{(result.memory / 1024).toFixed(1)} MB
          </span>
        )}
      </div>

      {/* Compile error — only show compiler output, skip execution sections */}
      {isCompileError && result.compileError && (
        <ErrorSection label="Compiler Output" content={result.compileError} />
      )}

      {/* Runtime error stderr */}
      {isRuntimeError && result.stderr && (
        <ErrorSection label="Runtime Error" content={result.stderr} />
      )}

      {/* Execution sections — only shown when code actually ran */}
      {isExecuted && (
        <>
          {/* User console output — only if they printed something */}
          {result.consoleOutput && (
            <Section label="Console Output">
              <pre className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
                {result.consoleOutput}
              </pre>
            </Section>
          )}

          {/* Return value vs expected */}
          <div className="grid grid-cols-2 gap-3">
            <Section label="Your Output">
              <pre className={cn(
                'whitespace-pre-wrap break-words leading-relaxed',
                !result.passed ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              )}>
                {result.actual || '(empty)'}
              </pre>
            </Section>
            <Section label="Expected Output">
              <pre className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
                {result.expected}
              </pre>
            </Section>
          </div>

          {/* Stderr alongside (non-fatal) */}
          {result.stderr && (
            <ErrorSection label="Standard Error" content={result.stderr} />
          )}
        </>
      )}
    </div>
  )
}

/* ─── Shared blocks ──────────────────────────────────────────────────────── */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted/50 border-b border-border">
        {label}
      </p>
      <div className="px-3 py-2">{children}</div>
    </div>
  )
}

function ErrorSection({ label, content }: { label: string; content: string }) {
  return (
    <div className="rounded-md border border-amber-300 dark:border-amber-800 overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800">
        <Terminal className="h-3 w-3 text-amber-600 dark:text-amber-400" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          {label}
        </span>
      </div>
      <pre className="px-3 py-2 text-amber-700 dark:text-amber-300 whitespace-pre-wrap break-words leading-relaxed bg-amber-50/50 dark:bg-amber-950/20">
        {content}
      </pre>
    </div>
  )
}

function CodeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 px-3 py-1.5">
      <span className="w-16 shrink-0 text-muted-foreground">{label}</span>
      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
      <code className="break-all">{value}</code>
    </div>
  )
}
