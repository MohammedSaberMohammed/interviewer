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
  const meta = getTechMeta(techSlug)
  const challenges = getAllChallenges().filter((c) => c.techSlug === techSlug)
  const quizCount = challenges.filter((c) => c.type === 'quiz').length
  const codeCount = challenges.filter((c) => c.type === 'challenge').length

  return (
    <>
      <Navbar techSlug={techSlug} />
      <main id="main-content" className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[oklch(0.72_0.18_195)]">
              Practice Arena
            </p>
            <h1 className="font-display text-4xl font-medium tracking-tight">
              {meta?.title ?? techSlug}{' '}
              <em className="italic font-light text-gradient-brand">Challenges</em>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Embedded quizzes &amp; code challenges — sorted by phase.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
              <span className="flex size-6 items-center justify-center rounded-lg bg-[oklch(0.68_0.25_320/0.12)]">
                <HelpCircle className="h-3.5 w-3.5 text-[oklch(0.85_0.20_320)]" aria-hidden="true" />
              </span>
              <span className="font-mono text-sm font-semibold">{quizCount}</span>
              <span className="text-xs text-muted-foreground">quizzes</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
              <span className="flex size-6 items-center justify-center rounded-lg bg-[oklch(0.72_0.18_195/0.12)]">
                <Code2 className="h-3.5 w-3.5 text-[oklch(0.72_0.18_195)]" aria-hidden="true" />
              </span>
              <span className="font-mono text-sm font-semibold">{codeCount}</span>
              <span className="text-xs text-muted-foreground">code</span>
            </div>
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
