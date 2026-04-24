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
  actual: string
  error?: string
}
