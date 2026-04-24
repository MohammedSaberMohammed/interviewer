import { PROBLEMS } from '@/lib/problems'
import { CodeEditorPage } from '@/components/code-editor/CodeEditorPage'

export const metadata = {
  title: 'Code Editor',
  description: 'Write, run, and validate C# code against real test cases.',
}

export default function CodeEditorRoute() {
  // MVP: always show the first (and only) problem
  const problem = PROBLEMS[0]!

  return <CodeEditorPage problem={problem} />
}
