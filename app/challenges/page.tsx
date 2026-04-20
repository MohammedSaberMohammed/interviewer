import type { Metadata } from 'next'
import Link from 'next/link'
import { Code2, HelpCircle } from 'lucide-react'
import { getAllChallenges } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import type { ExtractedChallenge, Difficulty } from '@/types'

export const metadata: Metadata = {
  title: 'Challenges',
  description: 'Code challenges and quizzes across all .NET interview prep phases.',
}

function ChallengeRow({ c }: { c: ExtractedChallenge }) {
  const href = `/challenges/${c.id}`
  const label = c.title ?? (c.type === 'quiz' ? 'Quiz' : 'Code Challenge')
  const Icon = c.type === 'quiz' ? HelpCircle : Code2

  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/50 hover:bg-accent/30 transition-colors"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
          {label}
        </span>
        {c.prompt && (
          <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-xs">
            {c.prompt}
          </span>
        )}
      </div>
      <DifficultyBadge level={c.difficulty as Difficulty} className="shrink-0" />
    </Link>
  )
}

export default function ChallengesPage() {
  const challenges = getAllChallenges()

  // Group by phase → lesson
  const byPhase = new Map<string, {
    phaseTitle: string
    phaseNumber: number
    lessons: Map<string, { lessonTitle: string; lessonHref: string; challenges: ExtractedChallenge[] }>
  }>()

  for (const c of challenges) {
    if (!byPhase.has(c.phaseSlug)) {
      byPhase.set(c.phaseSlug, { phaseTitle: c.phaseTitle, phaseNumber: c.phaseNumber, lessons: new Map() })
    }
    const phase = byPhase.get(c.phaseSlug)!
    if (!phase.lessons.has(c.lessonSlug)) {
      phase.lessons.set(c.lessonSlug, {
        lessonTitle: c.lessonTitle,
        lessonHref: `/phases/${c.phaseSlug}/${c.lessonSlug}`,
        challenges: [],
      })
    }
    phase.lessons.get(c.lessonSlug)!.challenges.push(c)
  }

  const totalChallenges = challenges.length

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Challenges</h1>
          <p className="text-muted-foreground">
            {totalChallenges} challenge{totalChallenges !== 1 ? 's' : ''} across all phases.
          </p>
        </div>

        <div className="space-y-10">
          {[...byPhase.entries()].map(([phaseSlug, phase]) => (
            <section key={phaseSlug}>
              <h2 className="text-base font-semibold mb-4">
                <Link href={`/phases/${phaseSlug}`} className="hover:text-primary transition-colors">
                  Phase {phase.phaseNumber}: {phase.phaseTitle}
                </Link>
              </h2>

              <div className="space-y-5">
                {[...phase.lessons.entries()].map(([lessonSlug, lesson]) => (
                  <div key={lessonSlug}>
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={lesson.lessonHref}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {lesson.lessonTitle}
                      </Link>
                      <span className="text-xs text-muted-foreground/40">
                        {lesson.challenges.length} item{lesson.challenges.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {lesson.challenges.map((c) => (
                        <ChallengeRow key={c.id} c={c} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {totalChallenges === 0 && (
          <div className="text-center py-16 rounded-xl border border-border bg-muted/20">
            <p className="text-muted-foreground">No challenges yet. Check back soon.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
