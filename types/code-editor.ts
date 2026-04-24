export interface CodeTestCase {
  input: string
  expected: string
  isHidden?: boolean
}

export interface CodeProblem {
  id: string
  title: string
  description: string
  starterCode: string
  functionSignature: string
  testCases: CodeTestCase[]
}

export interface RunCodeRequest {
  code: string
  problemId: string
}

export interface RunCodeResponse {
  passed: boolean
  expected: string
  actual: string          // the return value (trimmed)
  stdout: string          // raw stdout as-is
  consoleOutput: string   // user's Console.WriteLine output, split from return value
  status: string          // "Accepted" | "Compilation Error" | "Runtime Error" | "Time Limit Exceeded" | …
  stderr?: string
  compileError?: string
  time?: string           // seconds, e.g. "0.035"
  memory?: number         // KB
}
