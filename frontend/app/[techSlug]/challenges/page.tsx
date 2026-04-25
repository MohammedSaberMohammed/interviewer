import type { Metadata } from 'next'
import { Code2, HelpCircle } from 'lucide-react'
import { getAllChallenges, getAllTechSlugs, getTechMeta } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChallengesExplorer } from '@/components/challenges/ChallengesExplorer'

interface Props {
  params: Promise<{ techSlug: string }>
}

export async function generateStaticParams() {
  return getAllTechSlugs().map((techSlug) => ({ techSlug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { techSlug } = await params
  const meta = getTechMeta(techSlug)
  const title = meta?.title ? `${meta.title} Challenges` : 'Challenges'
  return {
    title,
    description: `Code challenges and quizzes for ${meta?.title ?? techSlug}.`,
  }
}

export default async function TechChallengesPage({ params }: Props) {
  const { techSlug } = await params
  const challenges = getAllChallenges().filter((c) => c.techSlug === techSlug)
  const quizCount = challenges.filter((c) => c.type === 'quiz').length
  const codeCount = challenges.filter((c) => c.type === 'challenge').length

  return (
    <>
      <Navbar techSlug={techSlug} />
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

        {challenges.length === 0 ? (
          <p className="text-muted-foreground">No challenges yet.</p>
        ) : (
          <ChallengesExplorer challenges={challenges} />
        )}
      </main>
      <Footer />
    </>
  )
}
