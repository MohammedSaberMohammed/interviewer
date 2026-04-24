import type { Metadata } from 'next'
import Link from 'next/link'
import { Code2, HelpCircle, ChevronRight } from 'lucide-react'
import { getAllChallenges } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import type { Difficulty } from '@/types/content'
import type { ExtractedChallenge } from '@/types/challenge'

export const metadata: Metadata = {
  title: 'Challenges',
  description: 'Code challenges and quizzes across all .NET interview prep phases.',
}

function ChallengeRow({ c, index }: { c: ExtractedChallenge; index: number }) {
  const href = `/challenges/${c.id}`
  const label = c.title ?? (c.type === 'quiz' ? 'Quiz' : 'Code Challenge')
  const typeLabel = c.type === 'quiz' ? 'Quiz' : 'Code Challenge'
  const Icon = c.type === 'quiz' ? HelpCircle : Code2

  return (
    <div className="flex items-center rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent transition-all group">
      <Link href={href} className="flex flex-1 items-center gap-3 px-4 py-3 min-w-0">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs text-muted-foreground tabular-nums">{String(index).padStart(2, '0')}</span>
            <span className="font-medium text-sm group-hover:text-primary transition-colors truncate">{label}</span>
          </div>
          <div className="flex items-center gap-3">
            <DifficultyBadge level={c.difficulty as Difficulty} />
            <span className="text-xs text-muted-foreground">{typeLabel}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
      </Link>
    </div>
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
                    <div className="space-y-2">
                      {lesson.challenges.map((c, i) => (
                        <ChallengeRow key={c.id} c={c} index={i + 1} />
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
