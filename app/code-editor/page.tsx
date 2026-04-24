import { Navbar } from '@/components/layout/Navbar'
import { PROBLEMS } from '@/lib/problems'
import { CodeEditorPage } from '@/components/code-editor/CodeEditorPage'

export const metadata = {
  title: 'Code Editor',
  description: 'Write, run, and validate C# code against real test cases.',
}

export default function CodeEditorRoute() {
  const problem = PROBLEMS[0]!

  return (
    <>
      <Navbar />
      <CodeEditorPage problem={problem} />
    </>
  )
}
