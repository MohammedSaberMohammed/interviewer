import { NextRequest, NextResponse } from 'next/server'
import { getProblemById, wrapUserCode, compareResult } from '@/lib/problems'
import type { RunCodeRequest, RunCodeResponse } from '@/types/code-editor'

const PISTON_API = 'https://emkc.org/api/v2/piston/execute'
const PISTON_TIMEOUT_MS = 10_000

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

  // Only run first visible test case for MVP
  const testCase = problem.testCases.find((tc) => !tc.isHidden) ?? problem.testCases[0]
  if (!testCase) {
    return NextResponse.json({ error: 'No test cases configured' }, { status: 500 })
  }

  const fullCode = wrapUserCode(code, testCase.input)

  let pistonResponse: Response
  try {
    pistonResponse = await fetch(PISTON_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'csharp',
        version: '*',
        files: [{ content: fullCode }],
      }),
      signal: AbortSignal.timeout(PISTON_TIMEOUT_MS),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Execution service unavailable'
    return NextResponse.json({ error: message } satisfies Partial<RunCodeResponse>, { status: 502 })
  }

  if (!pistonResponse.ok) {
    return NextResponse.json({ error: 'Execution service error' }, { status: 502 })
  }

  const pistonData = await pistonResponse.json()
  const run = pistonData?.run
  const stdout: string = run?.stdout ?? ''
  const stderr: string = run?.stderr ?? ''

  if (stderr && !stdout) {
    return NextResponse.json({
      passed: false,
      expected: testCase.expected,
      actual: '',
      error: stderr.slice(0, 500),
    } satisfies RunCodeResponse)
  }

  const passed = compareResult(stdout, testCase.expected)
  const result: RunCodeResponse = {
    passed,
    expected: testCase.expected,
    actual: stdout.trim(),
    ...(stderr ? { error: stderr.slice(0, 500) } : {}),
  }

  return NextResponse.json(result)
}
