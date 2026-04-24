import { NextRequest, NextResponse } from 'next/server'
import { getProblemById, wrapUserCode, compareResult, RETURN_SENTINEL } from '@/lib/problems'
import type { RunCodeRequest, RunCodeResponse } from '@/types/code-editor'

const JUDGE0_API = 'https://ce.judge0.com/submissions?base64_encoded=false&wait=true'
const JUDGE0_CSHARP_MONO = 51 // C# (Mono 6.6.0.161)
const TIMEOUT_MS = 15_000

const STATUS_LABELS: Record<number, string> = {
  3:  'Accepted',
  4:  'Wrong Answer',
  5:  'Time Limit Exceeded',
  6:  'Compilation Error',
  7:  'Runtime Error',
  8:  'Runtime Error',
  9:  'Runtime Error',
  10: 'Runtime Error',
  11: 'Runtime Error',
  12: 'Runtime Error',
  13: 'Internal Error',
  14: 'Exec Format Error',
}

/** Split stdout into user console lines vs the return value using the sentinel. */
function parseStdout(raw: string): { consoleOutput: string; returnValue: string } {
  const sentinelLine = RETURN_SENTINEL
  const idx = raw.indexOf(sentinelLine)
  if (idx === -1) {
    // Sentinel not found — treat all output as console output (compile/runtime stopped early)
    return { consoleOutput: raw, returnValue: '' }
  }
  const before = raw.slice(0, idx).trimEnd()
  const after  = raw.slice(idx + sentinelLine.length).trimStart()
  return { consoleOutput: before, returnValue: after.trim() }
}

export async function POST(req: NextRequest) {
  let body: RunCodeRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { code, problemId } = body
  if (!code || !problemId) {
    return NextResponse.json({ error: 'Missing code or problemId' }, { status: 400 })
  }

  const problem = getProblemById(problemId)
  if (!problem) {
    return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
  }

  const testCase = problem.testCases.find((tc) => !tc.isHidden) ?? problem.testCases[0]
  if (!testCase) {
    return NextResponse.json({ error: 'No test cases configured' }, { status: 500 })
  }

  const fullCode = wrapUserCode(code, testCase.input)

  let judge0Res: Response
  try {
    judge0Res = await fetch(JUDGE0_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code: fullCode, language_id: JUDGE0_CSHARP_MONO, stdin: '' }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Execution service unavailable'
    return NextResponse.json({
      passed: false, expected: testCase.expected, actual: '', stdout: '',
      consoleOutput: '', status: 'Network Error', compileError: message,
    } satisfies RunCodeResponse, { status: 502 })
  }

  if (!judge0Res.ok) {
    const errBody = await judge0Res.text().catch(() => '')
    return NextResponse.json({
      passed: false, expected: testCase.expected, actual: '', stdout: '',
      consoleOutput: '', status: 'Service Error',
      compileError: `HTTP ${judge0Res.status}: ${errBody.slice(0, 200)}`,
    } satisfies RunCodeResponse, { status: 502 })
  }

  const data = await judge0Res.json()
  const rawStdout: string    = data.stdout         ?? ''
  const stderr: string       = data.stderr         ?? ''
  const compileError: string = data.compile_output ?? ''
  const statusId: number     = data.status?.id     ?? 0
  const status               = STATUS_LABELS[statusId] ?? data.status?.description ?? 'Unknown'
  const time: string | undefined   = data.time   ?? undefined
  const memory: number | undefined = data.memory ?? undefined

  const { consoleOutput, returnValue } = parseStdout(rawStdout)
  const passed = statusId === 3 && compareResult(returnValue, testCase.expected)

  return NextResponse.json({
    passed,
    expected:      testCase.expected,
    actual:        returnValue,
    stdout:        rawStdout,
    consoleOutput,
    status,
    ...(stderr       ? { stderr:       stderr.slice(0, 1000) }       : {}),
    ...(compileError ? { compileError: compileError.slice(0, 1000) } : {}),
    ...(time   !== undefined ? { time }   : {}),
    ...(memory !== undefined ? { memory } : {}),
  } satisfies RunCodeResponse)
}
