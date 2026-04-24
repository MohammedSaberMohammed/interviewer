import type { CodeProblem } from '@/types/code-editor'

/* ─── Hardcoded problems (MVP) ───────────────────────────────────────────── */
export const PROBLEMS: CodeProblem[] = [
  {
    id: 'sum-of-array',
    title: 'Sum of Array',
    description: `Given an integer array \`nums\`, return the sum of all elements.

**Example 1:**
\`\`\`
Input: nums = [1, 2, 3]
Output: 6
\`\`\`

**Example 2:**
\`\`\`
Input: nums = []
Output: 0
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [5]
Output: 5
\`\`\``,
    functionSignature: 'public int Sum(int[] nums)',
    starterCode: `public int Sum(int[] nums)
{
    // your code here
}`,
    testCases: [
      { input: 'new int[]{1,2,3}', expected: '6' },
      { input: 'new int[]{}',      expected: '0' },
      { input: 'new int[]{5}',     expected: '5' },
    ],
  },
]

export function getProblemById(id: string): CodeProblem | undefined {
  return PROBLEMS.find((p) => p.id === id)
}

/* ─── Code wrapping ──────────────────────────────────────────────────────── */
export function wrapUserCode(userCode: string, testInput: string): string {
  return `using System;
using System.Linq;

public class Solution
{
    ${userCode.trim()}
}

public class Program
{
    public static void Main()
    {
        var sol = new Solution();
        var result = sol.Sum(${testInput});
        Console.WriteLine(result);
    }
}
`
}

/* ─── Result comparison ──────────────────────────────────────────────────── */
export function compareResult(actual: string, expected: string): boolean {
  return actual.trim() === expected.trim()
}
