import type { Metadata } from 'next'
import { Code2, HelpCircle } from 'lucide-react'
import { getAllChallenges } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChallengesExplorer } from '@/components/challenges/ChallengesExplorer'

export const metadata: Metadata = {
  title: 'Challenges',
  description: 'Code challenges and quizzes across all .NET interview prep phases.',
}

export default function ChallengesPage() {
  const challenges = getAllChallenges()
  const quizCount = challenges.filter((c) => c.type === 'quiz').length
  const codeCount = challenges.filter((c) => c.type === 'challenge').length

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Challenges</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                className="flex h-5 w-5 items-center justify-center rounded"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                <HelpCircle className="h-3 w-3 text-white" aria-hidden="true" />
              </span>
              {quizCount} quizzes
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="flex h-5 w-5 items-center justify-center rounded"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                <Code2 className="h-3 w-3 text-white" aria-hidden="true" />
              </span>
              {codeCount} code challenges
            </span>
          </div>
        </div>

        <ChallengesExplorer challenges={challenges} />
      </main>
      <Footer />
    </>
  )
}
