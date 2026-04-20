import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPhases } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import type { Phase } from '@/types'

export const metadata: Metadata = {
  title: 'Challenges',
  description: 'Code challenges and quizzes across all .NET interview prep phases.',
}

function ChallengeCount({ count }: { count: number }) {
  return (
    <span className="text-xs text-muted-foreground">
      {count} lesson{count !== 1 ? 's' : ''}
    </span>
  )
}

function PhaseSection({ phase }: { phase: Phase }) {
  const published = phase.lessons.filter((l) => l.status === 'published')
  if (published.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <span aria-hidden="true" className="text-xl">{phase.emoji}</span>
        <h2 className="text-base font-semibold">
          <Link href={`/phases/${phase.slug}`} className="hover:text-primary transition-colors">
            Phase {phase.number}: {phase.title}
          </Link>
        </h2>
        <ChallengeCount count={published.length} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {published.map((lesson) => (
          <Link
            key={lesson.slug}
            href={`/phases/${phase.slug}/${lesson.slug}`}
            className="group flex items-start justify-between rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/50 hover:bg-accent/30 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {lesson.title}
              </p>
              {lesson.summary && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{lesson.summary}</p>
              )}
            </div>
            <DifficultyBadge level={lesson.difficulty} className="shrink-0 ml-3 mt-0.5" />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function ChallengesPage() {
  const phases = getAllPhases()
  const totalPublished = phases.reduce(
    (acc, p) => acc + p.lessons.filter((l) => l.status === 'published').length,
    0
  )

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Challenges</h1>
          <p className="text-muted-foreground">
            {totalPublished} published lesson{totalPublished !== 1 ? 's' : ''} with embedded quizzes and code
            challenges across all phases.
          </p>
        </div>

        <div className="space-y-10">
          {phases.map((phase) => (
            <PhaseSection key={phase.slug} phase={phase} />
          ))}
        </div>

        {totalPublished === 0 && (
          <div className="text-center py-16 rounded-xl border border-border bg-muted/20">
            <p className="text-muted-foreground">No published lessons yet. Check back soon.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
