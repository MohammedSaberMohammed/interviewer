'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MonacoEditor } from './MonacoEditor'
import { OutputPanel } from './OutputPanel'
import { ProblemPanel } from './ProblemPanel'
import type { CodeProblem, RunCodeResponse } from '@/types/code-editor'

interface CodeEditorPageProps {
  problem: CodeProblem
}

export function CodeEditorPage({ problem }: CodeEditorPageProps) {
  const [code, setCode] = useState(problem.starterCode)
  const [result, setResult] = useState<RunCodeResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  async function handleRun() {
    setIsRunning(true)
    setResult(null)

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, problemId: problem.id }),
      })

      const data: RunCodeResponse = await res.json()
      setResult(data)
    } catch {
      setResult({
        passed: false,
        expected: '',
        actual: '',
        error: 'Network error — could not reach the server.',
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background shrink-0">
        <h1 className="text-sm font-semibold truncate">{problem.title}</h1>
        <Button
          size="sm"
          className="gap-2"
          onClick={handleRun}
          disabled={isRunning}
        >
          <Play className="h-3.5 w-3.5" />
          {isRunning ? 'Running…' : 'Run'}
        </Button>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left — problem description */}
        <aside className="w-80 shrink-0 border-r border-border overflow-y-auto">
          <ProblemPanel problem={problem} />
        </aside>

        {/* Centre — editor */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <MonacoEditor value={code} onChange={setCode} />
          </div>

          {/* Bottom — output */}
          <div className="h-44 shrink-0 border-t border-border bg-muted/30">
            <OutputPanel result={result} isRunning={isRunning} />
          </div>
        </div>
      </div>
    </div>
  )
}
